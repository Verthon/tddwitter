import { forwardRef, type MouseEvent, type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full';

const variantClasses = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline:
    'border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50',
} as const;

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-base',
  lg: 'h-12 px-6 text-lg',
} as const;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      isDisabled = false,
      variant = 'primary',
      size = 'md',
      onClick,
      type = 'button',
      className = '',
      ...props
    },
    ref,
  ) => {
    const disabledClasses = isDisabled
      ? 'opacity-50 cursor-not-allowed hover:bg-current'
      : '';

    const buttonClasses =
      `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`.trim();

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onClick={onClick}
        type={type}
        className={buttonClasses}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
