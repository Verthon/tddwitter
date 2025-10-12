import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

const weightClassMap = {
  bold: 'font-bold',
  'semi-bold': 'font-semibold',
  regular: 'font-normal',
} as const;

const sizeClassMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
} as const;

const colorClassMap = {
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  tertiary: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600',
} as const;

export type TextWeight = keyof typeof weightClassMap;
export type TextSize = keyof typeof sizeClassMap;
export type TextColor = keyof typeof colorClassMap;

type TextOwnProps<E extends ElementType = ElementType> = {
  children: ReactNode;
  weight?: TextWeight;
  size?: TextSize;
  color?: TextColor;
  as?: E;
};

type TextProps<E extends ElementType> = TextOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof TextOwnProps>;

export const Text = <E extends ElementType = 'span'>({
  children,
  weight = 'regular',
  size = 'base',
  color = 'primary',
  as,
  ...props
}: TextProps<E>) => {
  const Component = as || 'span';
  const weightClass = weightClassMap[weight];
  const sizeClass = sizeClassMap[size];
  const colorClass = colorClassMap[color];
  return (
    <Component className={`${weightClass} ${sizeClass} ${colorClass}`} {...props}>
      {children}
    </Component>
  );
};
