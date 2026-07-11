"use client";
import React from 'react';

export interface LensImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  effect?: string;
}

export function LensImage({ effect, ...props }: LensImageProps) {
  // Simple wrapper that will process the lens effect on the img element
  return (
    <div className="lens-image-wrapper" style={{ display: 'inline-block', position: 'relative' }}>
      <img {...props} data-lens-effect={effect} />
    </div>
  );
}
