
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../App';
import ScentAlchemist from './ScentAlchemist';

interface Props {
  children: React.ReactNode;
}

const StoreLayout: React.FC<Props> = ({ children }) => {
  const { settings } = useApp();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${settings.isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'}`}>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10" style={{ color: settings.primaryColor }}>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>spa</span>
            </div>
            <span className="text-xl font-bold tracking-tight">{settings.websiteName}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium hover:opacity-70 transition-opacity">Home</Link>
            <Link to="/shop" className="text-sm font-medium hover:opacity-70 transition-opacity">Shop</Link>
            <Link to="/admin" className="text-sm font-medium text-gray-500 hover:text-white transition-colors">Admin</Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/checkout" className="group flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all" style={{ backgroundColor: settings.primaryColor, color: '#000' }}>
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              <span>Checkout</span>
            </Link>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <ScentAlchemist />

      {/* Footer */}
      <footer className="border-t border-white/10 py-16 px-4">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
               <div className="flex size-8 items-center justify-center rounded-full bg-primary/10" style={{ color: settings.primaryColor }}>
                <span className="material-symbols-outlined">spa</span>
              </div>
              <span className="text-xl font-bold">{settings.websiteName}</span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">{settings.footerText}</p>
          </div>
          
          <div className="flex gap-8 text-sm font-medium">
             <Link to="/" className="hover:text-primary transition-colors">Home</Link>
             <Link to="/shop" className="hover:text-primary transition-colors">Products</Link>
             <Link to="/admin/login" className="hover:text-primary transition-colors">Admin Login</Link>
          </div>

          <p className="text-gray-500 text-xs">© 2024 {settings.websiteName}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default StoreLayout;
