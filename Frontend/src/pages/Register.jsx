import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as api from '../api';
import { User, Lock, Mail, Shield } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.register(formData);
      setSuccess('Registration successful! Redirecting to login in 3 seconds...');
      setTimeout(() => navigate('/login'), 3000);
    }
    catch (err) { setError(err.response?.data?.error || 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/052/401/656/small/dark-red-abstract-mosaic-background-photo.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
      }} />
      <div className="fixed inset-0 z-0" style={{ background: 'rgba(255,255,255,0.82)' }} />
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="absolute rounded-full animate-float" style={{ width: 450, height: 450, top: '-10%', right: '-8%', background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute rounded-full animate-float" style={{ width: 400, height: 400, bottom: '-15%', left: '-8%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', filter: 'blur(80px)', animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md warm-card p-8 animate-fade-in" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg, #ec4899, #f59e0b)', boxShadow: '0 8px 24px rgba(245,158,11,0.25)' }}>
          <User size={28} color="#fff" />
        </div>

        <h2 className="text-2xl font-extrabold text-center text-gray-800 mb-1">Create Account</h2>
        <p className="text-center text-gray-400 mb-6 text-sm">Join the College Event Hub</p>
        
        {success && (
          <div className="rounded-xl p-3 mb-4 text-sm text-center font-medium" style={{ background: '#ecfdf5', color: '#059669', border: '1px solid #d1fae5' }}>{success}</div>
        )}
        {error && (
          <div className="rounded-xl p-3 mb-4 text-sm text-center font-medium" style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>{error}</div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Username</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><User size={16} /></div>
              <input type="text" required placeholder="Choose a username"
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="warm-input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Email</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Mail size={16} /></div>
              <input type="email" required placeholder="Enter your email"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="warm-input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Lock size={16} /></div>
              <input type="password" required placeholder="Create a password"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="warm-input pl-10" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Role</label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"><Shield size={16} /></div>
              <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="warm-input pl-10 appearance-none cursor-pointer">
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▾</div>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-glow w-full py-3 text-sm mt-2" style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-500 font-bold hover:text-pink-600 transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
