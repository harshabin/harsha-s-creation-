import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-[#08090C] text-[#E1E7F0] border-t border-[#1E2430]">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 overflow-y-auto max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
