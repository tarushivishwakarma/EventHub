import React, { useState, useEffect, useRef } from 'react';

const EventForm = ({ addEvent, updateEvent, editEvent, setEditEvent }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    email: '',
    phone: '',
    eventName: '',
    department: '',
    year: '',
    status: 'Registered'
  });

  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editEvent) {
      setFormData(editEvent);
    } else {
      setFormData({
        studentName: '',
        email: '',
        phone: '',
        eventName: '',
        department: '',
        year: '',
        status: 'Registered'
      });
    }
  }, [editEvent]);

  useEffect(() => {
    nameInputRef.current?.focus();
  }, [editEvent]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEvent) {
      updateEvent(formData._id, formData);
      setEditEvent(null);
    } else {
      addEvent(formData);
    }
    setFormData({
      studentName: '',
      email: '',
      phone: '',
      eventName: '',
      department: '',
      year: '',
      status: 'Registered'
    });
    nameInputRef.current?.focus();
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editEvent ? 'Update Registration' : 'New Registration'}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student Name</label>
          <input
            type="text"
            name="studentName"
            ref={nameInputRef}
            value={formData.studentName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
          <select
            name="eventName"
            value={formData.eventName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="" disabled>Select an Event</option>
            <option value="Tech Symposium 2026">Tech Symposium 2026</option>
            <option value="Cultural Fest">Cultural Fest</option>
            <option value="Annual Sports Meet">Annual Sports Meet</option>
            <option value="Hackathon">Hackathon</option>
            <option value="AI Workshop">AI Workshop</option>
            <option value="Robotics Expo">Robotics Expo</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          >
            <option value="" disabled>Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        {editEvent && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
            >
              <option value="Registered">Registered</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          {editEvent && (
            <button
              type="button"
              onClick={() => setEditEvent(null)}
              className="px-6 py-2 border rounded-lg hover:bg-gray-50 text-gray-700 font-medium transition"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md transition"
          >
            {editEvent ? 'Update' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
