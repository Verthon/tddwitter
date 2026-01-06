import { forwardRef, type MouseEvent, type ReactNode } from 'react';

interface BaseIconButtonProps {
  children: ReactNode;
  isDisabled?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
}

interface IconButtonAsButton extends BaseIconButtonProps {
  as?: 'button';
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  href?: never;
}

interface IconButtonAsLink extends BaseIconButtonProps {
  as: 'link';
  href: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  type?: never;
}

type IconButtonProps = IconButtonAsButton | IconButtonAsLink;

const baseClasses =
  'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-full cursor-pointer disabled:cursor-not-allowed';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:enabled:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500',
  secondary: 'bg-gray-200 text-gray-900 hover:enabled:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400',
  outline:
    'border-2 border-gray-400 bg-transparent text-gray-900 hover:enabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400',
  ghost: 'bg-transparent text-gray-900 hover:enabled:bg-gray-100 disabled:text-gray-400',
} as const;

const sizeClasses = {
  sm: 'h-8 w-8 p-1',
  md: 'h-10 w-10 p-2',
  lg: 'h-12 w-12 p-2.5',
} as const;

const IconButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconButtonProps>(
  ({ children, isDisabled = false, variant = 'ghost', size = 'md', ariaLabel, ...props }, ref) => {
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`.trim();

    if (props.as === 'link') {
      const { href, onClick } = props;
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          onClick={onClick}
          className={classes}
          aria-label={ariaLabel}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
        >
          {children}
        </a>
      );
    }

    const { onClick, type = 'button' } = props;
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={isDisabled}
        onClick={onClick}
        type={type}
        className={classes}
        aria-label={ariaLabel}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
export type { IconButtonProps };
