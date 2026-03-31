import React from 'react';
import { Mail, Globe, User, MessageSquare, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div>
         <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Partner With Us</h2>
         <p className="text-slate-500 font-medium mt-1">Join the fight against plastic pollution.</p>
      </div>

      <div className="glass-panel p-0 rounded-[2rem] overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[500px]">
           {/* Contact Info Sidebar */}
           <div className="bg-slate-900 text-white p-10 md:w-1/3 relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10">
                  <h4 className="text-2xl font-bold mb-6">Get in Touch</h4>
                  <p className="text-slate-300 mb-8 leading-relaxed">
                      Interested in enterprise solutions or have feedback on our database? We'd love to hear from you.
                  </p>
                  
                  <div className="space-y-6">
                      <div className="flex items-center space-x-4">
                          <div className="bg-white/10 p-3 rounded-lg">
                              <Mail className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                              <div className="text-xs text-slate-400 uppercase font-bold">Email</div>
                              <div className="font-medium">contact@scangreen.ai</div>
                          </div>
                      </div>
                      <div className="flex items-center space-x-4">
                          <div className="bg-white/10 p-3 rounded-lg">
                              <Globe className="w-5 h-5 text-blue-400" />
                          </div>
                          <div>
                              <div className="text-xs text-slate-400 uppercase font-bold">Website</div>
                              <div className="font-medium">www.plasticsoup.org</div>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="relative z-10 pt-10">
                 <p className="text-xs text-slate-500">
                    ScanGreen Head Office<br/>
                    Amsterdam, Netherlands
                 </p>
              </div>
              
              {/* Decorative circles */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-20"></div>
              <div className="absolute top-10 -left-10 w-40 h-40 bg-blue-600 rounded-full blur-2xl opacity-20"></div>
           </div>

           {/* Form Area */}
           <div className="p-10 md:w-2/3 bg-white/50 backdrop-blur-md flex flex-col justify-center">
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                          <div className="relative">
                              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                              <input 
                                  type="text" 
                                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                  placeholder="John Doe"
                              />
                          </div>
                      </div>
                      <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                              <input 
                                  type="email" 
                                  className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                                  placeholder="john@example.com"
                              />
                          </div>
                      </div>
                  </div>
                  
                  <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Message</label>
                      <div className="relative">
                          <MessageSquare className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                          <textarea 
                              rows={4}
                              className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                              placeholder="How can we help you?"
                          ></textarea>
                      </div>
                  </div>

                  <div className="flex justify-end">
                      <button className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center">
                          Send Message <Send className="w-4 h-4 ml-2" />
                      </button>
                  </div>
              </form>
           </div>
      </div>
    </div>
  );
};