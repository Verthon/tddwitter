import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

const variantClassMap = {
  'heading-xs': 'text-lg font-bold',
  'heading-sm': 'text-xl font-bold',
  'heading-md': 'text-2xl font-bold',
  'heading-lg': 'text-3xl font-bold',
  'heading-xl': 'text-4xl font-bold',
} as const;

export type HeadingVariant = keyof typeof variantClassMap;

type HeadingOwnProps<E extends ElementType> = {
  children: ReactNode;
  variant?: HeadingVariant;
  as: E;
};

type HeadingProps<E extends ElementType> = HeadingOwnProps<E> &
  Omit<ComponentPropsWithoutRef<E>, keyof HeadingOwnProps<E>>;

export const Heading = <E extends ElementType = 'h2'>({
  children,
  variant = 'heading-md',
  as,
  ...props
}: HeadingProps<E>) => {
  const Component = as;
  const variantClass = variantClassMap[variant];
  const componentProps = props as ComponentPropsWithoutRef<E>;

  return (
    <Component className={variantClass} {...componentProps}>
      {children}
    </Component>
  );
};
