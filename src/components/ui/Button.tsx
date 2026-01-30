import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  isLoading?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading = false, 
  fullWidth = false,
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props 
}) => {
  
  // Estilos base
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden";
  
  // Tamaños
  const sizes = {
    sm: "px-4 py-2.5 text-sm gap-2",
    md: "px-6 py-3.5 text-base gap-3",
    lg: "px-8 py-4 text-lg gap-4"
  };
  
  // Variantes de color
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 focus:ring-2 focus:ring-blue-500/50",
    secondary: "bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600/50 hover:border-gray-500/50 shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 focus:ring-2 focus:ring-gray-500/50",
    outline: "bg-transparent border-2 border-gray-600/50 text-gray-300 hover:border-blue-500/50 hover:text-white focus:ring-2 focus:ring-blue-500/30",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-gray-800/50 focus:ring-2 focus:ring-gray-500/30",
    danger: "bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-white focus:ring-2 focus:ring-red-500/50 hover:border-red-400/50",
    success: "bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/30 text-green-400 hover:bg-green-500/20 hover:text-white focus:ring-2 focus:ring-green-500/50 hover:border-green-400/50"
  };

  // Spinner de carga
  const LoadingSpinner = () => (
    <div className="relative">
      <div className={`w-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} h-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} border-2 border-current border-opacity-20 rounded-full`}></div>
      <div className={`w-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} h-${size === 'sm' ? '4' : size === 'md' ? '5' : '6'} border-2 border-current border-t-transparent rounded-full animate-spin absolute top-0 left-0`}></div>
    </div>
  );

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Efecto de gradiente al hacer hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
      
      {/* Contenido del botón */}
      <div className="relative z-10 flex items-center justify-center">
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Cargando...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="group-hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
            )}
            <span className="group-hover:scale-[1.02] transition-transform duration-300">
              {children}
            </span>
            {icon && iconPosition === 'right' && (
              <span className="group-hover:scale-110 transition-transform duration-300">
                {icon}
              </span>
            )}
          </>
        )}
      </div>
    </button>
  );
};