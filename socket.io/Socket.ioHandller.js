const jwt = require('jsonwebtoken');
const Message = require('../models/Message');

const initSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Join event room
        socket.on('joinRoom', (room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });

        // Leave event room
        socket.on('leaveRoom', (room) => {
            socket.leave(room);
            console.log(`User left room: ${room}`);
        });

        // Send announcement (admin only)
        socket.on('sendAnnouncement', async (data) => {
            try{
                const{token, eventId, content} = data;
                if(!token){
                    return socket.emit('error', { message: 'Authentication token is required' });
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if(decoded.role !== 'admin'){ 
                    return socket.emit('error', { message: 'Only admins can send announcements' });
                }
                
                io.to(eventId).emit('announcement', {
                    content,
                    from: decoded.name,
                    timestamp: new Date()
                });
            } catch(error) {
                socket.emit('error', { message: error.message });
            }
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });
    });
};

module.exports = initSocket;