import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

/**
 * VisuallyHidden component for screen reader text
 * that is not visible on screen
 */
export const VisuallyHidden = forwardRef(({ as: Component = 'span', children, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
      {...props}
    >
      {children}
    </Component>
  );
});

VisuallyHidden.displayName = 'VisuallyHidden';

VisuallyHidden.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
};

/**
 * FocusTrap component to manage focus inside modal dialogs
 */
export const FocusTrap = ({ children, active = true, initialFocus }) => {
  const [mounted, setMounted] = React.useState(false);
  const rootRef = React.useRef(null);
  
  // Set up event listeners and focus management when component mounts
  React.useEffect(() => {
    if (!active) return;
    
    setMounted(true);
    
    const root = rootRef.current;
    if (!root) return;
    
    // Store last focused element to restore focus when unmounting
    const previouslyFocused = document.activeElement;
    
    // Get all focusable elements
    const focusableElements = root.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    // Set initial focus
    if (initialFocus && initialFocus.current) {
      initialFocus.current.focus();
    } else if (firstElement) {
      firstElement.focus();
    }
    
    // Handle tab key to keep focus inside the dialog
    const handleKeyDown = (e) => {
      if (e.key !== 'Tab') return;
      
      // Shift+Tab on first element should loop to last element
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
      
      // Tab on last element should loop to first element
      if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };
    
    // Add event listener for keyboard navigation
    root.addEventListener('keydown', handleKeyDown);
    
    // Cleanup function
    return () => {
      root.removeEventListener('keydown', handleKeyDown);
      // Restore focus to previously focused element
      if (previouslyFocused) {
        previouslyFocused.focus();
      }
    };
  }, [active, initialFocus]);
  
  // Don't render children until after first render to avoid SSR issues
  if (!mounted) return null;
  
  return (
    <div ref={rootRef} style={{ outline: 'none' }} tabIndex="-1">
      {children}
    </div>
  );
};

FocusTrap.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  initialFocus: PropTypes.shape({ current: PropTypes.any }),
};

/**
 * SkipLink component to allow keyboard users to skip navigation
 */
export const SkipLink = ({ targetId = 'main-content', children = 'Skip to main content' }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-primary-600 focus:shadow-lg focus:rounded"
    >
      {children}
    </a>
  );
};

SkipLink.propTypes = {
  targetId: PropTypes.string,
  children: PropTypes.node,
};

export default {
  VisuallyHidden,
  FocusTrap,
  SkipLink,
}; 