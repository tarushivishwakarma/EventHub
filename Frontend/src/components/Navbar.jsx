import React from 'react';
import { Sparkles, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';

const Navbar = ({ totalRegistrations, hideStats }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 warm-card rounded-none rounded-b-2xl mb-8 px-6 py-4 flex justify-between items-center animate-fade-in"
      style={{ borderTop: 'none', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
      <Link to="/dashboard" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f59e0b, #ec4899)', boxShadow: '0 4px 15px rgba(236,72,153,0.25)' }}>
          <Sparkles size={22} color="#fff" />
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-gray-800 group-hover:text-pink-500 transition-colors">
          EventHub
        </h1>
      </Link>

      <div className="flex items-center gap-3">
        {!hideStats && (
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: '#fdf2f8', color: '#db2777', border: '1px solid #fce7f3' }}>
            <span className="opacity-60">Registrations:</span>
            <span className="font-bold">{totalRegistrations}</span>
          </div>
        )}

        {location.pathname === '/profile' ? (
          <Link to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
        ) : (
          <Link to="/profile"
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
            style={{ background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' }}>
            <User size={16} /> Profile
          </Link>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white transition-all hover:-translate-y-0.5"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
            boxShadow: '0 4px 15px rgba(236,72,153,0.2)'
          }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
