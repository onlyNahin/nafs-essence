import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth as firebaseAuth } from '../lib/firebase';
import { useApp } from '../App';

const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { settings } = useApp();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Authenticate with Firebase
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      // We don't need to manually setAuth here because App.tsx 
      // has an onAuthStateChanged listener that handles it.
      navigate('/admin');
    } catch (err: any) {
      console.error("Auth error:", err.code);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid admin credentials.');
      } else {
        setError('Access denied. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary blur-[120px] rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary blur-[120px] rounded-full" style={{ backgroundColor: settings.primaryColor }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-[#161616] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
        <div className="text-center mb-10">
          <div className="inline-flex size-16 items-center justify-center rounded-2xl bg-white/5 mb-6 border border-white/10">
             <span className="material-symbols-outlined text-3xl" style={{ color: settings.primaryColor }}>lock</span>
          </div>
          <h2 className="text-3xl font-black mb-2">Vault Access</h2>
          <p className="text-gray-500 text-sm italic">Nafs Essence Administrative Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-xs font-bold text-center animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Admin Email</label>
            <input 
              required
              type="email"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary transition-all outline-none"
              placeholder="admin@nafsessence.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-400 ml-1 uppercase tracking-widest">Password</label>
            <input 
              required
              type="password"
              className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-primary transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-xl text-black font-bold text-sm tracking-wide transition-all active:scale-95 disabled:opacity-50 shadow-[0_0_20px_rgba(244,192,37,0.1)]"
            style={{ backgroundColor: settings.primaryColor }}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-gray-600 text-[10px] mt-8">© 2024 System Protected by Firebase Auth</p>
      </div>
    </div>
  );
};

export default AdminLogin;