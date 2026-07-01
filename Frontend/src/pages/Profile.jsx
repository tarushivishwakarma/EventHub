import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api';
import Navbar from '../components/Navbar';
import { User, Mail, BookOpen, FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState({ username: '', email: '', fullName: '', course: '', bio: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    fetchProfile();
  }, [navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await api.getProfile();
      setProfile({ username: data.username || '', email: data.email || '', fullName: data.fullName || '', course: data.course || '', bio: data.bio || '' });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (error.response?.status === 401) { localStorage.removeItem('token'); navigate('/login'); }
    } finally { setLoading(false); }
  };

  const handleChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.updateProfile({ fullName: profile.fullName, course: profile.course, bio: profile.bio });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) { console.error('Error updating profile:', error); setMessage('Failed to update profile.'); }
  };

  return (
    <div className="min-h-screen pb-12" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar totalRegistrations={0} hideStats={true} />
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div style={{ width: 48, height: 48, border: '3px solid #fce7f3', borderTop: '3px solid #ec4899', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
            <p className="text-gray-400 font-semibold">Loading Profile...</p>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto mt-4 animate-fade-in">
            <div className="warm-card p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', boxShadow: '0 8px 24px rgba(236,72,153,0.2)' }}>
                  <User size={32} color="#fff" />
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-800">Your Profile</h2>
                  <p className="text-gray-400 text-sm">Manage your personal information</p>
                </div>
              </div>
              
              {message && (
                <div className="flex items-center gap-2 p-4 rounded-xl mb-6 animate-fade-in text-sm font-semibold"
                  style={{
                    background: message.includes('success') ? '#ecfdf5' : '#fef2f2',
                    border: `1px solid ${message.includes('success') ? '#d1fae5' : '#fecaca'}`,
                    color: message.includes('success') ? '#059669' : '#dc2626',
                  }}>
                  {message.includes('success') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      <User size={13} /> Username <span className="text-[0.65rem] normal-case opacity-50">(Read-only)</span>
                    </label>
                    <input type="text" value={profile.username} readOnly className="warm-input opacity-60 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">
                      <Mail size={13} /> Email <span className="text-[0.65rem] normal-case opacity-50">(Read-only)</span>
                    </label>
                    <input type="email" value={profile.email} readOnly className="warm-input opacity-60 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"><User size={13} /> Full Name</label>
                  <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} placeholder="Enter your full name" className="warm-input" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"><BookOpen size={13} /> Course / Major</label>
                  <input type="text" name="course" value={profile.course} onChange={handleChange} placeholder="e.g. Computer Science Engineering" className="warm-input" />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5"><FileText size={13} /> Bio</label>
                  <textarea name="bio" value={profile.bio} onChange={handleChange} rows="4" placeholder="Tell us a little about yourself" className="warm-input" style={{ resize: 'none' }}></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn-glow flex items-center gap-2 px-8 py-3 text-sm"><Save size={16} /> Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
