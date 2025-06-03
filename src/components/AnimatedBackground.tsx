
import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main gradient shapes */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-20 animate-pulse">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 blur-3xl"></div>
      </div>
      
      <div className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-25 animate-bounce" style={{ animationDuration: '6s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 blur-2xl"></div>
      </div>
      
      <div className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '2s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-400 via-orange-400 to-red-400 blur-3xl"></div>
      </div>
      
      <div className="absolute bottom-1/3 right-1/3 w-64 h-64 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '8s', animationDelay: '1s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-400 blur-2xl"></div>
      </div>
      
      {/* Smaller accent shapes */}
      <div className="absolute top-1/2 left-1/6 w-48 h-48 rounded-full opacity-10 animate-pulse" style={{ animationDelay: '3s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-xl"></div>
      </div>
      
      <div className="absolute top-3/4 right-1/6 w-56 h-56 rounded-full opacity-15 animate-bounce" style={{ animationDuration: '10s' }}>
        <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-400 to-purple-600 blur-xl"></div>
      </div>
      
      {/* Overlay gradient for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/70 to-white/80"></div>
    </div>
  );
};

export default AnimatedBackground;
