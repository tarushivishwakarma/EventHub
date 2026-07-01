import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { LogOut, Users, Calendar, Plus, Edit2, Trash2, ClipboardList, Search, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [activeTab, setActiveTab] = useState('registrations');
  const [loading, setLoading] = useState(true);
  const [regSearchTerm, setRegSearchTerm] = useState('');
  const [expandedStudent, setExpandedStudent] = useState(null);
  const navigate = useNavigate();

  const [eventForm, setEventForm] = useState({ title: '', date: '', description: '' });
  const [editEventId, setEditEventId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { navigate('/login'); return; }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') { navigate('/dashboard'); return; }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, regsRes] = await Promise.all([api.fetchUsers(), api.fetchOfficialEvents(), api.fetchAllRegistrations()]);
      setUsers(usersRes.data); setEvents(eventsRes.data); setRegistrations(regsRes.data);
    } catch (error) { console.error('Error fetching admin data:', error); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem('token'); localStorage.removeItem('user'); navigate('/'); };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editEventId) {
        const res = await api.rescheduleOfficialEvent(editEventId, { date: eventForm.date });
        setEvents(events.map(ev => ev._id === editEventId ? res.data : ev));
        setEditEventId(null);
      } else {
        const res = await api.createOfficialEvent(eventForm);
        setEvents([...events, res.data]);
      }
      setEventForm({ title: '', date: '', description: '' });
    } catch (error) { console.error('Error saving event:', error); }
  };

  const handleEditEvent = (ev) => {
    setEditEventId(ev._id);
    const dateStr = ev.date ? new Date(ev.date).toISOString().split('T')[0] : '';
    setEventForm({ title: ev.title, date: dateStr, description: ev.description || '' });
  };

  const handleDeleteEvent = async (id) => {
    try { await api.deleteOfficialEvent(id); setEvents(events.filter(ev => ev._id !== id)); }
    catch (error) { console.error('Error deleting event:', error); }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return { background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' };
      case 'Cancelled': return { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' };
      default: return { background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7' };
    }
  };

  const groupedRegistrations = registrations.reduce((acc, reg) => {
    if (!acc[reg.email]) acc[reg.email] = { studentName: reg.studentName, email: reg.email, department: reg.department, year: reg.year, events: [] };
    acc[reg.email].events.push(reg);
    return acc;
  }, {});

  const filteredGrouped = Object.values(groupedRegistrations).filter(student => {
    const term = regSearchTerm.toLowerCase();
    return student.studentName.toLowerCase().includes(term) || student.email.toLowerCase().includes(term) ||
      student.department.toLowerCase().includes(term) || student.year.toLowerCase().includes(term) ||
      student.events.some(ev => ev.eventName.toLowerCase().includes(term));
  });

  const totalRegCount = registrations.length;
  const confirmedCount = registrations.filter(r => r.status === 'Confirmed').length;
  const cancelledCount = registrations.filter(r => r.status === 'Cancelled').length;

  return (
    <div className="min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Navbar */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center mb-6"
        style={{ background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', boxShadow: '0 4px 15px rgba(236,72,153,0.25)' }}>
            <Sparkles size={22} color="#fff" />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">Admin Dashboard</h1>
        </div>
        <button onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', boxShadow: '0 4px 15px rgba(236,72,153,0.2)' }}>
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {[
            { key: 'registrations', icon: <ClipboardList size={18} />, label: 'All Registrations', count: totalRegCount },
            { key: 'users', icon: <Users size={18} />, label: 'Registered Users', count: users.length },
            { key: 'events', icon: <Calendar size={18} />, label: 'Manage Events', count: events.length }
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200"
              style={{
                background: activeTab === tab.key ? 'linear-gradient(135deg, #f59e0b, #ec4899)' : '#fff',
                color: activeTab === tab.key ? '#fff' : '#64748b',
                border: activeTab === tab.key ? 'none' : '1px solid #e2e8f0',
                boxShadow: activeTab === tab.key ? '0 4px 20px rgba(236,72,153,0.25)' : '0 2px 8px rgba(0,0,0,0.04)',
              }}>
              {tab.icon} {tab.label}
              <span className="px-2 py-0.5 rounded-full text-xs" style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#f8fafc',
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <div style={{ width: 48, height: 48, border: '3px solid #fce7f3', borderTop: '3px solid #ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p className="text-gray-400 font-semibold">Loading data...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {/* REGISTRATIONS TAB */}
            {activeTab === 'registrations' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Total Registrations', value: totalRegCount, color: '#ec4899', bg: '#fdf2f8', border: '#fce7f3' },
                    { label: 'Unique Students', value: Object.keys(groupedRegistrations).length, color: '#3b82f6', bg: '#eff6ff', border: '#dbeafe' },
                    { label: 'Confirmed', value: confirmedCount, color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
                    { label: 'Cancelled', value: cancelledCount, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' }
                  ].map((card, i) => (
                    <div key={i} className="rounded-2xl p-5" style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">{card.label}</p>
                      <p className="text-2xl font-extrabold" style={{ color: card.color }}>{card.value}</p>
                    </div>
                  ))}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                  <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search by name, email, branch, year, or event..."
                    value={regSearchTerm} onChange={e => setRegSearchTerm(e.target.value)}
                    className="warm-input pl-10 w-full" />
                </div>

                {/* Student cards */}
                <div className="flex flex-col gap-3">
                  {filteredGrouped.length > 0 ? filteredGrouped.map((student) => {
                    const isExpanded = expandedStudent === student.email;
                    return (
                      <div key={student.email} className="warm-card overflow-hidden transition-all duration-300"
                        style={{ boxShadow: isExpanded ? '0 8px 32px rgba(236,72,153,0.1)' : '0 2px 12px rgba(0,0,0,0.04)' }}>
                        <div onClick={() => setExpandedStudent(isExpanded ? null : student.email)}
                          className="p-5 grid gap-4 items-center cursor-pointer hover:bg-gray-50 transition-colors"
                          style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr auto' }}>
                          <div>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Name</p>
                            <p className="text-sm font-bold text-gray-800">{student.studentName}</p>
                          </div>
                          <div>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Year</p>
                            <p className="text-sm font-semibold text-pink-500">{student.year}</p>
                          </div>
                          <div>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Branch</p>
                            <p className="text-sm font-semibold text-amber-600">{student.department}</p>
                          </div>
                          <div>
                            <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-400 mb-0.5">Events</p>
                            <div className="flex gap-1 flex-wrap">
                              {student.events.map((ev, i) => (
                                <span key={i} className="text-xs font-semibold px-2 py-0.5 rounded-md"
                                  style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fce7f3' }}>{ev.eventName}</span>
                              ))}
                            </div>
                          </div>
                          <div className="text-gray-400">{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</div>
                        </div>

                        {isExpanded && (
                          <div className="px-5 pb-5 border-t border-gray-100">
                            <p className="text-gray-400 text-sm mt-3 mb-2">📧 {student.email}</p>
                            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                              {student.events.map((ev, i) => (
                                <div key={ev._id || i} className="rounded-xl p-4" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="text-pink-500 font-bold text-sm">{ev.eventName}</span>
                                    <span className="px-2.5 py-0.5 rounded-full text-[0.7rem] font-bold" style={getStatusStyle(ev.status)}>{ev.status}</span>
                                  </div>
                                  <div className="flex gap-4 text-xs text-gray-400">
                                    <span>📱 {ev.phone}</span>
                                    <span>📅 {new Date(ev.registrationDate).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="warm-card p-8 text-center text-gray-400 font-semibold">No registrations found matching your search.</div>
                  )}
                </div>
              </div>
            )}

            {/* USERS TAB */}
            {activeTab === 'users' && (
              <div className="warm-card p-6">
                <h2 className="text-lg font-extrabold text-gray-800 mb-4">All Registered Users ({users.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 0.3rem' }}>
                    <thead>
                      <tr>
                        {['Username', 'Email', 'Full Name', 'Course'].map(h => (
                          <th key={h} className="text-left text-[0.7rem] font-bold uppercase tracking-wider text-gray-400 px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800 border-b border-gray-100">{u.username}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">{u.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">{u.fullName || '—'}</td>
                          <td className="px-4 py-3 text-sm text-gray-500 border-b border-gray-100">{u.course || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EVENTS TAB */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="warm-card p-6">
                  <h2 className="text-lg font-extrabold text-gray-800 mb-4">
                    {editEventId ? '✏️ Reschedule Event' : '➕ Add New Event'}
                  </h2>
                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Event Title</label>
                      <input type="text" required disabled={!!editEventId} value={eventForm.title}
                        onChange={e => setEventForm({...eventForm, title: e.target.value})}
                        className="warm-input" style={{ opacity: editEventId ? 0.5 : 1 }} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Date</label>
                      <input type="date" required value={eventForm.date}
                        onChange={e => setEventForm({...eventForm, date: e.target.value})}
                        className="warm-input" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                      <textarea disabled={!!editEventId} value={eventForm.description}
                        onChange={e => setEventForm({...eventForm, description: e.target.value})}
                        rows="3" className="warm-input" style={{ resize: 'vertical', opacity: editEventId ? 0.5 : 1 }}></textarea>
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" className="btn-glow flex-1 flex items-center justify-center gap-2 py-2.5 text-sm">
                        {editEventId ? <><Edit2 size={15} /> Save Changes</> : <><Plus size={15} /> Add Event</>}
                      </button>
                      {editEventId && (
                        <button type="button" onClick={() => { setEditEventId(null); setEventForm({ title: '', date: '', description: '' }); }}
                          className="px-4 py-2.5 rounded-xl font-bold text-sm text-gray-500 transition-all"
                          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>Cancel</button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-2">
                  <h2 className="text-lg font-extrabold text-gray-800 mb-4">Official Events ({events.length})</h2>
                  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {events.map(ev => (
                      <div key={ev._id} className="warm-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                        <h3 className="font-bold text-pink-500 text-base mb-1">{ev.title}</h3>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                          <Calendar size={13} /> {new Date(ev.date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500 mb-4 leading-relaxed">{ev.description}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEditEvent(ev)}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                            style={{ background: '#fffbeb', color: '#d97706', border: '1px solid #fef3c7' }}>Reschedule</button>
                          <button onClick={() => handleDeleteEvent(ev._id)}
                            className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:-translate-y-0.5"
                            style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
