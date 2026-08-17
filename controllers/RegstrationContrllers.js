const Registration = require('../models/Rigstration');
const Event = require('../models/Event');


const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const userId = req.user.userId; 

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingRegistration = await Registration.findOne({ user: userId, event: eventId });
    if (existingRegistration) {
      return res.status(400).json({ message: 'You are already registered for this event' });
    }


    const activeRegistrationsCount = await Registration.countDocuments({ event: eventId });
    if (event.capacity && activeRegistrationsCount >= event.capacity) {
      return res.status(400).json({ message: 'Event is full. Capacity reached.' });
    }


    const registration = await Registration.create({
      user: userId,
      event: eventId
    });

    const populatedRegistration = await registration.populate('event');
    return res.status(201).json(populatedRegistration);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const userId = req.user.userId;

    
    const registrations = await Registration.find({ user: userId })
      .populate({
        path: 'event',
        populate: { path: 'category' } 
      });

    return res.status(200).json(registrations);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};
const cancelRegistration = async (req, res) => {
  try {
    const registrationId = req.params.id;
    const userId = req.user.userId;

    const registration = await Registration.findById(registrationId);

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    if (registration.user.toString() !== userId) {
      return res.status(403).json({ message: 'Forbidden: You can only cancel your own registrations' });
    }


    await Registration.findByIdAndDelete(registrationId);

    return res.status(200).json({ message: 'Registration cancelled successfully and place freed' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration
};