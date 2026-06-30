import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

const EventCard = ({ event, setEditEvent, handleDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition flex flex-col h-full border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{event.studentName}</h3>
          <p className="text-green-600 font-semibold">{event.eventName}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(event.status)}`}>
          {event.status}
        </span>
      </div>
      
      <div className="text-sm text-gray-600 space-y-2 mb-6 flex-grow">
        <p><span className="font-medium text-gray-700">Dept:</span> {event.department}</p>
        <p><span className="font-medium text-gray-700">Year:</span> {event.year}</p>
        <p><span className="font-medium text-gray-700">Date:</span> {new Date(event.registrationDate).toLocaleDateString()}</p>
      </div>

      <div className="flex gap-2 mt-auto">
        <button
          onClick={() => setEditEvent(event)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg flex justify-center items-center gap-2 font-medium transition"
        >
          <Edit size={16} /> Edit
        </button>
        <button
          onClick={() => handleDelete(event._id)}
          className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg flex justify-center items-center gap-2 font-medium transition"
        >
          <Trash2 size={16} /> Delete
        </button>
      </div>
    </div>
  );
};

export default EventCard;
