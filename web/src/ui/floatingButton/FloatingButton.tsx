import { Button as BaseButton } from '@base-ui/react/button';
import { type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';

type FloatingButtonOwnProps<Component extends ElementType> = {
  children: ReactNode;
  isDisabled?: boolean;
  variant?: 'default' | 'ghost';
  as?: Component;
};

type FloatingButtonProps<Component extends ElementType = 'button'> = FloatingButtonOwnProps<Component> &
  Omit<ComponentPropsWithoutRef<Component>, keyof FloatingButtonOwnProps<Component>>;

const baseClasses =
  'inline-flex items-center justify-center rounded-full w-14 h-14 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

const variantClasses = {
  default:
    'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700 focus-visible:ring-blue-500',
  ghost:
    'bg-white text-blue-500 hover:bg-gray-50 active:bg-gray-100 focus-visible:ring-blue-500',
} as const;

const disabledClasses =
  'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:shadow-md';

const FloatingButton = <Component extends ElementType = 'button'>({
  children,
  isDisabled = false,
  variant = 'default',
  as,
  ...props
}: FloatingButtonProps<Component>) => {
  const Element = (as ?? BaseButton) as ElementType;
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${disabledClasses}`.trim();

  return (
    <Element disabled={isDisabled} className={buttonClasses} {...props}>
      {children}
    </Element>
  );
};

FloatingButton.displayName = 'FloatingButton';

export { FloatingButton };
export type { FloatingButtonProps };
