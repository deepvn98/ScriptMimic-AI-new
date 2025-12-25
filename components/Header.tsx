import React from 'react';
import { View } from '../types';

interface HeaderProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onSignOut: () => void;
  isAdminUser?: boolean;
}

const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, onSignOut, isAdminUser }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          </div>
          <span className="text-xl font-bold tracking-tight">ScriptMimic <span className="text-cyan-500 font-light">AI</span></span>
        </div>

        <nav className="hidden md:flex bg-slate-900 rounded-lg p-1">
          {(['analyze', 'generate', 'library'] as const).map((view) => (
            <button
              key={view}
              onClick={() => onViewChange(view)}
              className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all ${activeView === view ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
          {isAdminUser && (
            <button
              onClick={() => onViewChange('admin')}
              className={`px-6 py-1.5 rounded-md text-sm font-medium transition-all text-rose-400 hover:text-rose-300`}
            >
              Admin
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={onSignOut}
            className="p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all border border-transparent hover:border-rose-900/30"
            title="Sign Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
          
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <img src="https://picsum.photos/seed/user1/32/32" alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;