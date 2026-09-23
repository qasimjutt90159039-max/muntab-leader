import React, { useState } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackTitle?: string;
  aspectRatioClass?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackTitle,
  aspectRatioClass = 'aspect-4/3',
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectRatioClass} bg-gradient-to-br from-[#2E2019] to-[#1E1511] flex flex-col items-center justify-center p-4 text-center select-none ${className}`}
      >
        <svg
          className="w-10 h-10 text-[#C89D6E]/50 mb-2"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
        <span className="text-[11px] uppercase tracking-widest text-[#C89D6E]/80 font-medium">
          Mutalib's Leather Factory
        </span>
        {fallbackTitle && (
          <span className="text-xs text-stone-300 line-clamp-1 mt-1 font-serif max-w-[85%]">
            {fallbackTitle}
          </span>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={`${className}`}
      {...props}
    />
  );
};
