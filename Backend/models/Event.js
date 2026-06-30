const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventName: { type: String, required: true },
  department: { type: String, required: true },
  year: { type: String, required: true },
  registrationDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Registered', 'Confirmed', 'Cancelled'], default: 'Registered' }
});

module.exports = mongoose.model('Event', eventSchema);
