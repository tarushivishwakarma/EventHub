import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, Save, X } from 'lucide-react';

const EventForm = ({ addEvent, updateEvent, editEvent, setEditEvent }) => {
  const [formData, setFormData] = useState({
    studentName: '', email: '', phone: '', eventName: '', department: '', year: '', status: 'Registered'
  });
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (editEvent) setFormData(editEvent);
    else setFormData({ studentName: '', email: '', phone: '', eventName: '', department: '', year: '', status: 'Registered' });
  }, [editEvent]);

  useEffect(() => { nameInputRef.current?.focus(); }, [editEvent]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editEvent) { updateEvent(formData._id, formData); setEditEvent(null); }
    else addEvent(formData);
    setFormData({ studentName: '', email: '', phone: '', eventName: '', department: '', year: '', status: 'Registered' });
    nameInputRef.current?.focus();
  };

  return (
    <div className="warm-card p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
      <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
        {editEvent ? <><Save size={20} className="text-pink-500" /> Update Registration</> : <><PlusCircle size={20} className="text-pink-500" /> New Registration</>}
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Student Name</label>
          <input type="text" name="studentName" ref={nameInputRef} value={formData.studentName} onChange={handleChange} required placeholder="Enter student name" className="warm-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email" className="warm-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter phone number" className="warm-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Event Name</label>
          <select name="eventName" value={formData.eventName} onChange={handleChange} required className="warm-input" style={{ cursor: 'pointer' }}>
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
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Department</label>
          <input type="text" name="department" value={formData.department} onChange={handleChange} required placeholder="Enter department" className="warm-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Year</label>
          <select name="year" value={formData.year} onChange={handleChange} required className="warm-input" style={{ cursor: 'pointer' }}>
            <option value="" disabled>Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
        {editEvent && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="warm-input" style={{ cursor: 'pointer' }}>
              <option value="Registered">Registered</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        )}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4">
          {editEvent && (
            <button type="button" onClick={() => setEditEvent(null)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-gray-500 transition-all hover:-translate-y-0.5"
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <X size={16} /> Cancel
            </button>
          )}
          <button type="submit" className="btn-glow flex items-center gap-2 px-8 py-2.5 text-sm">
            {editEvent ? <><Save size={16} /> Update</> : <><PlusCircle size={16} /> Register</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
