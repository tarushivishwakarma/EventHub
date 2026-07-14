import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatsCards from '../components/StatsCards';
import SearchBar from '../components/SearchBar';
import EventForm from '../components/EventForm';
import EventCard from '../components/EventCard';
import * as api from '../api';
import { useNavigate } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [officialEvents, setOfficialEvents] = useState([]);
  const [editEvent, setEditEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    loadEvents();
  }, [navigate]);

  const loadEvents = async () => {
    try { 
      setLoading(true); 
      const [resMy, resOff] = await Promise.all([
        api.fetchMyEvents(),
        api.fetchStudentOfficialEvents()
      ]); 
      setEvents(resMy.data); 
      setOfficialEvents(resOff.data);
    }
    catch (error) { console.error('Error fetching events:', error); }
    finally { setLoading(false); }
  };

  const addEvent = async (event) => {
    try { const res = await api.createEvent(event); setEvents([res.data, ...events]); }
    catch (error) { console.error('Error creating event:', error); }
  };

  const updateEvent = async (id, updatedEvent) => {
    try { const res = await api.updateEvent(id, updatedEvent); setEvents(events.map((evt) => (evt._id === id ? res.data : evt))); }
    catch (error) { console.error('Error updating event:', error); }
  };

  const deleteEvent = async (id) => {
    try { await api.deleteEvent(id); setEvents(events.filter((evt) => evt._id !== id)); }
    catch (error) { console.error('Error deleting event:', error); }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.eventName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'All' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar totalRegistrations={events.length} />
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div style={{
              width: 48, height: 48,
              border: '3px solid #fce7f3',
              borderTop: '3px solid #ec4899',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }} />
            <p className="text-gray-400 font-semibold">Loading your events...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <StatsCards events={events} />
            
            {/* Official Events Section */}
            {officialEvents.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-extrabold text-gray-800 mb-4">Official Events</h2>
                <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {officialEvents.map((ev, i) => (
                    <div key={ev._id} className="warm-card p-5 animate-fade-in transition-all duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                      <h3 className="font-bold text-pink-500 text-base mb-1">{ev.title}</h3>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                        <Calendar size={13} /> {new Date(ev.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500 mb-2 leading-relaxed">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <EventForm addEvent={addEvent} updateEvent={updateEvent} editEvent={editEvent} setEditEvent={setEditEvent} />
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} filterStatus={filterStatus} setFilterStatus={setFilterStatus} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event, i) => (
                  <div key={event._id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}>
                    <EventCard event={event} setEditEvent={setEditEvent} handleDelete={deleteEvent} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-16 animate-fade-in">
                  <div className="warm-card p-8 max-w-md mx-auto">
                    <p className="text-gray-400 font-semibold">No registrations found matching your criteria.</p>
                  </div>
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
