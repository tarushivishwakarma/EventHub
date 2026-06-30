import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import { LogOut, Users, Calendar, Plus, Edit2, Trash2, ClipboardList, Search, ChevronDown, ChevronUp } from 'lucide-react';

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
    
    if (!token || !userStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, eventsRes, regsRes] = await Promise.all([
        api.fetchUsers(),
        api.fetchOfficialEvents(),
        api.fetchAllRegistrations()
      ]);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
      setRegistrations(regsRes.data);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

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
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (ev) => {
    setEditEventId(ev._id);
    const dateStr = ev.date ? new Date(ev.date).toISOString().split('T')[0] : '';
    setEventForm({ title: ev.title, date: dateStr, description: ev.description || '' });
  };

  const handleDeleteEvent = async (id) => {
    try {
      await api.deleteOfficialEvent(id);
      setEvents(events.filter(ev => ev._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-amber-100 text-amber-700 border border-amber-200';
    }
  };

  const groupedRegistrations = registrations.reduce((acc, reg) => {
    if (!acc[reg.email]) {
      acc[reg.email] = {
        studentName: reg.studentName,
        email: reg.email,
        department: reg.department,
        year: reg.year,
        events: []
      };
    }
    acc[reg.email].events.push(reg);
    return acc;
  }, {});

  const filteredGrouped = Object.values(groupedRegistrations).filter(student => {
    const term = regSearchTerm.toLowerCase();
    return student.studentName.toLowerCase().includes(term) ||
           student.email.toLowerCase().includes(term) ||
           student.department.toLowerCase().includes(term) ||
           student.year.toLowerCase().includes(term) ||
           student.events.some(ev => ev.eventName.toLowerCase().includes(term));
  });

  const totalRegCount = registrations.length;
  const confirmedCount = registrations.filter(r => r.status === 'Confirmed').length;
  const cancelledCount = registrations.filter(r => r.status === 'Cancelled').length;

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', fontFamily: "'Inter', 'Segoe UI', sans-serif", paddingBottom: '3rem' }}>
      <nav style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #a855f7, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardList size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', margin: 0, letterSpacing: '-0.02em' }}>Admin Dashboard</h1>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            color: '#fff', border: 'none', padding: '0.6rem 1.4rem',
            borderRadius: 50, fontWeight: 700, fontSize: '0.85rem',
            cursor: 'pointer', transition: 'all 0.2s',
            boxShadow: '0 4px 15px rgba(239,68,68,0.3)'
          }}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {[
            { key: 'registrations', icon: <ClipboardList size={18} />, label: 'All Registrations', count: totalRegCount },
            { key: 'users', icon: <Users size={18} />, label: 'Registered Users', count: users.length },
            { key: 'events', icon: <Calendar size={18} />, label: 'Manage Events', count: events.length }
          ].map(tab => (
            <button 
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: 14,
                fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
                border: 'none', transition: 'all 0.25s',
                background: activeTab === tab.key 
                  ? 'linear-gradient(135deg, #a855f7, #6366f1)' 
                  : 'rgba(255,255,255,0.07)',
                color: activeTab === tab.key ? '#fff' : 'rgba(255,255,255,0.6)',
                boxShadow: activeTab === tab.key ? '0 4px 20px rgba(168,85,247,0.3)' : 'none',
                backdropFilter: 'blur(10px)'
              }}
            >
              {tab.icon} {tab.label}
              <span style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                padding: '0.15rem 0.6rem', borderRadius: 20, fontSize: '0.75rem',
                marginLeft: '0.25rem'
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'rgba(255,255,255,0.5)', fontSize: '1.2rem', fontWeight: 600 }}>
            <div style={{
              width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)',
              borderTop: '3px solid #a855f7', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 1rem'
            }}></div>
            Loading data...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            {activeTab === 'registrations' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  {[
                    { label: 'Total Registrations', value: totalRegCount, color: '#a855f7', bg: 'rgba(168,85,247,0.12)' },
                    { label: 'Unique Students', value: Object.keys(groupedRegistrations).length, color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' },
                    { label: 'Confirmed', value: confirmedCount, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
                    { label: 'Cancelled', value: cancelledCount, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' }
                  ].map((card, i) => (
                    <div key={i} style={{
                      background: card.bg, backdropFilter: 'blur(10px)',
                      borderRadius: 16, padding: '1.25rem 1.5rem',
                      border: `1px solid ${card.color}22`
                    }}>
                      <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600, margin: '0 0 0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</p>
                      <p style={{ color: card.color, fontSize: '2rem', fontWeight: 800, margin: 0 }}>{card.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                  <Search size={18} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.35)' }} />
                  <input
                    type="text"
                    placeholder="Search by name, email, branch, year, or event..."
                    value={regSearchTerm}
                    onChange={e => setRegSearchTerm(e.target.value)}
                    style={{
                      width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem',
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 14, color: '#fff', fontSize: '0.9rem',
                      outline: 'none', boxSizing: 'border-box',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(168,85,247,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {filteredGrouped.length > 0 ? filteredGrouped.map((student, idx) => {
                    const isExpanded = expandedStudent === student.email;
                    return (
                      <div key={student.email} style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: 18,
                        border: '1px solid rgba(255,255,255,0.08)',
                        overflow: 'hidden',
                        transition: 'all 0.3s',
                        boxShadow: isExpanded ? '0 8px 32px rgba(168,85,247,0.15)' : 'none'
                      }}>
                        <div 
                          onClick={() => setExpandedStudent(isExpanded ? null : student.email)}
                          style={{
                            padding: '1.25rem 1.5rem',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr auto',
                            gap: '1rem',
                            alignItems: 'center',
                            cursor: 'pointer',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Name</p>
                            <p style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>{student.studentName}</p>
                          </div>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Year</p>
                            <p style={{ color: '#c4b5fd', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{student.year}</p>
                          </div>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Branch</p>
                            <p style={{ color: '#93c5fd', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{student.department}</p>
                          </div>
                          <div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', fontWeight: 600, margin: '0 0 0.2rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Events</p>
                            <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                              {student.events.map((ev, i) => (
                                <span key={i} style={{
                                  background: 'rgba(168,85,247,0.15)', color: '#c4b5fd',
                                  padding: '0.15rem 0.6rem', borderRadius: 8,
                                  fontSize: '0.75rem', fontWeight: 600,
                                  border: '1px solid rgba(168,85,247,0.2)'
                                }}>{ev.eventName}</span>
                              ))}
                            </div>
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.4)' }}>
                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                          </div>
                        </div>

                        {isExpanded && (
                          <div style={{
                            padding: '0 1.5rem 1.25rem',
                            borderTop: '1px solid rgba(255,255,255,0.06)'
                          }}>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', margin: '1rem 0 0.3rem' }}>
                              📧 {student.email}
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem', marginTop: '0.75rem' }}>
                              {student.events.map((ev, i) => (
                                <div key={ev._id || i} style={{
                                  background: 'rgba(255,255,255,0.04)',
                                  borderRadius: 12, padding: '1rem',
                                  border: '1px solid rgba(255,255,255,0.06)'
                                }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <span style={{ color: '#a855f7', fontWeight: 700, fontSize: '0.9rem' }}>{ev.eventName}</span>
                                    <span style={{
                                      padding: '0.2rem 0.7rem', borderRadius: 20,
                                      fontSize: '0.7rem', fontWeight: 700,
                                      ...(ev.status === 'Confirmed' 
                                        ? { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }
                                        : ev.status === 'Cancelled'
                                        ? { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
                                        : { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' })
                                    }}>{ev.status}</span>
                                  </div>
                                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>
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
                    <div style={{
                      textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.03)', borderRadius: 18, fontWeight: 600
                    }}>
                      No registrations found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(12px)',
                borderRadius: 18, padding: '1.5rem',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
                  All Registered Users ({users.length})
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.4rem' }}>
                    <thead>
                      <tr>
                        {['Username', 'Email', 'Full Name', 'Course'].map(h => (
                          <th key={h} style={{
                            padding: '0.75rem 1rem', textAlign: 'left',
                            color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem',
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em'
                          }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} style={{ transition: 'background 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '0.85rem 1rem', color: '#fff', fontWeight: 600, fontSize: '0.9rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{u.username}</td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{u.email}</td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{u.fullName || '—'}</td>
                          <td style={{ padding: '0.85rem 1rem', color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{u.course || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(12px)',
                  borderRadius: 18, padding: '1.5rem',
                  border: '1px solid rgba(255,255,255,0.08)',
                  alignSelf: 'start'
                }}>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    {editEventId ? '✏️ Reschedule Event' : '➕ Add New Event'}
                  </h2>
                  <form onSubmit={handleEventSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Event Title</label>
                      <input 
                        type="text" required disabled={!!editEventId}
                        value={eventForm.title}
                        onChange={e => setEventForm({...eventForm, title: e.target.value})}
                        style={{
                          width: '100%', padding: '0.7rem 1rem',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none',
                          boxSizing: 'border-box',
                          opacity: editEventId ? 0.5 : 1
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Date</label>
                      <input 
                        type="date" required
                        value={eventForm.date}
                        onChange={e => setEventForm({...eventForm, date: e.target.value})}
                        style={{
                          width: '100%', padding: '0.7rem 1rem',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Description</label>
                      <textarea 
                        disabled={!!editEventId}
                        value={eventForm.description}
                        onChange={e => setEventForm({...eventForm, description: e.target.value})}
                        rows="3"
                        style={{
                          width: '100%', padding: '0.7rem 1rem',
                          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 10, color: '#fff', fontSize: '0.9rem', outline: 'none',
                          resize: 'vertical', boxSizing: 'border-box',
                          opacity: editEventId ? 0.5 : 1
                        }}
                      ></textarea>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        background: 'linear-gradient(135deg, #a855f7, #6366f1)',
                        color: '#fff', border: 'none', padding: '0.75rem',
                        borderRadius: 10, fontWeight: 700, fontSize: '0.85rem',
                        cursor: 'pointer', transition: 'all 0.2s',
                        boxShadow: '0 4px 15px rgba(168,85,247,0.3)'
                      }}>
                        {editEventId ? <Edit2 size={15} /> : <Plus size={15} />}
                        {editEventId ? 'Save Changes' : 'Add Event'}
                      </button>
                      {editEventId && (
                        <button type="button" onClick={() => { setEditEventId(null); setEventForm({ title: '', date: '', description: '' }); }}
                          style={{
                            background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)',
                            border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1.2rem',
                            borderRadius: 10, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                          }}>
                          Cancel
                        </button>
                      )}
                    </div>
                  </form>
                </div>
                
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>
                    Official Events ({events.length})
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {events.map(ev => (
                      <div key={ev._id} style={{
                        background: 'rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16, padding: '1.25rem',
                        border: '1px solid rgba(255,255,255,0.08)',
                        transition: 'all 0.25s'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                      >
                        <h3 style={{ color: '#c4b5fd', fontWeight: 700, fontSize: '1.05rem', margin: '0 0 0.3rem' }}>{ev.title}</h3>
                        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={13} /> {new Date(ev.date).toLocaleDateString()}
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.5 }}>{ev.description}</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button onClick={() => handleEditEvent(ev)} style={{
                            flex: 1, padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)',
                            background: 'rgba(99,102,241,0.1)', color: '#818cf8', fontWeight: 600,
                            fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                          }}>
                            Reschedule
                          </button>
                          <button onClick={() => handleDeleteEvent(ev._id)} style={{
                            flex: 1, padding: '0.5rem', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)',
                            background: 'rgba(239,68,68,0.1)', color: '#f87171', fontWeight: 600,
                            fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s'
                          }}>
                            Delete
                          </button>
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
