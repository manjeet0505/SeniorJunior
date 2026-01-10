'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to detect screen size and provide responsive breakpoints
 * @returns {Object} - Screen size information and utility functions
 */
export function useResponsive() {
  // Initialize with default values (desktop)
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Handler to call on window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Utility function to get appropriate class based on screen size
  const getResponsiveClass = (mobileClass, tabletClass, desktopClass) => {
    if (screenSize.isMobile) return mobileClass;
    if (screenSize.isTablet) return tabletClass;
    return desktopClass;
  };

  return {
    ...screenSize,
    getResponsiveClass
  };
}

/**
 * Custom hook to handle responsive navigation
 * @returns {Object} - Navigation state and methods
 */
export function useResponsiveNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isMobile, isTablet } = useResponsive();

  // Close menu when screen size changes from mobile to desktop
  useEffect(() => {
    if (!isMobile && !isTablet) {
      setIsMenuOpen(false);
    }
  }, [isMobile, isTablet]);

  // Toggle menu
  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  // Close menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return {
    isMenuOpen,
    toggleMenu,
    closeMenu,
    isMobileOrTablet: isMobile || isTablet
  };
}

/**
 * Custom hook to handle responsive layout
 * @returns {Object} - Layout state and methods
 */
export function useResponsiveLayout() {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // Get grid column count based on screen size
  const getGridColumns = (mobileColumns = 1, tabletColumns = 2, desktopColumns = 3) => {
    if (isMobile) return mobileColumns;
    if (isTablet) return tabletColumns;
    return desktopColumns;
  };

  // Get flex direction based on screen size
  const getFlexDirection = (mobileDirection = 'column', tabletDirection = 'row', desktopDirection = 'row') => {
    if (isMobile) return mobileDirection;
    if (isTablet) return tabletDirection;
    return desktopDirection;
  };

  // Generate responsive padding
  const getResponsivePadding = (mobilePadding = 4, tabletPadding = 6, desktopPadding = 8) => {
    if (isMobile) return `p-${mobilePadding}`;
    if (isTablet) return `p-${tabletPadding}`;
    return `p-${desktopPadding}`;
  };

  // Generate responsive margin
  const getResponsiveMargin = (mobileMargin = 4, tabletMargin = 6, desktopMargin = 8) => {
    if (isMobile) return `m-${mobileMargin}`;
    if (isTablet) return `m-${tabletMargin}`;
    return `m-${desktopMargin}`;
  };

  return {
    isMobile,
    isTablet,
    isDesktop,
    getGridColumns,
    getFlexDirection,
    getResponsivePadding,
    getResponsiveMargin
  };
}
