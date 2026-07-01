import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Users, Award, Sparkles, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Background image */}
      <div className="fixed inset-0 z-0" style={{
        backgroundImage: 'url(https://st2.depositphotos.com/3336339/8196/i/450/depositphotos_81969890-stock-photo-red-chaotic-cubes-wall-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }} />
      {/* Overlay for readability */}
      <div className="fixed inset-0 z-0" style={{ background: 'rgba(255,255,255,0.82)' }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute rounded-full animate-float"
          style={{
            width: 400, height: 400, top: '-10%', left: '-5%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div className="absolute rounded-full animate-float"
          style={{
            width: 350, height: 350, bottom: '-15%', right: '-5%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animationDelay: '2s',
          }}
        />
        <div className="absolute rounded-full animate-float"
          style={{
            width: 250, height: 250, top: '40%', right: '15%',
            background: 'radial-gradient(circle, rgba(236,72,153,0.08) 0%, transparent 70%)',
            filter: 'blur(50px)',
            animationDelay: '4s',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Logo */}
        <div className="animate-fade-in mb-6" style={{ animationFillMode: 'both' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
              boxShadow: '0 8px 32px rgba(236,72,153,0.3)',
            }}>
            <Sparkles size={32} color="#fff" />
          </div>
        </div>

        {/* Hero heading */}
        <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight animate-fade-in"
          style={{
            background: 'linear-gradient(135deg, #d97706 0%, #ec4899 60%, #db2777 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animationDelay: '0.1s',
            animationFillMode: 'both',
            lineHeight: 1.1,
          }}>
          College Event Hub
        </h1>

        <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-gray-500 animate-fade-in"
          style={{ animationDelay: '0.2s', animationFillMode: 'both', lineHeight: 1.7 }}>
          The ultimate platform to register, manage, and discover amazing college events.
          Join thousands of students participating in technical, cultural, and sports events!
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
          {[
            { icon: CalendarDays, title: 'Exciting Events', desc: 'Discover and register for the latest symposiums and fests.', color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7', delay: '0.3s' },
            { icon: Users, title: 'Manage Easily', desc: 'An intuitive dashboard to track all your registrations.', color: '#ec4899', bg: '#fdf2f8', border: '#fce7f3', delay: '0.4s' },
            { icon: Award, title: 'Participate & Win', desc: 'Engage with the community and showcase your talents.', color: '#d97706', bg: '#fffbeb', border: '#fef3c7', delay: '0.5s' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="warm-card p-6 flex flex-col items-center text-center animate-fade-in transition-all duration-300 hover:-translate-y-2 group cursor-default"
                style={{ animationDelay: card.delay, animationFillMode: 'both' }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: card.bg, border: `1px solid ${card.border}` }}>
                  <Icon size={28} style={{ color: card.color }} />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-400">{card.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA buttons */}
        <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
          <Link to="/login" className="btn-glow px-8 py-3.5 text-sm flex items-center gap-2">
            Sign In <ArrowRight size={16} />
          </Link>
          <Link to="/register"
            className="px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 hover:-translate-y-1 flex items-center gap-2"
            style={{ background: '#fff', color: '#d97706', border: '1px solid #fef3c7', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
