
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Analyzer from './components/Analyzer';
import Generator from './components/Generator';
import Library from './components/Library';
import LicenseScreen from './components/LicenseScreen';
import AdminDashboard from './components/AdminDashboard';
import { firebaseService } from './services/firebaseService';
import { View, StyleDNA, GeneratedScript, AdminLicense } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('analyze');
  const [dnas, setDnas] = useState<StyleDNA[]>([]);
  const [scripts, setScripts] = useState<GeneratedScript[]>([]);
  const [adminLicenses, setAdminLicenses] = useState<AdminLicense[]>([]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeLicenseKey, setActiveLicenseKey] = useState<string>('');

  // Initial load from local storage and cloud
  useEffect(() => {
    const savedUnlock = localStorage.getItem('scriptmimic_unlocked');
    const savedAdmin = localStorage.getItem('scriptmimic_is_admin');
    const savedKey = localStorage.getItem('scriptmimic_active_license');
    
    if (savedAdmin === 'true') {
      setIsAdmin(true);
      setIsUnlocked(true);
      setActiveView('admin');
      loadAdminData();
    } else if (savedUnlock === 'true' && savedKey) {
      setIsUnlocked(true);
      setActiveLicenseKey(savedKey);
      loadLicenseData(savedKey);
    }
  }, []);

  const loadLicenseData = async (licenseCode: string) => {
    try {
      const [cloudDnas, cloudScripts] = await Promise.all([
        firebaseService.getDNAs(licenseCode),
        firebaseService.getScripts(licenseCode)
      ]);
      setDnas(cloudDnas);
      setScripts(cloudScripts);
    } catch (e) {
      console.error("Failed to load cloud data", e);
    }
  };

  const loadAdminData = async () => {
    try {
      const allLics = await firebaseService.getAllLicenses();
      setAdminLicenses(allLics);
    } catch (e) {
      console.error("Failed to load admin data", e);
    }
  };

  const handleDnaExtracted = async (newDna: StyleDNA) => {
    setDnas(prev => [newDna, ...prev.filter(d => d.id !== newDna.id)]);
    if (activeLicenseKey) {
      await firebaseService.saveDNA(activeLicenseKey, newDna);
    }
    setActiveView('library');
    window.location.hash = 'library';
  };

  const handleScriptGenerated = async (newScript: GeneratedScript) => {
    setScripts(prev => [newScript, ...prev]);
    if (activeLicenseKey) {
      await firebaseService.saveScript(activeLicenseKey, newScript);
    }
  };

  const handleDeleteDna = async (id: string) => {
    setDnas(prev => prev.filter(d => d.id !== id));
    if (activeLicenseKey) {
      await firebaseService.deleteDNA(activeLicenseKey, id);
    }
  };

  const handleUnlock = async (licenseCode: string) => {
    const license = await firebaseService.validateLicense(licenseCode);
    if (license) {
      setIsUnlocked(true);
      setIsAdmin(false);
      setActiveLicenseKey(licenseCode);
      localStorage.setItem('scriptmimic_unlocked', 'true');
      localStorage.setItem('scriptmimic_active_license', licenseCode);
      localStorage.removeItem('scriptmimic_is_admin');
      loadLicenseData(licenseCode);
    } else {
      throw new Error("Invalid license");
    }
  };

  const handleAdminAccess = () => {
    setIsUnlocked(true);
    setIsAdmin(true);
    setActiveView('admin');
    localStorage.setItem('scriptmimic_unlocked', 'true');
    localStorage.setItem('scriptmimic_is_admin', 'true');
    loadAdminData();
  };

  const handleSignOut = () => {
    setIsUnlocked(false);
    setIsAdmin(false);
    setActiveLicenseKey('');
    localStorage.clear();
    window.location.hash = 'analyze';
  };

  const handleAddLicense = async (userName: string, licenseCode: string) => {
    await firebaseService.createLicense(userName, licenseCode);
    // Sau khi tạo thành công trên DB, làm mới dữ liệu ngay lập tức
    await loadAdminData();
  };

  const handleDeleteLicense = async (code: string) => {
    await firebaseService.deleteLicense(code);
    // Sau khi xóa thành công trên DB, làm mới dữ liệu ngay lập tức
    await loadAdminData();
  };

  if (!isUnlocked) {
    return (
      <LicenseScreen 
        onUnlock={handleUnlock} 
        onAdminAccess={handleAdminAccess} 
        validLicenses={[]} 
      />
    );
  }

  if (activeView === 'admin' && isAdmin) {
    return (
      <AdminDashboard 
        licenses={adminLicenses}
        onAddLicense={handleAddLicense}
        onDeleteLicense={handleDeleteLicense}
        onGoToApp={() => { setActiveView('analyze'); window.location.hash = 'analyze'; }}
        onSignOut={handleSignOut}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-50">
      <Header 
        activeView={activeView === 'admin' ? 'analyze' : activeView} 
        onViewChange={(v) => { setActiveView(v); window.location.hash = v; }}
        onSignOut={handleSignOut}
        isAdminUser={isAdmin}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-10">
        {(activeView === 'analyze') && (
          <Analyzer 
            onDnaExtracted={handleDnaExtracted} 
            existingNames={dnas.map(dna => dna.name.toLowerCase())}
          />
        )}
        {activeView === 'generate' && (
          <Generator availableDnas={dnas} onScriptGenerated={handleScriptGenerated} />
        )}
        {activeView === 'library' && (
          <Library dnas={dnas} onDelete={handleDeleteDna} />
        )}
      </main>

      <footer className="border-t border-slate-900 py-6 px-6 text-center text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} StyleMimic AI. Active License: <span className="text-cyan-500 font-mono">{activeLicenseKey || 'Admin'}</span></p>
          {isAdmin && (
            <button 
              onClick={() => { setActiveView('admin'); window.location.hash = 'admin'; }}
              className="text-cyan-500 hover:text-cyan-400 transition-colors font-bold uppercase tracking-widest text-[10px]"
            >
              Quay lại Dashboard Quản trị
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};
export default App;
