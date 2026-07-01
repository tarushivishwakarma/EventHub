import React from 'react';
import { Search, Filter } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, filterStatus, setFilterStatus }) => {
  return (
    <div className="warm-card p-4 flex flex-col md:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={18} />
        </div>
        <input
          type="text"
          placeholder="Search by Student or Event Name..."
          className="warm-input pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Filter className="text-gray-400" size={18} />
        </div>
        <select
          className="warm-input w-full md:w-48 pl-10"
          style={{ cursor: 'pointer' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Registered">Registered</option>
          <option value="Confirmed">Confirmed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
