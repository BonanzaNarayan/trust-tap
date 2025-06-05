import React from 'react';
import { useLocation } from 'react-router-dom';
// import { Bell, Search } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  const location = useLocation();
  
  // Determine the page title based on the current path
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path === '/dashboard') {
      return 'Dashboard';
    } else if (path === '/dashboard/testimonials') {
      return 'Testimonials';
    } else if (path === '/dashboard/forms') {
      return 'Collection Forms';
    } else if (path === '/dashboard/analytics') {
      return 'Analytics';
    } else if (path === '/dashboard/team') {
      return 'Team';
    } else if (path === '/dashboard/settings') {
      return 'Settings';
    }
    
    return title;
  };
  
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{getPageTitle()}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              className="pl-10 py-2 pr-4 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              placeholder="Search testimonials..."
            />
          </div> */}
          
          {/* <div className="relative">
            <button className="text-slate-600 hover:text-slate-900 transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-primary-600 rounded-full"></span>
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;