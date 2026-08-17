const Message = require('../models/Message');

const createMessage = async (req, res) => {
    try{
        const{name,email,content}= req.body;
        const newMessage = await Message.create({name,email,content});
        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error: error.message });
    }
};

const getEventMessages = async (req, res) => {
  try {
    const { eventId } = req.params;
    const messages = await Message.find({ event: eventId })
      .populate('sender', 'name email')
      .sort({ createdAt: 1 });

    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteMessage = async (req, res) => {
    try{
        const deletedMessage = await Message.findByIdAndDelete(req.params.id);
        if (!deletedMessage){
            return res.status(404).json({ message: 'Message not found' });
        }
        res.status(200).json({ message: 'Message deleted successfully' });
    }catch (error) {
        res.status(500).json({ message: 'server error', error: error.message });
    }
};
module.exports = {
    createMessage,
    getEventMessages,
    deleteMessage
};

