import React from 'react';
import { Leaf, Eye, ShieldCheck, Zap, Globe, Users, Target, Layers, Compass, Cpu, Terminal, Layout } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-10 shadow-2xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold tracking-wider mb-6 border border-white/10">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>SUSTAINABILITY INNOVATION</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
            Making the Invisible <span className="text-emerald-400">Visible</span>
          </h1>
          <p className="text-lg text-emerald-100 leading-relaxed max-w-2xl">
            ScanGreen is an AI-powered sustainability platform that helps people see, understand, and reduce plastic and synthetic materials in their everyday environments.
          </p>
        </div>
        
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
           </svg>
        </div>
        <div className="absolute -right-20 -bottom-40 w-96 h-96 bg-emerald-500 rounded-full blur-[100px] opacity-30"></div>
      </div>

      {/* Problem & Solution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 rounded-[2rem] border-t-4 border-t-red-400">
           <div className="bg-red-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <Eye className="w-7 h-7 text-red-500" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">The Invisible Problem</h3>
           <p className="text-slate-600 leading-relaxed">
             Plastic and synthetic materials are everywhere—homes, classrooms, and offices—yet most remain unidentified. With confusing labels and widespread greenwashing, the true environmental and health impacts of our surroundings often go unnoticed until it's too late.
           </p>
        </div>

        <div className="glass-panel p-8 rounded-[2rem] border-t-4 border-t-emerald-400">
           <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7 text-emerald-500" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">Our AI Solution</h3>
           <p className="text-slate-600 leading-relaxed">
             We transform any room into a live sustainability audit. Using computer vision and material intelligence, ScanGreen analyzes objects in real-time, revealing plastic usage, embedded carbon, and recyclability through an intuitive Augmented Reality overlay.
           </p>
        </div>
      </div>

      {/* How It Works */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <Zap className="w-5 h-5 text-amber-500 mr-2" /> How ScanGreen Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
                { title: "Scan & Detect", desc: "AI models infer material composition from live camera feed.", icon: Eye },
                { title: "AR Visualization", desc: "Overlays highlight synthetic (Red) vs natural (Green) items.", icon: Layers },
                { title: "Actionable Insights", desc: "Get Plastic Load scores, carbon estimates, and alternatives.", icon: Target }
            ].map((step, idx) => (
                <div key={idx} className="glass-panel p-6 rounded-2xl bg-white/50">
                    <step.icon className="w-8 h-8 text-slate-700 mb-4" />
                    <h4 className="font-bold text-slate-800 mb-2">{step.title}</h4>
                    <p className="text-sm text-slate-500">{step.desc}</p>
                </div>
            ))}
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden">
         <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <div className="text-emerald-400 font-bold tracking-widest uppercase text-xs mb-2">Our Mission</div>
                <h3 className="text-2xl font-bold mb-4">Accessible Sustainability</h3>
                <p className="text-slate-300 leading-relaxed">
                    To make plastic and synthetic materials visible, understandable, and avoidable through accessible technology, empowering everyone to make safer choices.
                </p>
            </div>
            <div>
                <div className="text-blue-400 font-bold tracking-widest uppercase text-xs mb-2">Our Vision</div>
                <h3 className="text-2xl font-bold mb-4">A Plastic-Free Future</h3>
                <p className="text-slate-300 leading-relaxed">
                    A world where individuals and communities can effortlessly design healthier, low-plastic living spaces and actively contribute to regenerating our planet.
                </p>
            </div>
         </div>
         {/* Decor */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/30 rounded-full blur-3xl"></div>
      </div>

      {/* Why It Matters */}
      <div className="glass-panel p-8 rounded-[2rem]">
          <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <Globe className="w-5 h-5 text-blue-500 mr-2" /> Why It Matters
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                  "Plastic pollution affects human health and climate change.",
                  "Indoor air quality is compromised by synthetic VOCs.",
                  "Informed purchasing drives circular economy practices.",
                  "Reducing hidden carbon is key to net-zero goals."
              ].map((item, i) => (
                  <li key={i} className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-600">{item}</span>
                  </li>
              ))}
          </ul>
      </div>

      {/* TEAM SECTION */}
      <div className="pt-8 border-t border-slate-200/60">
        <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 shadow-sm">
                <Users className="w-6 h-6 text-indigo-600" />
             </div>
             <h3 className="text-3xl font-bold text-slate-800">Team ScanGreen</h3>
             <p className="text-slate-500 mt-2 max-w-2xl mx-auto">
                 We are a multidisciplinary team combining expertise in product design, AI, and software development, united by the goal of making sustainability visible.
             </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Uday */}
            <div className="glass-panel p-6 rounded-2xl text-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Compass className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Uday Bhasker</h4>
                <div className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-3">Product Manager</div>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Leads product vision, feature planning, and UX strategy. Aligns sustainability goals with real-world usability.
                </p>
            </div>

            {/* Saksham */}
            <div className="glass-panel p-6 rounded-2xl text-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Cpu className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Saksham Bhardwaj</h4>
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">AI/ML Consultant</div>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Expertise in AI/ML. Guides model selection, material inference logic, and scalable AI integration.
                </p>
            </div>

            {/* Devi */}
            <div className="glass-panel p-6 rounded-2xl text-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Terminal className="w-8 h-8 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Devi Bala</h4>
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">Python Developer</div>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Handles backend development, data processing, and transforming raw AI outputs into sustainability insights.
                </p>
            </div>

            {/* Bhuvan */}
            <div className="glass-panel p-6 rounded-2xl text-center group hover:bg-white transition-colors">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Layout className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-800 text-lg">Bhuvan</h4>
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Full Stack Developer</div>
                <p className="text-sm text-slate-500 leading-relaxed">
                    Develops interactive interfaces and AR visualization workflows. Ensures seamless end-to-end user experience.
                </p>
            </div>
        </div>

        {/* Philosophy Quote */}
        <div className="mt-10 glass-panel p-8 rounded-2xl bg-gradient-to-br from-emerald-900 to-slate-900 text-white text-center shadow-xl">
             <div className="max-w-3xl mx-auto">
                <p className="text-lg md:text-xl font-medium italic opacity-90 leading-relaxed">
                    "We believe technology should not only be smart — it should be responsible. ScanGreen reflects our commitment to using AI for environmental awareness, transparency, and positive impact."
                </p>
                <div className="mt-4 text-sm font-bold text-emerald-400 tracking-widest uppercase">— Team ScanGreen</div>
             </div>
        </div>
      </div>

    </div>
  );
};