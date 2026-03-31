import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductScan } from './components/ProductScan';
import { RoomAudit } from './components/RoomAudit';
import { Analytics } from './components/Analytics';
import { Settings } from './components/Settings';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Chatbot } from './components/Chatbot';
import { Logo } from './components/Logo';
import { AppView } from './types';
import { Menu, X, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Mock Database (In-memory for session)
  const [users, setUsers] = useState([
    { name: "Demo User", email: "user@example.com", password: "password" }
  ]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Handle Loader Fade Out
  useEffect(() => {
    const loader = document.getElementById('app-loader');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.visibility = 'hidden';
      }, 1200);
    }
  }, []);

  const handleLoginClick = () => {
    setAuthMode('signin');
    setAuthError(null);
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setShowLoginModal(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setAuthError(null); // Clear error on type
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (authMode === 'signin') {
      // --- LOGIN FLOW ---
      const user = users.find(u => u.email === formData.email && u.password === formData.password);
      
      if (user) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setCurrentView(AppView.DASHBOARD);
      } else {
        setAuthError("Invalid username or password. Please try again.");
      }

    } else {
      // --- SIGNUP FLOW ---
      // 1. Validation
      if (!formData.name || !formData.email || !formData.password) {
        setAuthError("All fields are required.");
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (users.find(u => u.email === formData.email)) {
        setAuthError("An account with this email already exists.");
        return;
      }

      // 2. Create User ("Database" Insert)
      const newUser = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };
      setUsers([...users, newUser]);

      // 3. Auto Login & Redirect
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setCurrentView(AppView.DASHBOARD);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView(AppView.DASHBOARD);
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.DASHBOARD:
        return <Dashboard />;
      case AppView.PRODUCT_SCAN:
        return <ProductScan />;
      case AppView.ROOM_AUDIT:
        return <RoomAudit />;
      case AppView.ANALYTICS:
        return <Analytics />;
      case AppView.SETTINGS:
        return <Settings />;
      case AppView.CONTACT:
        return <Contact />;
      case AppView.ABOUT:
        return <About />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex text-slate-900 font-sans selection:bg-emerald-200">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        isLoggedIn={isLoggedIn}
        onLogin={handleLoginClick}
        onLogout={handleLogout}
      />

      <main className="flex-1 min-w-0 flex flex-col transition-all duration-300 relative z-10">
        {/* Mobile Header */}
        <div className="md:hidden p-4 glass-panel flex items-center justify-between sticky top-0 z-20 m-4 rounded-2xl">
          <div className="font-bold text-emerald-800 flex items-center gap-2">
            <span className="text-xl">🌿</span> ScanGreen
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-slate-600 hover:bg-white/50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 lg:p-10 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>
      </main>
      
      {/* Global AI Chatbot */}
      <Chatbot />

      {/* Login / Signup Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-[400px] bg-white rounded-2xl shadow-2xl overflow-hidden relative border border-slate-200">
            
            {/* Modal Close */}
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 pb-6">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                 <div className="flex items-center gap-3 bg-emerald-50 pl-2 pr-5 py-2 rounded-full border border-emerald-100">
                    <Logo className="w-10 h-10" />
                    <span className="text-xl font-bold tracking-tight text-slate-800">Scan<span className="text-emerald-600">Green</span></span>
                 </div>
              </div>

              {/* ERROR MESSAGE BOX */}
              {authError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                        <p className="font-bold">Access Denied</p>
                        <p>{authError}</p>
                    </div>
                </div>
              )}

              <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1 text-slate-800 text-center">
                    {authMode === 'signin' ? 'Welcome Back' : 'Create Account'}
                  </h2>
                  <p className="text-slate-500 text-center text-sm">
                    {authMode === 'signin' ? 'Enter your details to access your dashboard' : 'Join the plastic-free revolution today'}
                  </p>
              </div>
                  
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'signup' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Your Name</label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="John Doe"
                            className="w-full px-4 py-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-400" 
                        />
                    </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                     <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                     {authMode === 'signin' && (
                         <a href="#" className="text-xs text-emerald-600 hover:text-emerald-700 font-medium">Forgot?</a>
                     )}
                  </div>
                  <input 
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={authMode === 'signup' ? "Min. 6 characters" : "••••••••"} 
                    className="w-full px-4 py-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>

                {authMode === 'signup' && (
                    <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Confirm Password</label>
                        <input 
                            type="password" 
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            className="w-full px-4 py-3 text-sm bg-white text-slate-900 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all placeholder:text-slate-400" 
                        />
                    </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3.5 px-4 mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  {authMode === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {/* Toggle Auth Mode */}
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                    {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => {
                            setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                            setAuthError(null);
                        }}
                        className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                        {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
              </div>

            </div>
            
            <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
               <p className="text-[10px] text-slate-400">
                 By continuing, you agree to ScanGreen's Terms of Service and Privacy Policy.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}