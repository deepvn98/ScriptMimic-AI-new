
import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = "" }) => (
  <div className={`bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Button: React.FC<{ 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit";
}> = ({ children, onClick, variant = 'primary', disabled, className = "", type = "button" }) => {
  const variants = {
    primary: "bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20",
    secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200",
    danger: "bg-rose-900/20 hover:bg-rose-900/40 text-rose-400 border border-rose-800",
    ghost: "bg-transparent hover:bg-slate-800 text-slate-400"
  };

  return (
    <button 
      type={type}
      onClick={onClick} 
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props}
    className={`bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full ${props.className}`}
  />
);

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea 
    {...props}
    className={`bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 w-full min-h-[120px] ${props.className}`}
  />
);

export const Badge: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color = "cyan" }) => (
  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-${color}-500/10 text-${color}-400 border border-${color}-500/20`}>
    {children}
  </span>
);
