import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfilePhotoModal from './ProfilePhotoModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  ExternalLink,
  ShieldCheck,
  Camera,
  Edit3
} from 'lucide-react';

const AdminSidebar = () => {
  const { user } = useAuth();
  const [photoModalOpen, setPhotoModalOpen] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Products Catalog', path: '/admin/products', icon: Package },
    { name: 'Orders Management', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Customer Directory', path: '/admin/customers', icon: Users },
  ];

  return (
    <>
      <aside className="w-64 bg-[#0C0E14] text-[#8B95A5] min-h-[calc(100vh-80px)] p-4 flex flex-col justify-between border-r border-[#1E2430]">
        <div className="space-y-6">
          {/* Admin Profile Card */}
          <div className="p-3.5 bg-[#11141B] rounded-2xl border border-[#232A38] flex items-center gap-3 shadow-md">
            <div className="relative group flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#99EEFF] bg-[#161B24] shadow-cyan-subtle flex items-center justify-center">
                <img
                  src={user?.avatar || '/assets/founder_harsha_avatar.jpg'}
                  alt={user?.name || 'Harsha'}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => setPhotoModalOpen(true)}
                className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                title="Change Photo"
              >
                <Camera className="w-4 h-4 text-[#99EEFF]" />
              </button>
            </div>

            <div className="overflow-hidden flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white font-display truncate max-w-[100px]">
                  {user?.name || 'Harsha'}
                </p>
                <button
                  type="button"
                  onClick={() => setPhotoModalOpen(true)}
                  className="text-[#8B95A5] hover:text-[#99EEFF] transition-colors p-0.5"
                  title="Edit Picture"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="inline-block text-[9px] font-bold text-[#99EEFF] bg-[#99EEFF]/15 px-2 py-0.5 rounded-full border border-[#99EEFF]/30 uppercase tracking-widest font-display mt-0.5">
                Founder • Admin
              </span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#99EEFF] text-black font-bold font-display shadow-cyan-subtle'
                      : 'text-[#8B95A5] hover:bg-[#161B24] hover:text-white'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-[#1E2430]">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium text-[#8B95A5] hover:text-[#99EEFF] hover:bg-[#161B24] transition-all"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

    <ProfilePhotoModal
      isOpen={photoModalOpen}
      onClose={() => setPhotoModalOpen(false)}
    />
  </>
  );
};

export default AdminSidebar;
