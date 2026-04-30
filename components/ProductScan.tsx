import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, AlertTriangle, Loader2, Camera, ScanLine, Brain, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { analyzeProductImage } from '../services/geminiService';
import { ProductAnalysisResult } from '../types';

export const ProductScan: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProductAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setError(null);
        setIsCameraOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    setError(null);
    setImage(null);
    setResult(null);
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

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const base64Data = image.split(',')[1];
      const analysis = await analyzeProductImage(base64Data);
      setResult(analysis);

      // Save to local history for Analytics
      const history = JSON.parse(localStorage.getItem('scangreen_history') || '[]');
      history.push({
        type: 'product',
        timestamp: new Date().toISOString(),
        score: analysis.eco_score,
        title: analysis.verdict
      });
      localStorage.setItem('scangreen_history', JSON.stringify(history.slice(-20))); // Keep last 20
      
      // GAMIFICATION: Add XP
      const currentXp = parseInt(localStorage.getItem('scangreen_xp') || '0', 10);
      localStorage.setItem('scangreen_xp', (currentXp + 50).toString());
      
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setError(null);
    stopCamera();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Determine color based on score (Lower score = Bad/Red, Higher = Good/Green)
  const getScoreColor = (score: number) => {
    if (score < 40) return 'bg-red-500';
    if (score < 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">ScanGreen</h2>
        <p className="text-slate-500 font-medium">Plastic-Free Verification & Health Risk Assessment</p>
      </div>

      {/* --- INPUT AREA --- */}
      {!result && (
        <div className="max-w-4xl mx-auto space-y-8">
          {!isCameraOpen && !image && (
            <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-8 max-w-lg mx-auto">
              <button onClick={startCamera} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group">
                <div className="bg-emerald-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform"><Camera className="w-6 h-6 text-emerald-600" /></div>
                <h4 className="font-bold text-slate-700">Scan Product</h4>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-all group">
                <div className="bg-blue-100 p-4 rounded-full mb-3 group-hover:scale-110 transition-transform"><Upload className="w-6 h-6 text-blue-600" /></div>
                <h4 className="font-bold text-slate-700">Upload Photo</h4>
              </button>
            </div>
          )}

          <div className="glass-panel p-4 rounded-3xl shadow-xl bg-white/80 relative min-h-[300px] flex flex-col items-center justify-center">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center mb-4"><AlertTriangle className="w-5 h-5 mr-2" /> {error}</div>}

            {(isCameraOpen || image) && (
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full max-w-md mx-auto bg-black shadow-2xl">
                {isCameraOpen ? (
                  <>
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" onCanPlay={() => videoRef.current?.play()} />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="absolute bottom-6 left-0 w-full flex justify-center items-center gap-6 z-20">
                      <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-transparent hover:bg-white/20 transition-all"><div className="w-12 h-12 bg-white rounded-full"></div></button>
                    </div>
                  </>
                ) : (
                  <>
                    <img src={image!} alt="Preview" className="w-full h-full object-cover" />
                    {!loading && (
                      <div className="absolute bottom-6 left-0 w-full flex justify-center">
                        <button onClick={handleAnalyze} className="bg-emerald-600 text-white font-bold text-lg px-10 py-4 rounded-full shadow-lg shadow-emerald-500/40 hover:bg-emerald-700 transition-all flex items-center transform hover:scale-105 border-2 border-white/20">
                          <Brain className="w-6 h-6 mr-2" /> Analyze Product
                        </button>
                      </div>
                    )}
                    {loading && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                        <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-400" />
                        <span className="font-bold text-xl mb-1">Analyzing...</span>
                      </div>
                    )}
                  </>
                )}
                <button onClick={reset} className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 z-30"><X className="w-5 h-5" /></button>
              </div>
            )}

            {!isCameraOpen && !image && (
              <div className="text-center p-8">
                <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4"><ScanLine className="w-10 h-10 text-emerald-300" /></div>
                <p className="text-slate-500 max-w-xs mx-auto">Use the camera or upload a photo to begin.</p>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      )}

      {/* --- RESULT OUTPUT --- */}
      {result && (
        <div className="max-w-3xl mx-auto animate-fade-in bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">

          {/* 1. Eco Score Text */}
          <div className="font-bold text-slate-800 text-lg mb-2">
            Eco Score: {result.eco_score}%
          </div>

          {/* 2. Progress Bar */}
          <div className="w-full h-5 bg-slate-200 rounded-full mb-8 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(result.eco_score)}`}
              style={{ width: `${result.eco_score}%` }}
            ></div>
          </div>

          {/* 3. Verdict */}
          <div className="mb-6">
            <span className="font-bold text-slate-800 text-lg">Verdict: </span>
            <span className="text-slate-700 font-medium text-lg">{result.verdict}</span>
          </div>

          {/* 4. Reasoning */}
          <div className="mb-6 text-slate-600 leading-relaxed text-sm md:text-base">
            <span className="font-bold text-slate-800">Reasoning: </span>
            {result.reasoning}
          </div>

          {/* Eco-Alternative Button */}
          {result.recommended_alternative && result.eco_score < 80 && (
            <div className="mb-8 p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
               <div>
                  <h4 className="text-emerald-800 font-bold flex items-center gap-2">
                    <ScanLine className="w-5 h-5" /> Better Alternative Detected
                  </h4>
                  <p className="text-emerald-700/80 text-sm mt-1">Switch to a <strong>{result.recommended_alternative}</strong> to reduce your plastic footprint.</p>
               </div>
               <button className="whitespace-nowrap px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/30 hover:bg-emerald-700 transition-all transform hover:scale-105">
                 Shop Alternative
               </button>
            </div>
          )}

          {/* 5. Concerns (Red Box) */}
          {result.concerns && result.concerns.length > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-8">
              <div className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 shrink-0" strokeWidth={3} />
                <div>
                  <span className="font-bold text-red-800">Concerns: </span>
                  <span className="text-red-700 font-medium">
                    {result.concerns.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 6. Technical Details (Dropdown) */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <details className="group">
              <summary className="flex items-center justify-between p-4 cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center text-slate-700 font-bold">
                  <Info className="w-5 h-5 text-blue-500 mr-2" />
                  Technical Details
                </div>
                <ChevronDown className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                {result.technical_details.map((item, idx) => (
                  <div key={idx} className="flex justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                    <span className="text-slate-500 font-medium text-sm">{item.label}</span>
                    <span className="text-slate-800 font-bold text-sm text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </details>
          </div>

          {/* Action Button to Reset */}
          <div className="mt-8 text-center">
            <button
              onClick={reset}
              className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline"
            >
              Scan Another Product
            </button>
          </div>

        </div>
      )}
    </div>
  );
};