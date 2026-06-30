import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Award } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-extrabold text-green-600 mb-6 tracking-tight">
          Welcome to College Event Hub
        </h1>
        <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
          The ultimate platform to register, manage, and discover amazing college events. Join thousands of students participating in technical, cultural, and sports events!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <CalendarDays size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Exciting Events</h3>
            <p className="text-gray-500 text-sm">Discover and register for the latest symposiums and fests.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Manage Easily</h3>
            <p className="text-gray-500 text-sm">An intuitive dashboard to track all your registrations.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
              <Award size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Participate & Win</h3>
            <p className="text-gray-500 text-sm">Engage with the community and showcase your talents.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-green-600 border border-green-200 font-bold rounded-full shadow-lg transition-transform transform hover:-translate-y-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
