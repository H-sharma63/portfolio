'use client';

import React, { useState, useEffect } from 'react';

const DebugScreen = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getBreakpoint = (w: number) => {
    if (w >= 1536) return '2xl';
    if (w >= 1280) return 'xl';
    if (w >= 1024) return 'lg';
    if (w >= 768) return 'md';
    if (w >= 640) return 'sm';
    return 'xs'; // Custom breakpoint for extra small screens
  };

  return (
    <div className="fixed bottom-4 left-4 z-[9999] bg-black text-white px-3 py-1 rounded-md text-xs font-mono opacity-75">
      {getBreakpoint(width)} ({width}px)
    </div>
  );
};

export default DebugScreen;
