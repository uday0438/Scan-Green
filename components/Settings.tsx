import React, { useState, useEffect } from 'react';
import { Type, Moon, Sun, Smartphone, Monitor } from 'lucide-react';

export const Settings: React.FC = () => {
  // State for Appearance Settings
  const [textSize, setTextSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Load preferences on mount
  useEffect(() => {
    const savedTextSize = localStorage.getItem('sg_text_size') as 'small' | 'medium' | 'large';
    const savedTheme = localStorage.getItem('sg_theme') as 'light' | 'dark';

    if (savedTextSize) setTextSize(savedTextSize);
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Apply preferences whenever they change
  useEffect(() => {
    // Apply Text Size
    document.documentElement.setAttribute('data-text-size', textSize);
    localStorage.setItem('sg_text_size', textSize);

    // Apply Theme
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('sg_theme', theme);
  }, [textSize, theme]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <h2 className="text-2xl font-bold text-slate-800">Settings</h2>

       {/* --- NEW: APPEARANCE SECTION --- */}
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center">
             <Monitor className="w-5 h-5 mr-2 text-indigo-500" /> Appearance
          </h3>

          <div className="space-y-8">
              {/* Text Size Control */}
              <div>
                  <div className="flex items-center gap-2 mb-3">
                      <Type className="w-4 h-4 text-slate-400" />
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Text Size</label>
                  </div>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                      <button 
                        onClick={() => setTextSize('small')}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${textSize === 'small' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Small
                      </button>
                      <button 
                        onClick={() => setTextSize('medium')}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${textSize === 'medium' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Medium
                      </button>
                      <button 
                        onClick={() => setTextSize('large')}
                        className={`flex-1 py-2 rounded-lg text-base font-bold transition-all ${textSize === 'large' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        Large
                      </button>
                  </div>
              </div>

              {/* Theme Control */}
              <div>
                  <div className="flex items-center gap-2 mb-3">
                      {theme === 'light' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Theme</label>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <button 
                         onClick={() => setTheme('light')}
                         className={`border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${theme === 'light' ? 'border-amber-400 bg-amber-50 text-amber-800' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                      >
                          <Sun className="w-5 h-5" />
                          <span className="font-bold">Light Mode</span>
                      </button>
                      <button 
                         onClick={() => setTheme('dark')}
                         className={`border-2 rounded-xl p-4 flex items-center justify-center gap-3 transition-all ${theme === 'dark' ? 'border-indigo-400 bg-slate-800 text-white' : 'border-slate-100 hover:border-slate-200 text-slate-500'}`}
                      >
                          <Moon className="w-5 h-5" />
                          <span className="font-bold">Dark Mode</span>
                      </button>
                  </div>
              </div>
          </div>
       </div>

       {/* EXISTING: SCAN PREFERENCES */}
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">Scan Preferences</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                    <p className="font-medium text-slate-700">Detailed Chemical Analysis</p>
                    <p className="text-sm text-slate-400">Show full list of additives and toxins</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="toggle1" className="peer sr-only" defaultChecked />
                    <label htmlFor="toggle1" className="block h-6 overflow-hidden rounded-full cursor-pointer bg-slate-200 border border-slate-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500"></label>
                    <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-200 peer-checked:translate-x-6 border border-slate-200"></div>
                </div>
            </div>

            <div className="flex items-center justify-between py-2">
                <div>
                    <p className="font-medium text-slate-700">Health Alerts</p>
                    <p className="text-sm text-slate-400">Notify me of severe health risks immediately</p>
                </div>
                <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input type="checkbox" id="toggle2" className="peer sr-only" defaultChecked />
                    <label htmlFor="toggle2" className="block h-6 overflow-hidden rounded-full cursor-pointer bg-slate-200 border border-slate-200 peer-checked:bg-emerald-500 peer-checked:border-emerald-500"></label>
                    <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow-sm transition-all duration-200 peer-checked:translate-x-6 border border-slate-200"></div>
                </div>
            </div>
          </div>
       </div>

       {/* EXISTING: ABOUT */}
       <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-800 mb-4">About ScanGreen</h3>
          <p className="text-slate-600 mb-4 text-sm leading-relaxed">
            ScanGreen is an initiative to promote a plastic-free future, aligned with the Plastic Soup Foundation's research. We use AI to verify product claims and identify hidden microplastics.
          </p>
          <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-500 font-mono">
            Version: 2.1.0 (ScanGreen)<br/>
            Engine: Gemini 3 Flash Preview
          </div>
       </div>
    </div>
  );
};