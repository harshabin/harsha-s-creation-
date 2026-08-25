import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAdmin } = useAuth();

  if (!user) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4 text-2xl font-bold">
          403
        </div>
        <h2 className="text-2xl font-bold text-stone-900">Access Denied</h2>
        <p className="text-stone-600 max-w-md mt-2 mb-6">
          You do not possess the administrator credentials required to view this dashboard.
        </p>
        <a
          href="/"
          className="px-6 py-2.5 bg-stone-950 text-white rounded-xl text-sm font-semibold hover:bg-stone-800"
        >
          Return to Storefront
        </a>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
