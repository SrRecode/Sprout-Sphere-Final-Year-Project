import React from 'react';

const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc,
  objectFit = 'cover',
  ...props 
}) => {
  // Filter out custom props that shouldn't be passed to the img element
  const {
    // Remove any other custom props here if needed
    ...imgProps
  } = props;

  return (
    <img
      src={src}
      alt={alt}
      className={`w-full h-auto ${className}`}
      style={{ objectFit }}
      loading="lazy"
      onError={(e) => {
        if (fallbackSrc && e.target.src !== fallbackSrc) {
          e.target.src = fallbackSrc;
        }
      }}
      {...imgProps}
    />
  );
};

export default ResponsiveImage;
