import type { ReactNode } from 'react';

import { ShellNav } from './shell-nav/ShellNav';
import { MobileNav } from './mobile-nav/MobileNav';
import { ShellSidebar } from './shell-sidebar/ShellSidebar';

interface ShellProps {
  children: ReactNode;
}

export const Shell = ({ children }: ShellProps) => (
  <div className="min-h-screen flex flex-col md:flex-row">
    <div className="hidden md:block">
      <ShellSidebar />
    </div>
    <div className="flex-1 flex flex-col min-w-0">
      <ShellNav />
      <main className="flex-1 w-full">
        <div className="max-w-[600px] mx-auto px-4 md:px-0">{children}</div>
      </main>
      <MobileNav />
    </div>
  </div>
);
