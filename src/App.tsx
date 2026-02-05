import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth as firebaseAuth } from './lib/firebase';
import { SiteSettings, AuthState, Product, Order } from './types';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Checkout from './pages/Checkout';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminInventory from './pages/AdminInventory';
import AdminCustomizer from './pages/AdminCustomizer';

// Components
import ProtectedRoute from './components/ProtectedRoute';

interface AppContextType {
  settings: SiteSettings;
  setSettings: (s: SiteSettings) => void;
  products: Product[];
  orders: Order[];
  auth: AuthState;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

const App: React.FC = () => {
  // We provide default settings so the app NEVER gets stuck on "Initializing"
  const [settings, setSettings] = useState<SiteSettings>({
    websiteName: "Nafs Essence",
    primaryColor: "#f4c025",
    secondaryColor: "#231e10",
    fontFamily: "Manrope",
    isDarkMode: true,
    heroTitle: "Scent of the Soul",
    heroSubtitle: "Luxury Perfume Oils for the Distinguished.",
    footerText: "Crafting memories through the finest essences."
  });

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [auth, setAuth] = useState<AuthState>({ 
    isAuthenticated: null, // null = checking, false = logged out, true = logged in
    username: null 
  });

  useEffect(() => {
    // 1. Listen for Auth Changes (Firebase Auth)
    const unsubAuth = onAuthStateChanged(firebaseAuth, (user) => {
      setAuth({
        isAuthenticated: !!user,
        username: user?.email || null
      });
    });

    // 2. Real-time Products Listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Product));
      setProducts(items);
    });

    // 3. Real-time Orders Listener (Sorted by newest first)
    const qOrders = query(collection(db, 'orders'), orderBy('date', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as Order));
      setOrders(items);
    });

    // 4. Real-time Settings Listener
    const unsubSettings = onSnapshot(collection(db, 'settings'), (snapshot) => {
      if (!snapshot.empty) {
        // This overrides the defaults once Firebase data arrives
        setSettings(snapshot.docs[0].data() as SiteSettings);
      }
    });

    return () => {
      unsubAuth();
      unsubProducts();
      unsubOrders();
      unsubSettings();
    };
  }, []);

  // Apply visual settings to the HTML document
  useEffect(() => {
    document.title = settings.websiteName;
    document.body.style.fontFamily = settings.fontFamily + ', sans-serif';
    
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  return (
    <AppContext.Provider value={{ settings, setSettings, products, orders, auth }}>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Storefront */}
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductList />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute>
                <Routes>
                  <Route path="/" element={<AdminDashboard />} />
                  <Route path="/orders" element={<AdminOrders />} />
                  <Route path="/inventory" element={<AdminInventory />} />
                  <Route path="/customizer" element={<AdminCustomizer />} />
                </Routes>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </HashRouter>
    </AppContext.Provider>
  );
};

// Helper component to reset scroll position on page change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [pathname]);
  return null;
};

export default App;