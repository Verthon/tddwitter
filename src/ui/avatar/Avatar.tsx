import React from 'react';

interface AvatarProps {
  src: string;
  alt: string;
  size?: number; // pixel size, defaults to 32
}

export const Avatar = ({ src, alt, size = 32 }: AvatarProps) => (
  <img
    src={src}
    alt={alt}
    width={size}
    height={size}
    className="rounded-full object-cover"
  />
);
