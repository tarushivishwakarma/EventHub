import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const EventCard = ({ event, setEditEvent, handleDelete }) => {
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed':
        return { background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' };
      case 'Cancelled':
        return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
      default:
        return { background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7' };
    }
  };

  return (
    <div className="warm-card p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{event.studentName}</h3>
          <p className="text-sm font-semibold text-pink-500">{event.eventName}</p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={getStatusStyle(event.status)}>
          {event.status}
        </span>
      </div>

      <div className="text-sm space-y-2 mb-6 flex-grow text-gray-500">
        <p><span className="font-medium text-gray-600">Dept:</span> {event.department}</p>
        <p><span className="font-medium text-gray-600">Year:</span> {event.year}</p>
        <p><span className="font-medium text-gray-600">Date:</span> {new Date(event.registrationDate).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => setEditEvent(event)}
          className="flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7' }}
        >
          <Edit size={15} /> Edit
        </button>
        <button
          onClick={() => handleDelete(event._id)}
          className="flex-1 py-2.5 rounded-xl flex justify-center items-center gap-2 font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
          style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
        >
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;
