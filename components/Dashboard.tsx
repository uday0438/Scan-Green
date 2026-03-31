import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Newspaper, Loader2 } from 'lucide-react';
import { getSustainabilityNews, NewsItem } from '../services/geminiService';

const FALLBACK_NEWS: NewsItem[] = [
  { 
    headline: "Global Plastic Treaty Negotiations Progress", 
    summary: "Nations working towards a legally binding international instrument to end plastic pollution.", 
    source: "UN Environment", 
    date: "Latest",
    url: "https://www.unep.org/news-and-stories/story/inc-5-what-expect-final-round-plastic-treaty-talks",
    image_keyword: "conference"
  },
  { 
    headline: "Renewable Energy Breaks Global Records", 
    summary: "Solar and wind power generation capacity sees unprecedented growth worldwide.", 
    source: "Energy News", 
    date: "Latest",
    url: "https://www.iea.org/reports/renewables-2024",
    image_keyword: "solar"
  },
  { 
    headline: "Innovations in Ocean Cleanup Technology", 
    summary: "New autonomous systems deployed to remove microplastics from coastal waters.", 
    source: "Ocean Tech", 
    date: "Latest",
    url: "https://theoceancleanup.com/",
    image_keyword: "ocean"
  }
];

export const Dashboard: React.FC = () => {
  // --- CAROUSEL STATE ---
  const [currentSlide, setCurrentSlide] = useState(0);
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);

  // --- FETCH NEWS ON MOUNT ---
  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      setLoadingNews(true);
      try {
        const news = await getSustainabilityNews();
        if (isMounted) {
          setNewsData(news.length > 0 ? news : FALLBACK_NEWS);
        }
      } catch (e) {
        if (isMounted) setNewsData(FALLBACK_NEWS);
      } finally {
        if (isMounted) setLoadingNews(false);
      }
    };
    fetchNews();
    return () => { isMounted = false; };
  }, []);

  const displayData = loadingNews ? FALLBACK_NEWS : newsData;
  const totalSlides = displayData.length;

  // --- AUTO SLIDE CAROUSEL ---
  useEffect(() => {
    if (loadingNews) return; // Don't auto-slide while "loading" state (though we show fallback)
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [totalSlides, loadingNews]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide(index);
  };

  // Helper to get image based on keyword
  const getNewsImage = (keyword: string) => {
      const keys = keyword ? keyword.toLowerCase() : 'nature';
      if (keys.includes('ocean') || keys.includes('water') || keys.includes('sea')) return 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?q=80&w=2670&auto=format&fit=crop';
      if (keys.includes('plastic') || keys.includes('waste') || keys.includes('pollution')) return 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2670&auto=format&fit=crop';
      if (keys.includes('forest') || keys.includes('tree') || keys.includes('plant')) return 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2674&auto=format&fit=crop';
      if (keys.includes('solar') || keys.includes('energy') || keys.includes('wind')) return 'https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2672&auto=format&fit=crop';
      if (keys.includes('city') || keys.includes('urban') || keys.includes('building')) return 'https://images.unsplash.com/photo-1449824913929-2b6a6213fa53?q=80&w=2670&auto=format&fit=crop';
      if (keys.includes('cloud') || keys.includes('air') || keys.includes('climate')) return 'https://images.unsplash.com/photo-1534081333815-ae5019106622?q=80&w=2670&auto=format&fit=crop';
      if (keys.includes('conference') || keys.includes('meeting')) return 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2670&auto=format&fit=crop';
      return 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=2560&auto=format&fit=crop'; // Default
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 tracking-tight">Welcome to ScanGreen 🌱</h2>
          <p className="text-slate-600 mt-2 text-lg">Your daily sustainability briefing & auditor.</p>
        </div>
      </div>

      {/* --- BOOTSTRAP-STYLE IMAGE CAROUSEL --- */}
      <div className="relative w-full h-[450px] md:h-[520px] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-white/20">
        
        {/* Loading Overlay */}
        {loadingNews && (
           <div className="absolute inset-0 z-20 bg-slate-100 flex flex-col items-center justify-center">
              <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-3" />
              <p className="text-slate-500 font-medium">Fetching global headlines...</p>
           </div>
        )}

        {/* Slides Container */}
        {displayData.map((news, index) => (
            <a
              key={index}
              href={news.url}
              target="_blank"
              rel="noreferrer"
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out cursor-pointer ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
                {/* Background Image with Zoom Effect on Hover */}
                <div className="absolute inset-0 overflow-hidden">
                    <img 
                        src={getNewsImage(news.image_keyword)} 
                        alt={news.headline}
                        className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out transform scale-100 hover:scale-105"
                    />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-14 flex flex-col justify-end h-full pointer-events-none">
                    <div className="max-w-4xl animate-fade-in">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center">
                                <Newspaper className="w-3 h-3 mr-1.5" /> Global News
                            </span>
                            <span className="text-slate-300 text-xs font-medium uppercase tracking-wider border-l border-slate-500 pl-3">
                                {news.source} • {news.date}
                            </span>
                        </div>
                        
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            {news.headline}
                        </h3>
                        
                        <p className="text-lg text-slate-200 line-clamp-2 md:line-clamp-none max-w-2xl leading-relaxed mb-6 opacity-90">
                            {news.summary}
                        </p>

                        <div className="inline-flex items-center text-emerald-400 font-bold text-sm uppercase tracking-wide group-hover:text-emerald-300 transition-colors">
                            Read Full Story <ExternalLink className="w-4 h-4 ml-2" />
                        </div>
                    </div>
                </div>
            </a>
        ))}

        {/* --- CONTROLS --- */}
        
        {/* Previous Button */}
        <button 
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
            <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button 
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
        >
            <ChevronRight className="w-6 h-6" />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 right-8 md:right-14 z-20 flex space-x-2">
            {displayData.map((_, idx) => (
                <button
                    key={idx}
                    onClick={(e) => goToSlide(idx, e)}
                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                        idx === currentSlide 
                        ? 'w-8 bg-emerald-500' 
                        : 'w-2 bg-white/50 hover:bg-white/80'
                    }`}
                />
            ))}
        </div>
      </div>
    </div>
  );
};