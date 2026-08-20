const mongoose = require('mongoose');

// Serverless platforms freeze the process between requests, so a connection
// started at boot can be suspended mid-handshake and never finish. Cache the
// promise and await it inside the request instead, where the process is awake.
let connectionPromise = null;

const connectDB = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
      .then((m) => {
        console.log('MongoDB is connected');
        return m;
      })
      .catch((err) => {
        // Clear the cache so the next request retries instead of replaying a
        // rejected promise forever.
        connectionPromise = null;
        throw err;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;
