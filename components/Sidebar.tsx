import React from 'react';
import { AppView } from '../types';
import { Home, BarChart3, Settings, LogOut, Mail, Info, UserCircle, ScanLine, Camera } from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentView, 
  onChangeView, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen,
  isLoggedIn,
  onLogin,
  onLogout
}) => {
  const navItems = [
    { view: AppView.DASHBOARD, label: "Home", icon: Home },
    { view: AppView.PRODUCT_SCAN, label: "Product Scan", icon: ScanLine },
    { view: AppView.ROOM_AUDIT, label: "Room Audit", icon: Camera },
    { view: AppView.ANALYTICS, label: "Analytics", icon: BarChart3 },
    { view: AppView.ABOUT, label: "About Us", icon: Info },
    { view: AppView.CONTACT, label: "Get in Touch", icon: Mail },
  ];

  const handleNavClick = (view: AppView) => {
    onChangeView(view);
    setIsMobileMenuOpen(false);
  };

  // Helper to determine if a nav item is active
  const isItemActive = (itemView: AppView) => {
    return currentView === itemView;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 left-0 h-screen w-72 glass-panel border-r border-white/40 z-50 transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        {/* Header */}
        <div className="p-8 pb-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="relative">
               <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-20 rounded-full"></div>
               <Logo className="w-12 h-12 relative z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">
                Scan<span className="text-emerald-600">Green</span>
              </h1>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Plastic-Free</span>
            </div>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const active = isItemActive(item.view);
            return (
              <button
                key={item.view}
                onClick={() => handleNavClick(item.view)}
                className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                  active
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 translate-x-1'
                    : 'text-slate-600 hover:bg-white/60 hover:text-emerald-700 hover:shadow-sm'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${active ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                <span className="font-semibold tracking-wide text-sm">{item.label}</span>
              </button>
            );
          })}

          {/* Spacer & Utilities Section */}
          <div className="pt-4 mt-2 border-t border-slate-200/50 space-y-3">
            {/* Login / Logout Button - Amazon Style */}
            <div className="px-2">
                <button
                onClick={() => {
                    isLoggedIn ? onLogout() : onLogin();
                    setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center space-x-2 px-5 py-2.5 rounded-lg transition-all duration-200 group shadow-sm ${
                    isLoggedIn 
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-300' 
                    : 'bg-gradient-to-b from-[#f7dfa5] to-[#f0c14b] border border-[#a88734] text-[#111] hover:from-[#f5d68b] hover:to-[#eeb933] active:border-[#a88734]'
                }`}
                >
                {isLoggedIn ? (
                    <>
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium text-sm">Sign Out</span>
                    </>
                ) : (
                    <>
                    <UserCircle className="w-5 h-5 opacity-80" />
                    <span className="font-medium text-sm">Hello, Sign in</span>
                    </>
                )}
                </button>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => handleNavClick(AppView.SETTINGS)}
              className={`w-full flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
                currentView === AppView.SETTINGS
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 translate-x-1'
                  : 'text-slate-600 hover:bg-white/60 hover:text-emerald-700 hover:shadow-sm'
              }`}
            >
              <Settings className={`w-5 h-5 transition-transform group-hover:scale-110 ${currentView === AppView.SETTINGS ? 'text-white' : 'text-slate-400 group-hover:text-emerald-600'}`} />
              <span className="font-semibold tracking-wide text-sm">Settings</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-6 mt-auto">
          <p className="text-center text-[10px] text-slate-400 mt-4 font-medium opacity-60">
              Partnered with Plastic Soup Foundation
          </p>
        </div>
      </div>
    </>
  );
};