import React from 'react';
import { Users, CheckCircle, ClipboardList, XCircle } from 'lucide-react';

const StatsCards = ({ events }) => {
  const total = events.length;
  const confirmed = events.filter(e => e.status === 'Confirmed').length;
  const registered = events.filter(e => e.status === 'Registered').length;
  const cancelled = events.filter(e => e.status === 'Cancelled').length;

  const cards = [
    { label: 'Total', value: total, icon: Users, color: '#ec4899', bg: '#fdf2f8', border: '#fce7f3' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: '#10b981', bg: '#ecfdf5', border: '#d1fae5' },
    { label: 'Registered', value: registered, icon: ClipboardList, color: '#f59e0b', bg: '#fffbeb', border: '#fef3c7' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: '#ef4444', bg: '#fef2f2', border: '#fecaca' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="animate-fade-in rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
            style={{
              background: card.bg,
              border: `1px solid ${card.border}`,
              animationDelay: `${i * 0.1}s`,
              animationFillMode: 'both',
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  {card.label}
                </p>
                <p className="text-3xl font-extrabold mt-1" style={{ color: card.color }}>
                  {card.value}
                </p>
              </div>
              <div className="rounded-xl p-2.5" style={{ background: `${card.color}12` }}>
                <Icon size={26} style={{ color: card.color }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
