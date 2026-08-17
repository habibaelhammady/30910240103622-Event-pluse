const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandller');
const AppError = require('./utiles/AppError');
const initSocket = require('./socket.io/Socket.ioHandller');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const mongoose = require('mongoose');
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

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('MongoDB connection error:', err));

  


const server = http.createServer(app); 
const io = new Server(server,{
    cors:{
        origin: '*',
    }
});

initSocket(io);

app.use('/api/auth', require('./routes/authroutes'));
  app.use('/api/events', require('./routes/Eventroutes'));
  app.use('/api/messages', require('./routes/Messagerotes'));
  app.use('/api/users', require('./routes/Userroutes'));
  app.use('/api/registrations', require('./routes/Regstrationroutes'));
  app.use('/api/categories', require('./routes/Catagoryroutes'));
// Temporarily disabled - healthRoutes loading as empty object
 app.use('/api', healthRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});


app.all(/.*/, (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(()=>{
    server.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
})

module.exports = server;