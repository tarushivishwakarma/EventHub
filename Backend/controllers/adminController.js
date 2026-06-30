const User = require('../models/User');
const OfficialEvent = require('../models/OfficialEvent');
const Event = require('../models/Event');

exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Event.find().sort({ registrationDate: -1 });
    res.status(200).json(registrations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOfficialEvent = async (req, res) => {
  try {
    const { title, date, description } = req.body;
    const newEvent = new OfficialEvent({
      title,
      date,
      description,
      createdBy: req.admin.id
    });
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOfficialEvents = async (req, res) => {
  try {
    const events = await OfficialEvent.find().sort({ date: 1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rescheduleOfficialEvent = async (req, res) => {
  try {
    const { date } = req.body;
    const updatedEvent = await OfficialEvent.findByIdAndUpdate(
      req.params.id,
      { date },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOfficialEvent = async (req, res) => {
  try {
    const deletedEvent = await OfficialEvent.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
