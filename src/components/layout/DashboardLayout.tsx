import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNav from '../dashboard/SidebarNav';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;