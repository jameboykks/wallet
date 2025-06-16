import React from 'react';

export default function GlassCard({ children, className = "", style = {} }) {
  return (
    <div className={`glass-card ${className}`} style={style}>
      {/* Blobs SVG overlay */}
      <svg style={{
        position: "absolute", left: 0, top: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none"
      }}>
        <defs>
          <radialGradient id="b1" cx="50%" cy="40%" r="80%">
            <stop offset="0%" stopColor="#7F5FFF" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E0C3FC" stopOpacity="0.12" />
          </radialGradient>
        </defs>
        <ellipse cx="60%" cy="35%" rx="160" ry="80" fill="url(#b1)" />
        <ellipse cx="30%" cy="70%" rx="90" ry="60" fill="#43E97B33" />
        <ellipse cx="75%" cy="75%" rx="90" ry="40" fill="#48C6EF22" />
      </svg>
      <div style={{position:'relative', zIndex:2}}>
        {children}
      </div>
    </div>
  );
}
