import React from 'react';
import { Users, CheckCircle, ClipboardList, XCircle } from 'lucide-react';

const StatsCards = ({ events }) => {
  const total = events.length;
  const confirmed = events.filter(e => e.status === 'Confirmed').length;
  const registered = events.filter(e => e.status === 'Registered').length;
  const cancelled = events.filter(e => e.status === 'Cancelled').length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-500 flex items-center justify-between hover:shadow-lg transition">
        <div>
          <p className="text-gray-500 text-sm font-semibold">Total</p>
          <p className="text-2xl font-bold text-gray-800">{total}</p>
        </div>
        <Users className="text-green-500" size={32} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-green-600 flex items-center justify-between hover:shadow-lg transition">
        <div>
          <p className="text-gray-500 text-sm font-semibold">Confirmed</p>
          <p className="text-2xl font-bold text-gray-800">{confirmed}</p>
        </div>
        <CheckCircle className="text-green-600" size={32} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-yellow-500 flex items-center justify-between hover:shadow-lg transition">
        <div>
          <p className="text-gray-500 text-sm font-semibold">Registered</p>
          <p className="text-2xl font-bold text-gray-800">{registered}</p>
        </div>
        <ClipboardList className="text-yellow-500" size={32} />
      </div>
      <div className="bg-white p-4 rounded-xl shadow-md border-l-4 border-red-500 flex items-center justify-between hover:shadow-lg transition">
        <div>
          <p className="text-gray-500 text-sm font-semibold">Cancelled</p>
          <p className="text-2xl font-bold text-gray-800">{cancelled}</p>
        </div>
        <XCircle className="text-red-500" size={32} />
      </div>
    </div>
  );
};

export default StatsCards;
