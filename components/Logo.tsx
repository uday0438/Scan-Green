import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <defs>
        {/* Border Gradient: Nature Green to Tech Blue */}
        <linearGradient id="borderGradient" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#10b981" /> {/* Emerald */}
          <stop offset="50%" stopColor="#06b6d4" /> {/* Cyan */}
          <stop offset="100%" stopColor="#3b82f6" /> {/* Blue */}
        </linearGradient>
        
        {/* Hand Gradient: Vibrant Greens */}
        <linearGradient id="handGradient" x1="20" y1="80" x2="80" y2="40">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>

        {/* Screen Gradient */}
        <linearGradient id="screenGradient" x1="37" y1="32" x2="63" y2="74">
            <stop offset="0%" stopColor="#ecfdf5" />
            <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
      </defs>

      {/* 1. Circular Border */}
      <circle cx="50" cy="50" r="46" stroke="url(#borderGradient)" strokeWidth="3" />

      {/* 2. Scanning Rays (Light lines) */}
      <g stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M50 22 L50 12" />
        <path d="M35 25 L28 16" />
        <path d="M65 25 L72 16" />
      </g>

      {/* 3. Hand (Wrist/Back part) */}
      <path d="M35 75 Q 50 85 65 75 L 65 90 Q 50 100 35 90 Z" fill="url(#handGradient)" />

      {/* 4. Smartphone Body */}
      <rect x="34" y="28" width="32" height="56" rx="4" fill="white" stroke="#334155" strokeWidth="1" />
      
      {/* Screen */}
      <rect x="37" y="32" width="26" height="46" rx="1" fill="url(#screenGradient)" />

      {/* Leaf Icon on Screen */}
      <path 
        d="M50 37 C 50 37 43 41 43 46 C 43 51 50 55 50 55 C 50 55 57 51 57 46 C 57 41 50 37 50 37 Z" 
        fill="#16a34a" 
      />
      <path d="M50 37 L 50 55" stroke="#dcfce7" strokeWidth="0.5" />

      {/* Barcode on Screen */}
      <g fill="#1e293b" transform="translate(0, 4)">
         <rect x="40" y="60" width="1" height="7" />
         <rect x="42" y="60" width="2" height="7" />
         <rect x="45" y="60" width="1" height="7" />
         <rect x="47" y="60" width="2" height="7" />
         <rect x="50" y="60" width="1" height="7" />
         <rect x="52" y="60" width="2" height="7" />
         <rect x="55" y="60" width="1" height="7" />
         <rect x="57" y="60" width="1" height="7" />
         <rect x="59" y="60" width="1" height="7" />
      </g>

      {/* 5. Hand Fingers (Overlaying phone to create grip effect) */}
      <g fill="url(#handGradient)">
        {/* Thumb on left */}
        <path d="M28 55 Q 34 50 34 60 L 34 70 Q 30 75 28 65 Z" />
        {/* Fingers on right */}
        <path d="M72 45 Q 66 45 66 55 L 66 75 Q 70 80 72 60 Z" />
      </g>

      {/* Home Button */}
      <circle cx="50" cy="80" r="1.5" fill="#94a3b8" />
    </svg>
  );
};