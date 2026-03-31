import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, ScanLine, Mic, Zap, Clock, Flame, Scan, Layers, Loader2, Skull, Recycle, Droplets, Search, CheckCircle2 } from 'lucide-react';
import { analyzeRoomImage } from '../services/geminiService';
import { RoomAuditResult } from '../types';

export const RoomAudit: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RoomAuditResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showHeatmap, setShowHeatmap] = useState(false);

  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scanner Modules for UI Display (Initial State)
  const scannerModules = [
    { id: 1, name: "Polymer Heatmap", desc: "Plastic Load Visualization", icon: Layers, color: "text-emerald-500", bg: "bg-emerald-50" },
    { id: 2, name: "Ghost Carbon", desc: "Embedded CO₂ Footprint", icon: Flame, color: "text-slate-500", bg: "bg-slate-50" },
    { id: 3, name: "Decomposition", desc: "Material Lifespan", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { id: 4, name: "Toxin Detective", desc: "VOC & Health Risk", icon: Skull, color: "text-red-500", bg: "bg-red-50" },
    { id: 5, name: "Faux-Natural Buster", desc: "Fake Green Detection", icon: Search, color: "text-purple-500", bg: "bg-purple-50" },
    { id: 6, name: "Circular Economy", desc: "Recyclable vs Landfill", icon: Recycle, color: "text-blue-500", bg: "bg-blue-50" },
    { id: 7, name: "Ocean Impact", desc: "Plastic-to-Ocean Eq.", icon: Droplets, color: "text-cyan-500", bg: "bg-cyan-50" }
  ];

  // Cleanup camera on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setError(null);
    setImage(null);
    setResult(null);
    setShowHeatmap(false);
    setIsCameraOpen(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Could not access camera. Please ensure permissions are granted.");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setImage(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        setShowHeatmap(false);
        setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAudit = async () => {
    if (!image) return;

    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeRoomImage(base64Data);
      setResult(analysis);
      setShowHeatmap(true); // Auto-enable heatmap on result

      // Save to local history for Analytics
      const history = JSON.parse(localStorage.getItem('scangreen_history') || '[]');
      history.push({
        type: 'room',
        timestamp: new Date().toISOString(),
        score: 100 - analysis.plastic_load, // 100 is best, plastic_load is bad
        title: `Room Audit: ${analysis.plastic_load}% Plastic`
      });
      localStorage.setItem('scangreen_history', JSON.stringify(history.slice(-20))); // Keep last 20
    } catch (err) {
      setError("Failed to audit room. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setShowHeatmap(false);
    setError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper for Toxin Badge
  const getToxinBadge = (risk: string) => {
    const colors = {
      'Low': 'bg-emerald-100 text-emerald-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'High': 'bg-red-100 text-red-800',
      'Severe': 'bg-slate-800 text-white'
    };
    const colorClass = colors[risk as keyof typeof colors] || colors['Medium'];
    return (
      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${colorClass}`}>
        {risk} Risk
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      {/* The Radar Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Environment Audit</h2>
          <p className="text-slate-500 font-medium">7-Point Sustainability Scanner</p>
        </div>
        <div className="hidden md:flex items-center space-x-2 bg-slate-900 text-emerald-400 px-4 py-2 rounded-full text-xs font-mono border border-slate-700 shadow-lg">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span>SYSTEM ONLINE</span>
        </div>
      </div>

      {/* --- PROCESSING OVERLAY --- */}
      {loading && (
        <div className="absolute inset-0 z-50 glass-panel rounded-[2rem] flex flex-col items-center justify-center animate-fade-in bg-white/90 backdrop-blur-xl border border-emerald-100">
          <div className="relative mb-8">
            <div className="w-32 h-32 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ScanLine className="w-10 h-10 text-emerald-600 animate-pulse" />
            </div>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-2">Auditing Environment...</h3>
          <p className="text-slate-500 text-sm font-medium tracking-wide uppercase">AI Analysis in Progress</p>

          <div className="mt-10 space-y-4 w-72">
            <div className="flex items-center text-sm text-slate-600 bg-white/50 p-3 rounded-lg border border-slate-100">
              <Loader2 className="w-4 h-4 mr-3 animate-spin text-emerald-500" />
              Identifying materials...
            </div>
            <div className="flex items-center text-sm text-slate-600 bg-white/50 p-3 rounded-lg border border-slate-100 opacity-80">
              <Flame className="w-4 h-4 mr-3 text-slate-400" />
              Calculating ghost carbon...
            </div>
            <div className="flex items-center text-sm text-slate-600 bg-white/50 p-3 rounded-lg border border-slate-100 opacity-60">
              <Skull className="w-4 h-4 mr-3 text-slate-400" />
              Detecting VOC risks...
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">

        {/* --- COL 1: LIVE ENVIRONMENT SCAN (AR VIEWPORT) --- */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. INPUT BUTTON GRID (Only show if no image and camera is closed) */}
          {!isCameraOpen && !image && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <button
                onClick={startCamera}
                className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group"
              >
                <div className="bg-emerald-100 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Scan Room</h4>
                <p className="text-[10px] text-slate-400">Live Camera</p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group"
              >
                <div className="bg-blue-100 p-3 rounded-full mb-2 group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Upload Photo</h4>
                <p className="text-[10px] text-slate-400">From Gallery</p>
              </button>

              <button className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group opacity-50 cursor-not-allowed">
                <div className="bg-purple-100 p-3 rounded-full mb-2">
                  <ScanLine className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">3D Map</h4>
                <p className="text-[10px] text-slate-400">LiDAR Scan</p>
              </button>

              <button className="glass-panel p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group opacity-50 cursor-not-allowed">
                <div className="bg-amber-100 p-3 rounded-full mb-2">
                  <Mic className="w-6 h-6 text-amber-600" />
                </div>
                <h4 className="font-bold text-slate-700 text-sm">Voice Audit</h4>
                <p className="text-[10px] text-slate-400">Coming Soon</p>
              </button>
            </div>
          )}

          {/* 2. MAIN VIEWPORT (Camera OR Image) */}
          <div className="glass-panel p-2 rounded-[2rem] shadow-2xl relative border-2 border-white/40 min-h-[300px] flex flex-col justify-center">

            {/* AR Header Overlay */}
            {(isCameraOpen || image) && !loading && (
              <div className="absolute top-8 left-8 z-20 flex items-center space-x-3 pointer-events-none">
                <div className="bg-black/70 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-white/20 flex items-center">
                  <Scan className="w-3 h-3 mr-2 text-red-500" />
                  {isCameraOpen ? 'LIVE FEED' : (result ? 'AUDIT COMPLETE' : 'ANALYSIS MODE')}
                </div>
                {result && (
                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`pointer-events-auto px-3 py-1 rounded-full text-xs font-bold tracking-wider border border-white/20 flex items-center transition-colors ${showHeatmap ? 'bg-emerald-600 text-white' : 'bg-black/70 text-slate-300'}`}
                  >
                    <Layers className="w-3 h-3 mr-2" />
                    {showHeatmap ? 'HEATMAP ON' : 'HEATMAP OFF'}
                  </button>
                )}
              </div>
            )}

            {/* EMPTY STATE */}
            {!isCameraOpen && !image && (
              <div className="text-center p-12 opacity-60">
                <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-500 font-medium">Select an option above to begin 7-point audit</p>
              </div>
            )}

            {/* CAMERA ACTIVE */}
            {isCameraOpen && (
              <div className="relative rounded-[1.5rem] overflow-hidden aspect-video bg-black group">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                  onCanPlay={() => videoRef.current?.play()}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Capture Button */}
                <div className="absolute bottom-6 left-0 w-full flex justify-center items-center z-30">
                  <button
                    onClick={capturePhoto}
                    className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition-all"
                  >
                    <div className="w-12 h-12 bg-white rounded-full"></div>
                  </button>
                </div>

                <button
                  onClick={reset}
                  className="absolute top-6 right-6 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* IMAGE CAPTURED / UPLOADED */}
            {image && !isCameraOpen && (
              <div className="relative rounded-[1.5rem] overflow-hidden aspect-video group bg-black">
                <img src={image} alt="Room Scan" className={`w-full h-full object-cover transition-opacity duration-500 ${showHeatmap ? 'opacity-50' : 'opacity-90'}`} />

                {/* AR UI Elements */}
                <div className="absolute inset-0 border-[20px] border-black/10 pointer-events-none"></div>

                {/* Polymer Heatmap Overlay */}
                {result && showHeatmap && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 flex flex-wrap gap-2 max-w-[60%] animate-fade-in">
                      {result.detected_items.map((item, idx) => (
                        <div
                          key={idx}
                          className={`backdrop-blur-md px-3 py-1.5 rounded-lg border text-xs font-bold shadow-lg flex items-center transform transition-transform hover:scale-110 ${item.status === 'Bad'
                              ? 'bg-red-500/80 border-red-400 text-white'
                              : 'bg-emerald-500/80 border-emerald-400 text-white'
                            }`}
                          style={{
                            marginLeft: `${(idx * 20) % 50}px`,
                            marginTop: `${(idx * 15) % 40}px`
                          }}
                        >
                          <div className={`w-2 h-2 rounded-full mr-2 ${item.status === 'Bad' ? 'bg-red-200' : 'bg-emerald-200'}`}></div>
                          {item.name}
                        </div>
                      ))}
                    </div>
                    <div
                      className="absolute inset-0 mix-blend-overlay opacity-30 pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at center, ${result.plastic_load > 50 ? 'red' : 'green'}, transparent 70%)`
                      }}
                    ></div>
                  </div>
                )}

                {!loading && (
                  <button
                    onClick={reset}
                    className="absolute top-6 right-6 z-30 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* HIDDEN INPUT */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />

          {/* INITIATE BUTTON */}
          {image && !isCameraOpen && !result && !loading && (
            <button
              onClick={handleAudit}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-2xl shadow-slate-500/30 transition-all flex items-center justify-center tracking-wide transform hover:scale-[1.01]"
            >
              <Zap className="w-5 h-5 mr-2 text-yellow-400" /> INITIATE AUDIT
            </button>
          )}
          {error && <div className="glass-panel border-red-200 bg-red-50/50 text-red-600 p-4 rounded-xl">{error}</div>}
        </div>

        {/* --- COL 2: SCANNER MODULE RESULTS (GRID CARDS) --- */}
        <div className="space-y-4">
          {result ? (
            <div className="animate-fade-in space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-slate-800 text-lg">Audit Results</h3>
                <div className="flex items-center space-x-1 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span className="text-xs font-bold uppercase">Complete</span>
                </div>
              </div>

              {/* 1. Polymer Heatmap (Hero Card) */}
              <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-emerald-500 bg-gradient-to-r from-white to-emerald-50/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <Layers className="w-24 h-24 text-emerald-600" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">1. Polymer Heatmap</span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-black text-slate-800">{result.plastic_load}%</span>
                    <span className={`text-sm font-bold px-2 py-0.5 rounded-full ${result.plastic_load > 50 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {result.plastic_load > 50 ? 'High' : 'Low'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium">
                    {result.plastic_load > 50 ? "Most detected materials are synthetic plastics." : "Good balance of natural materials detected."}
                  </p>
                  {/* Visual Bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                    <div className={`h-full rounded-full ${result.plastic_load > 50 ? 'bg-gradient-to-r from-orange-400 to-red-500' : 'bg-gradient-to-r from-emerald-400 to-teal-500'}`} style={{ width: `${result.plastic_load}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* 2. Ghost Carbon */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-slate-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-4 h-4 text-slate-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">2. Ghost Carbon</span>
                  </div>
                  <div className="text-xl font-black text-slate-800 mb-1">{result.ghost_carbon}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Estimated emissions during manufacturing.</p>
                </div>

                {/* 3. Decomposition */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-amber-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">3. Decomposition</span>
                  </div>
                  <div className="text-xl font-black text-slate-800 mb-1">{result.decomposition_time}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Synthetic materials persist long after disposal.</p>
                </div>

                {/* 4. Toxin Detective */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-red-500 bg-red-50/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Skull className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">4. Toxin Detective</span>
                  </div>
                  <div className="mb-2">
                    {getToxinBadge(result.toxin_risk)}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight line-clamp-2">{result.toxin_warning || "Likely VOC release from plastics."}</p>
                </div>

                {/* 5. Faux-Natural Buster */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-purple-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="w-4 h-4 text-purple-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">5. Faux-Natural</span>
                  </div>
                  <div className="text-sm font-black text-slate-800 mb-1 line-clamp-1">{result.faux_natural_verdict}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">
                    {result.faux_natural_verdict.toLowerCase().includes('fake') || result.faux_natural_verdict.toLowerCase().includes('faux')
                      ? "Appears natural but is synthetic."
                      : "Material authenticity verified."}
                  </p>
                </div>

                {/* 6. Circular Economy */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-blue-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Recycle className="w-4 h-4 text-blue-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">6. Circular Econ</span>
                  </div>
                  <div className="text-sm font-black text-slate-800 mb-1 truncate">{result.circular_economy_status}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Most materials cannot re-enter the circular economy.</p>
                </div>

                {/* 7. Ocean Impact */}
                <div className="glass-panel p-4 rounded-2xl border-l-4 border-l-cyan-400 bg-cyan-50/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="w-4 h-4 text-cyan-500" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase">7. Ocean Impact</span>
                  </div>
                  <div className="text-xl font-black text-slate-800 mb-1">{result.ocean_impact}</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Equivalent ocean plastic burden.</p>
                </div>
              </div>

              <div className="pt-4 mt-2">
                <button onClick={reset} className="w-full text-center text-sm font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 p-3 rounded-xl transition-colors">
                  Start New Audit
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col glass-panel rounded-[2rem] p-6 text-center border-2 border-dashed border-white/50">
              <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center justify-center gap-2">
                <Scan className="w-5 h-5 text-emerald-600" /> Scanner Modules
              </h3>

              <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {scannerModules.map((module) => (
                  <div key={module.id} className={`flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/60 ${module.bg}`}>
                    <div className={`p-2 rounded-lg bg-white/80 shadow-sm ${module.color}`}>
                      <module.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{module.name}</div>
                      <div className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{module.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200/50">
                <p className="text-xs text-slate-500">
                  Ready to scan. All 7 modules will activate upon image capture.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};