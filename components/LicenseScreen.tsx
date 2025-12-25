
import React, { useState } from 'react';
import { Button, Input, Card } from './UI';
import { firebaseService } from '../services/firebaseService';

interface LicenseScreenProps {
  onUnlock: (code: string) => Promise<void>;
  onAdminAccess: () => void;
  validLicenses: string[];
}

const LicenseScreen: React.FC<LicenseScreenProps> = ({ onUnlock, onAdminAccess }) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = licenseKey.trim();
    if (!trimmedKey) return;

    setIsVerifying(true);
    setError(null);

    try {
      // 1. Kiểm tra xem có phải là mã Admin không (truy vấn Firebase)
      const isAdmin = await firebaseService.checkAdminPassword(trimmedKey);
      if (isAdmin) {
        onAdminAccess();
        return;
      }

      // 2. Nếu không phải admin, kiểm tra xem có phải License hợp lệ không
      await onUnlock(trimmedKey);
      
    } catch (err) {
      setError("Mã truy cập không chính xác hoặc đã hết hạn.");
      setTimeout(() => setError(null), 4000);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020617] p-6">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full"></div>
      
      <Card className="w-full max-w-md bg-[#0f172a]/40 border-slate-800/50 backdrop-blur-xl p-10 shadow-2xl relative">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              StyleMimic <span className="text-slate-500 font-light">AI</span>
            </h1>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight">Cổng Truy Cập</h2>
            <p className="text-slate-400 text-sm">Vui lòng nhập mã License hoặc mã Quản trị.</p>
          </div>

          {error && (
            <div className="w-full p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
              <p className="text-rose-400 text-xs font-bold flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-cyan-400 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <Input
                type="password"
                placeholder="Nhập mã tại đây..."
                value={licenseKey}
                onChange={(e) => {
                    setLicenseKey(e.target.value);
                    if (error) setError(null);
                }}
                className={`pl-12 h-14 bg-slate-950/50 border-slate-800 text-lg transition-all ${error ? 'border-rose-500/50 ring-2 ring-rose-500/10' : 'focus:ring-cyan-500/20'}`}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold bg-cyan-700 hover:bg-cyan-600 transition-all shadow-lg shadow-cyan-950/20"
              disabled={isVerifying}
            >
              {isVerifying ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  Đang xác thực...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Đăng nhập Hệ thống
                </>
              )}
            </Button>
          </form>

          <p className="text-[10px] text-slate-500/40 font-medium uppercase tracking-widest">
            Hệ thống phân tích kịch bản chuyên nghiệp
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LicenseScreen;
