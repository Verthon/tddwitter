import { NavLink } from 'react-router';
import { HomeIcon as HomeOutline } from '@heroicons/react/24/outline';
import { HomeIcon as HomeSolid } from '@heroicons/react/24/solid';
import { type ElementType } from 'react';

const iconSize = 24;

export const MobileNav = () => {
  return (
    <nav
      aria-label="Primary mobile"
      className="fixed bottom-0 left-0 right-0 h-14 border-t border-gray-300 bg-white flex items-center justify-around md:hidden"
    >
      <NavLink
        to="/"
        end
        aria-label="Home"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
            isActive ? 'text-blue-600' : 'text-gray-800'
          }`
        }
      >
        {({ isActive }: { isActive: boolean }) => {
          const Icon: ElementType = isActive ? HomeSolid : HomeOutline;
          return <Icon width={iconSize} height={iconSize} />;
        }}
      </NavLink>
    </nav>
  );
};