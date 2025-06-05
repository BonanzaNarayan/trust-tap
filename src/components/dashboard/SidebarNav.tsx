import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Link2, 
  Settings, 
  BarChart3, 
  Users, 
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarNav: React.FC = () => {
  const location = useLocation();
  const { signOut, userProfile } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="w-5 h-5" />
    },
    {
      label: 'Testimonials',
      path: '/dashboard/testimonials',
      icon: <MessageSquare className="w-5 h-5" />
    },
    {
      label: 'Collection Forms',
      path: '/dashboard/forms',
      icon: <Link2 className="w-5 h-5" />
    },
    {
      label: 'Analytics',
      path: '/dashboard/analytics',
      icon: <BarChart3 className="w-5 h-5" />
    },
    {
      label: 'Team',
      path: '/dashboard/team',
      icon: <Users className="w-5 h-5" />
    },
    {
      label: 'Settings',
      path: '/dashboard/settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];
  
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b border-slate-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
          {userProfile?.name?.charAt(0) || 'U'}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-slate-900 truncate">
            {userProfile?.name || 'User'}
          </h3>
          <p className="text-xs text-slate-500 truncate">
            {userProfile?.email || 'user@example.com'}
          </p>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-600'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={signOut}
          className="flex items-center space-x-3 px-3 py-2 w-full rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarNav;