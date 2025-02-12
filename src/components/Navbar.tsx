import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Siren, 
  Trophy, 
  LineChart, 
  Blocks, 
  Leaf 
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/vehicles', label: 'Vehicles', icon: Car },
  { path: '/emergency', label: 'Emergency', icon: Siren },
  { path: '/gamification', label: 'Gamification', icon: Trophy },
  { path: '/analytics', label: 'Analytics', icon: LineChart },
  { path: '/blockchain', label: 'Blockchain', icon: Blocks },
  { path: '/sustainability', label: 'Sustainability', icon: Leaf },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="glass-card fixed left-0 top-0 h-screen w-64 p-6">
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500">
          <Car className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold gradient-text">SmartTransport</h1>
      </div>
      <div className="space-y-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3.5 rounded-lg transition-all duration-300 ${
                isActive 
                  ? 'bg-indigo-500/20 text-indigo-400' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-indigo-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}