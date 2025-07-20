/**
 * Responsive utilities for the SproutSphere application
 */

import { useEffect, useState, useCallback } from 'react';

// Define breakpoints to match Tailwind CSS breakpoints
const breakpoints = {
  xs: 0,     // Extra small devices (portrait phones)
  sm: 640,   // Small devices (landscape phones)
  md: 768,   // Medium devices (tablets)
  lg: 1024,  // Large devices (desktops)
  xl: 1280,  // Extra large devices (large desktops)
  '2xl': 1536 // Very large screens
};

/**
 * Hook that returns the current screen size and utilities to check specific breakpoints
 */
export const useResponsive = () => {
  // Initial state from window or default to desktop (client-side only)
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  // Function to check if current width is smaller than a breakpoint
  const isSmallerThan = useCallback(
    (breakpoint) => screenSize.width < breakpoints[breakpoint],
    [screenSize.width]
  );

  // Function to check if current width is larger than a breakpoint
  const isLargerThan = useCallback(
    (breakpoint) => screenSize.width >= breakpoints[breakpoint],
    [screenSize.width]
  );

  // Function to check if current width is between two breakpoints
  const isBetween = useCallback(
    (minBreakpoint, maxBreakpoint) =>
      screenSize.width >= breakpoints[minBreakpoint] &&
      screenSize.width < breakpoints[maxBreakpoint],
    [screenSize.width]
  );

  // Shorthand properties for common breakpoint checks
  const isMobile = isSmallerThan('md');
  const isTablet = isBetween('md', 'lg');
  const isDesktop = isLargerThan('lg');

  // Update screen size on resize
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    screenSize,
    isSmallerThan,
    isLargerThan,
    isBetween,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
};

/**
 * Generates responsive class strings for Tailwind CSS
 * @param {Object} config - Configuration object with breakpoint keys and values
 * @returns {String} - Space-separated string of classes
 * 
 * Example usage:
 * responsive({
 *   base: 'px-4',
 *   sm: 'px-6',
 *   lg: 'px-8'
 * }) 
 * => "px-4 sm:px-6 lg:px-8"
 */
export const responsive = (config) => {
  if (!config || typeof config !== 'object') return '';

  return Object.entries(config)
    .map(([breakpoint, value]) => {
      if (breakpoint === 'base') return value;
      return `${breakpoint}:${value}`;
    })
    .join(' ');
};

/**
 * Returns true when executing on the server, false on the client
 */
export const isServer = () => typeof window === 'undefined';

/**
 * Get the current breakpoint name based on window width
 */
export const getCurrentBreakpoint = (width = typeof window !== 'undefined' ? window.innerWidth : 0) => {
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
}; 