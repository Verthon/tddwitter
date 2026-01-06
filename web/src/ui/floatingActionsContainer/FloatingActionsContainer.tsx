import { type ReactNode } from 'react';

type FloatingActionsContainerProps = {
  children: ReactNode;
};

const FloatingActionsContainer = ({ children }: FloatingActionsContainerProps) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="relative h-full w-full">{children}</div>
    </div>
  );
};

type FloatingActionProps = {
  children: ReactNode;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  offset?: 'sm' | 'md' | 'lg';
};

const positionClasses = {
  'bottom-right': 'bottom-0 right-0 md:bottom-0 bottom-[40px]',
  'bottom-left': 'bottom-0 left-0 md:bottom-0 bottom-[40px]',
  'top-right': 'top-0 right-0',
  'top-left': 'top-0 left-0',
} as const;

const offsetClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

const FloatingAction = ({ children, position = 'bottom-right', offset = 'md' }: FloatingActionProps) => {
  const actionClasses = `absolute ${positionClasses[position]} ${offsetClasses[offset]} flex flex-col gap-3 pointer-events-auto md:hidden`;

  return <div className={actionClasses}>{children}</div>;
};

FloatingActionsContainer.displayName = 'FloatingActionsContainer';
FloatingAction.displayName = 'FloatingAction';

FloatingActionsContainer.Action = FloatingAction;

export { FloatingActionsContainer };
export type { FloatingActionsContainerProps, FloatingActionProps };
