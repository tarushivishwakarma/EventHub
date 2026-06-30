import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';
import * as api from '../api';

import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadEvents();
  }, [navigate]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await api.fetchMyEvents();
      setEvents(res.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (event) => {
    try {
      const res = await api.createEvent(event);
      setEvents([res.data, ...events]);
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  const updateEvent = async (id, updatedEvent) => {
    try {
      const res = await api.updateEvent(id, updatedEvent);
      setEvents(events.map((evt) => (evt._id === id ? res.data : evt)));
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await api.deleteEvent(id);
      setEvents(events.filter((evt) => evt._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = 
      event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'All' || event.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar totalRegistrations={events.length} />
        
        {loading ? (
          <div className="text-center py-20 text-gray-500 text-xl font-semibold">Loading...</div>
        ) : (
          <>
            <StatsCards events={events} />
            <EventForm 
              addEvent={addEvent} 
              updateEvent={updateEvent} 
              editEvent={editEvent} 
              setEditEvent={setEditEvent} 
            />
            <SearchBar 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              filterStatus={filterStatus} 
              setFilterStatus={setFilterStatus} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard 
                    key={event._id} 
                    event={event} 
                    setEditEvent={setEditEvent} 
                    handleDelete={deleteEvent} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500 font-medium">
                  No registrations found matching your criteria.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
