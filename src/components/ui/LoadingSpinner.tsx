// src/components/ui/LoadingSpinner.tsx
import React from 'react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<Props> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className={`inline-block animate-spin rounded-full border-gray-300 border-t-blue-500 ${sizeClasses[size]} ${className}`}></div>
  );
};