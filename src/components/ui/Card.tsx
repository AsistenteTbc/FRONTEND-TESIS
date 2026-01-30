import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 ${className}`}>
      {children}
    </div>
  );
};