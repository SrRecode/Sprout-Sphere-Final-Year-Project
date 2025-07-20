import React, { useState, useEffect } from 'react';

const ScrollProgress = ({ height = 3, color = '#16a34a' }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollTop / docHeight;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial calculation
    updateScrollProgress();
    
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: `${height}px`,
        backgroundColor: 'rgba(229, 231, 235, 0.2)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${scrollProgress * 100}%`,
          backgroundColor: color,
          transition: 'width 0.1s ease-out',
        }}
      />
    </div>
  );
};

export default ScrollProgress; 