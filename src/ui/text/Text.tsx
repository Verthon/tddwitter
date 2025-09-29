import type { ElementType, ReactNode } from 'react';

const weightClassMap = {
  bold: 'font-bold',
  'semi-bold': 'font-semibold',
  regular: 'font-normal',
} as const;

export type TextWeight = keyof typeof weightClassMap;

interface TextProps {
  children: ReactNode;
  weight?: TextWeight;
  as?: ElementType;
  className?: string;
}

export const Text = ({
  children,
  weight = 'regular',
  as: Component = 'span',
  className = '',
}: TextProps) => {
  const weightClass = weightClassMap[weight];
  return (
    <Component className={`${weightClass} ${className}`}>{children}</Component>
  );
};
