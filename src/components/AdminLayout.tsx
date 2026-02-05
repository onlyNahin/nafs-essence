import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';
import { useApp } from '../App';

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  const { settings, auth } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/admin' },
    { label: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
    { label: 'Inventory', icon: 'inventory_2', path: '/admin/inventory' },
    { label: 'Customizer', icon: 'palette', path: '/admin/customizer' },
  ];

  const handleLogout = async () => {
    try {
      await signOut(firebaseAuth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#121212] text-white font-display overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col shrink-0 bg-[#0d0d0d]">
        <div className="p-8">
          <Link to="/" className="text-primary text-xl font-bold tracking-tight block mb-1" style={{ color: settings.primaryColor }}>
            {settings.websiteName}
          </Link>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.2em]">Administration</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                  isActive ? 'bg-white/5 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}
                  style={isActive ? { color: settings.primaryColor, fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors group"
          >
            <span className="material-symbols-outlined text-[20px] group-hover:rotate-180 transition-transform duration-500">logout</span>
            <span className="text-sm font-bold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0a0a0a]">
        <header className="h-16 border-b border-white/5 bg-[#0d0d0d]/50 backdrop-blur-md flex items-center justify-between px-8 z-10">
          <div className="text-sm text-gray-500 flex items-center gap-2">
            Admin <span className="opacity-30">/</span> <span className="text-white font-medium capitalize">{location.pathname.split('/').pop() || 'Overview'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-gray-500">System Admin</p>
              <p className="text-xs text-gray-300">{auth.username}</p>
            </div>
            <div className="size-10 rounded-xl flex items-center justify-center text-black font-black text-sm shadow-lg" style={{ backgroundColor: settings.primaryColor }}>
              {auth.username?.charAt(0).toUpperCase() || 'A'}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;