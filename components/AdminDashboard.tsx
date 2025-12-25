
import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from './UI';
import { AdminLicense } from '../types';

interface AdminDashboardProps {
  licenses: AdminLicense[];
  onAddLicense: (userName: string, licenseCode: string) => Promise<void>;
  onDeleteLicense: (code: string) => Promise<void>;
  onGoToApp: () => void;
  onSignOut: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  licenses, 
  onAddLicense, 
  onDeleteLicense, 
  onGoToApp, 
  onSignOut 
}) => {
  const [userName, setUserName] = useState('');
  const [licenseCode, setLicenseCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Tự động ẩn thông báo sau 4 giây
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !licenseCode.trim()) {
      setNotification({ message: "Vui lòng nhập đầy đủ thông tin khách hàng", type: 'error' });
      return;
    }

    setIsCreating(true);
    try {
      await onAddLicense(userName.trim(), licenseCode.trim());
      setUserName('');
      setLicenseCode('');
      setNotification({ message: "Đã tạo License và đồng bộ lên Cloud thành công", type: 'success' });
    } catch (err) {
      setNotification({ message: "Lỗi: Không thể kết nối tới Database để tạo mã", type: 'error' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (code: string) => {
    // 1. Hiện thông báo xác nhận xóa
    const isConfirmed = window.confirm(`CẢNH BÁO: Bạn có chắc chắn muốn xóa License [${code}]? Người dùng này sẽ mất quyền truy cập ngay lập tức.`);
    
    if (!isConfirmed) return;

    // 2. Thực hiện xóa khách hàng đó đi
    setDeletingCode(code);
    try {
      await onDeleteLicense(code);
      // 3. Thông báo đã xóa thành công
      setNotification({ 
        message: `Hệ thống: Đã xóa thành công License ${code}`, 
        type: 'success' 
      });
    } catch (err) {
      console.error("Delete error:", err);
      setNotification({ message: "Lỗi khi thực hiện lệnh xóa trên Database", type: 'error' });
    } finally {
      setDeletingCode(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 flex flex-col relative overflow-hidden">
      
      {/* Notification Toast (Glassmorphism Style) */}
      {notification && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[300] min-w-[320px] px-6 py-4 rounded-2xl border shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 animate-in fade-in slide-in-from-top-8 duration-500 backdrop-blur-xl ${
          notification.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' 
            : 'bg-rose-500/10 border-rose-500/40 text-rose-400'
        }`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.type === 'success' ? 'bg-emerald-500/20' : 'bg-rose-500/20'}`}>
            {notification.type === 'success' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Hệ thống Admin</span>
            <span className="text-sm font-semibold">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Admin Header */}
      <header className="border-b border-slate-900 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-[100] px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-rose-900/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">Quản trị Hệ thống</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)] animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Firebase Realtime Live</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={onGoToApp}
              className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              Vào Ứng Dụng
            </button>
            <div className="w-px h-4 bg-slate-800" />
            <button 
              onClick={onSignOut}
              className="flex items-center gap-2 text-sm font-medium text-rose-400 hover:text-rose-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              Đăng Xuất
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Create Form */}
        <section className="space-y-6">
          <Card className="bg-[#0f172a]/20 border-slate-800 p-10 h-full shadow-inner">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Cấp Mới License</h2>
            </div>

            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Tên Khách Hàng</label>
                <Input 
                  placeholder="Nhập tên người dùng..." 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-[#020617] border-slate-800 h-14 text-lg focus:border-emerald-500/50 transition-all"
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Mã License Truy Cập</label>
                <Input 
                  placeholder="Ví dụ: PRE-MIMIC-99" 
                  value={licenseCode}
                  onChange={(e) => setLicenseCode(e.target.value)}
                  className="bg-[#020617] border-slate-800 h-14 text-lg font-mono focus:border-emerald-500/50 transition-all uppercase"
                  disabled={isCreating}
                />
              </div>

              <button 
                type="submit"
                disabled={isCreating}
                className="w-full h-14 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-3"
              >
                {isCreating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    Đang xử lý dữ liệu...
                  </>
                ) : 'Xác nhận cấp mã'}
              </button>
            </form>
          </Card>
        </section>

        {/* Right Column: List */}
        <section className="space-y-6">
          <Card className="bg-[#0f172a]/20 border-slate-800 p-10 flex flex-col h-full min-h-[600px] shadow-inner relative">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Danh Sách Hoạt Động</h2>
              </div>
              <div className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full">
                <span className="text-[10px] font-mono text-cyan-500">{licenses.length} Khách hàng</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {licenses.length === 0 ? (
                <div className="text-center p-12 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center gap-4">
                  <p className="text-slate-500 text-sm italic">Hệ thống chưa có License nào.</p>
                </div>
              ) : (
                licenses.map((lic) => (
                  <div 
                    key={lic.id} 
                    className={`bg-[#020617] border border-slate-800 rounded-xl p-5 group flex items-center justify-between hover:border-slate-700 transition-all ${deletingCode === lic.licenseCode ? 'opacity-30 grayscale scale-95 pointer-events-none' : 'hover:bg-slate-900/40'}`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-white tracking-tight">{lic.userName}</h4>
                        <span className="text-[9px] px-2 py-0.5 bg-cyan-500/10 text-cyan-500 rounded font-mono border border-cyan-500/20 uppercase">{lic.licenseCode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        Khởi tạo: {new Date(lic.createdAt).toLocaleString('vi-VN')}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleDelete(lic.licenseCode)}
                      disabled={!!deletingCode}
                      className="p-3 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                    >
                      {deletingCode === lic.licenseCode ? (
                        <div className="w-5 h-5 border-2 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      )}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="mt-10 pt-10 border-t border-slate-900 space-y-4 text-center">
              <p className="text-[11px] text-slate-600 italic">
                Lưu ý: Thao tác xóa khách hàng sẽ ngắt quyền truy cập ngay lập tức khỏi Database.
              </p>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
