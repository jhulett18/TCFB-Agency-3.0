import React, { useState } from 'react';
import './Image.css';

interface ImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export default function Image({ 
  src, 
  alt, 
  className = '', 
  width, 
  height, 
  style = {}, 
  onLoad,
  onError 
}: ImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Resolve the correct path based on environment
  const resolvePath = (imageSrc: string): string => {
    // If it's already an absolute URL, return as is
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://')) {
      return imageSrc;
    }
    
    // If it's already an absolute path starting with /, return as is
    if (imageSrc.startsWith('/')) {
      return imageSrc;
    }
    
    // For relative paths, prepend the correct base path
    const basePath = process.env.NODE_ENV === 'production' ? '/agency' : '';
    return `${basePath}/${imageSrc}`;
  };

  const resolvedSrc = resolvePath(src);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  if (hasError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{ 
          width: width || 'auto', 
          height: height || 'auto',
          ...style 
        }}
      >
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <div className={`image-container ${className}`}>
      {isLoading && (
        <div className="image-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        style={{
          ...style,
          opacity: isLoading ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out'
        }}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
} 