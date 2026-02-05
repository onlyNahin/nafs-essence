import React, { useState } from 'react';
import { useApp } from '../App';
import AdminLayout from '../components/AdminLayout';
import { db } from '../lib/firebase';
import { collection, doc, updateDoc, getDocs } from 'firebase/firestore';

const AdminCustomizer: React.FC = () => {
  const { settings, setSettings } = useApp();
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Helper to update local state immediately (for live preview)
  const handleLocalUpdate = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  // The actual function to save to Firebase
  const handleSaveToCloud = async () => {
    setIsSaving(true);
    try {
      // 1. Get the document ID from the settings collection
      const querySnapshot = await getDocs(collection(db, 'settings'));
      if (querySnapshot.empty) {
        alert("Settings document not found in Firestore. Please create it first.");
        return;
      }
      
      const settingsDocId = querySnapshot.docs[0].id;
      const settingsRef = doc(db, 'settings', settingsDocId);

      // 2. Update the document with current state
      await updateDoc(settingsRef, settings);
      
      setSaveStatus('Site updated successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to save settings to the cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Settings Panel */}
        <div className="space-y-12 pb-20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Site Customizer</h1>
              <p className="text-gray-500 text-sm mt-2">Modify global styles and brand identity.</p>
            </div>
            <button 
              onClick={handleSaveToCloud}
              disabled={isSaving}
              className="px-8 py-3 rounded-xl text-black font-bold shadow-lg transition-transform active:scale-95 disabled:opacity-50"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {isSaving ? 'Saving...' : 'Publish Changes'}
            </button>
          </div>

          {saveStatus && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-xl text-center font-bold animate-fade-in">
              {saveStatus}
            </div>
          )}

          {/* Branding Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ color: settings.primaryColor }}>branding_watermark</span>
              Identity & Brand
            </h2>
            <div className="grid grid-cols-1 gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Website Name</label>
                <input 
                  className="bg-white/5 border border-white/10 rounded-lg p-4 outline-none focus:border-primary"
                  value={settings.websiteName}
                  onChange={e => handleLocalUpdate('websiteName', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Visuals Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ color: settings.primaryColor }}>palette</span>
              Visual Style
            </h2>
            <div className="grid grid-cols-2 gap-4 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Primary Color</label>
                <div className="flex gap-2">
                  <input type="color" className="h-12 w-12 rounded bg-transparent border-none cursor-pointer" value={settings.primaryColor} onChange={e => handleLocalUpdate('primaryColor', e.target.value)} />
                  <input className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 text-sm" value={settings.primaryColor} onChange={e => handleLocalUpdate('primaryColor', e.target.value)} />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Dark Mode</label>
                <button 
                  onClick={() => handleLocalUpdate('isDarkMode', !settings.isDarkMode)}
                  className={`h-12 rounded-lg font-bold transition-colors ${settings.isDarkMode ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}
                  style={settings.isDarkMode ? { backgroundColor: settings.primaryColor } : {}}
                >
                  {settings.isDarkMode ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </section>

          {/* Content Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ color: settings.primaryColor }}>edit_note</span>
              Homepage Content
            </h2>
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Title</label>
                <input 
                  className="bg-white/5 border border-white/10 rounded-lg p-4 outline-none focus:border-primary"
                  value={settings.heroTitle}
                  onChange={e => handleLocalUpdate('heroTitle', e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Hero Subtitle</label>
                <textarea 
                  className="h-24 bg-white/5 border border-white/10 rounded-lg p-4 outline-none focus:border-primary resize-none"
                  value={settings.heroSubtitle}
                  onChange={e => handleLocalUpdate('heroSubtitle', e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Live Preview Monitor */}
        <div className="hidden lg:block">
          <div className="sticky top-12 space-y-4">
             <p className="text-center text-xs font-bold text-gray-500 uppercase tracking-widest">Live Preview</p>
             <div className="p-1 bg-[#1a1a1a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden aspect-[9/19] max-h-[80vh] mx-auto w-72 relative">
                <div className="absolute top-0 left-0 right-0 h-6 bg-[#1a1a1a] z-20 flex items-center justify-center">
                    <div className="w-16 h-4 bg-black rounded-full"></div>
                </div>
                <div className="h-full w-full rounded-[2rem] bg-black overflow-hidden relative border border-white/5">
                  <iframe 
                    src={`${window.location.origin}${window.location.pathname}#/`} 
                    key={JSON.stringify(settings)} // Refreshes iframe when settings change
                    className="w-[300%] h-[300%] origin-top-left scale-[0.3333] border-none"
                    title="Storefront Preview"
                  />
                </div>
             </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCustomizer;