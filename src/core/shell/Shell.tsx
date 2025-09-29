import type { ReactNode } from 'react';

import { ShellNav } from './shell-nav/ShellNav';
import { MobileNav } from './mobile-nav/MobileNav';

interface ShellProps {
  children: ReactNode;
}

export const Shell = ({ children }: ShellProps) => (
  <div className="min-h-screen flex flex-col">
    <ShellNav />
    <main className="flex-1">{children}</main>
    <MobileNav />
  </div>
);
