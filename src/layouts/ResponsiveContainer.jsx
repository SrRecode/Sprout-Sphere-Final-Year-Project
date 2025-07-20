import React from 'react';
import PropTypes from 'prop-types';

/**
 * A responsive container component that provides consistent spacing
 * and width constraints across different device sizes
 */
const ResponsiveContainer = ({ 
  children, 
  className = '',
  as: Component = 'div', 
  fluid = false,
  centered = true,
  withPadding = true,
  maxWidth = '7xl' // 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl'
}) => {
  const baseClasses = [
    fluid ? 'w-full' : `max-w-${maxWidth}`,
    centered && 'mx-auto',
    withPadding && 'px-4 sm:px-6 lg:px-8',
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={baseClasses}>
      {children}
    </Component>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  as: PropTypes.elementType,
  fluid: PropTypes.bool,
  centered: PropTypes.bool,
  withPadding: PropTypes.bool,
  maxWidth: PropTypes.string
};

export default ResponsiveContainer; 