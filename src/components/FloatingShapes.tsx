
import React from 'react';

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-20 w-12 h-12 rotate-45 opacity-30 animate-bounce" style={{ animationDuration: '4s' }}>
        <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-600 rounded-lg"></div>
      </div>
      
      <div className="absolute top-40 right-32 w-8 h-8 opacity-25 animate-pulse" style={{ animationDelay: '1s' }}>
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-500 rounded-full"></div>
      </div>
      
      <div className="absolute bottom-32 left-40 w-10 h-10 rotate-12 opacity-20 animate-bounce" style={{ animationDuration: '6s', animationDelay: '2s' }}>
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 rounded"></div>
      </div>
      
      <div className="absolute bottom-20 right-20 w-6 h-6 opacity-35 animate-pulse" style={{ animationDelay: '3s' }}>
        <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full"></div>
      </div>
      
      <div className="absolute top-1/2 left-12 w-14 h-14 rotate-45 opacity-25 animate-bounce" style={{ animationDuration: '8s' }}>
        <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg"></div>
      </div>
      
      <div className="absolute top-3/4 right-12 w-9 h-9 opacity-30 animate-pulse" style={{ animationDelay: '4s' }}>
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-500 rounded"></div>
      </div>
    </div>
  );
};

export default FloatingShapes;
