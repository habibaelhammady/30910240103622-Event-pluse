const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandller');
const AppError = require('./utiles/AppError');
const initSocket = require('./socket.io/Socket.ioHandller');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
require('dotenv').config();
const healthRoutes = require('./routes/healthroutes');

const app = express();
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  swaggerOptions: {
    url: '/swagger.json'
  }
}));

// Swagger JSON endpoint
app.get('/swagger.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

initSocket(io);

// Make sure the database is connected before any API route runs. Awaiting
// here (rather than at boot) keeps the process awake through the handshake.
app.use('/api', async (req, res, next) => {
  // The health check reports on the database, so it must not be blocked by a
  // failure -- but it should still trigger the connection, otherwise a cold
  // instance always reports "disconnected" without ever having tried.
  if (req.path === '/health') {
    await connectDB().catch(() => {});
    return next();
  }

  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('MongoDB connection failed:', err.name, '-', err.message);
    const servers = err.reason && err.reason.servers;
    if (servers) {
      console.error('Topology:', err.reason.type);
      for (const [host, desc] of servers) {
        console.error('  ' + host + ' -> ' + desc.type +
          (desc.error ? ' :: ' + desc.error.message : ' :: no error reported'));
      }
    }
    next(err);
  }
});

app.use('/api/auth', require('./routes/authroutes'));
app.use('/api/events', require('./routes/Eventroutes'));
app.use('/api/messages', require('./routes/Messagerotes'));
app.use('/api/users', require('./routes/Userroutes'));
app.use('/api/registrations', require('./routes/Regstrationroutes'));
app.use('/api/categories', require('./routes/Catagoryroutes'));
app.use('/api', healthRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is healthy' });
});

app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Bind a port straight away so the process is answering requests even before
// the database is up. If the host already listens on this port (some
// platforms import the app and provide their own listener), ignore the
// collision instead of crashing the process.
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} already bound by the host; using its listener.`);
    return;
  }
  throw err;
});

module.exports = app;
module.exports.server = server;
module.exports.io = io;
