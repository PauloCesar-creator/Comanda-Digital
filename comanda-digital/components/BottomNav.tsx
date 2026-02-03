
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'fa-utensils', label: 'Cardápio' },
    { path: '/tables', icon: 'fa-th-large', label: 'Mesas' },
    { path: '/kitchen', icon: 'fa-fire', label: 'Cozinha' },
    { path: '/admin', icon: 'fa-chart-pie', label: 'Admin' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#1e293b] border-t border-slate-800 flex justify-around py-4 px-2 z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
              isActive ? 'text-[#52c48a]' : 'text-slate-500'
            }`}
          >
            <i className={`fas ${item.icon} text-xl ${isActive ? 'scale-110' : ''}`}></i>
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;