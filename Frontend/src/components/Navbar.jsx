import React from 'react';
import { BookOpen, LogOut, User } from 'lucide-react';
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
    <nav className="bg-green-600 text-white shadow-lg py-4 px-6 rounded-b-lg flex justify-between items-center mb-8">
      <Link to="/dashboard" className="flex items-center gap-2 hover:text-green-200 transition">
        <BookOpen size={28} />
        <h1 className="text-2xl font-bold">College Event Hub</h1>
      </Link>
      <div className="flex items-center gap-4">
        {!hideStats && (
          <div className="bg-green-700 px-4 py-2 rounded-full font-semibold hidden md:block">
            Total Registrations: {totalRegistrations}
          </div>
        )}
        
        {location.pathname === '/profile' ? (
          <Link to="/dashboard" className="flex items-center gap-1 bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-full font-semibold transition">
            Dashboard
          </Link>
        ) : (
          <Link to="/profile" className="flex items-center gap-1 bg-white text-green-600 hover:bg-gray-100 px-4 py-2 rounded-full font-semibold transition">
            <User size={18} /> Profile
          </Link>
        )}

        <button 
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full font-semibold transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
