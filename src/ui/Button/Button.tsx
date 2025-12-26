import { forwardRef, type MouseEvent, type ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:enabled:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500',
  secondary: 'bg-gray-200 text-gray-900 hover:enabled:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
  outline:
    'border-2 border-gray-400 bg-transparent text-gray-900 hover:enabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400',
  ghost: 'bg-transparent text-gray-900 hover:enabled:bg-gray-100 disabled:text-gray-400',
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
      fullWidth = false,
      onClick,
      type = 'button',
      ariaLabel,
      ...props
    },
    ref,
  ) => {
    const widthClasses = fullWidth ? 'w-full' : '';

    const buttonClasses =
      `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses}`.trim();

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        onClick={onClick}
        type={type}
        className={buttonClasses}
        aria-label={ariaLabel}
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
