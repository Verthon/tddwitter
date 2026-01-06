import { Bars3Icon, BugAntIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useLocale } from '../../../i18n/useLocale';
import { ShellSidebar } from '../shell-sidebar/ShellSidebar';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
}

const MobileDrawer = ({ open, onClose }: MobileDrawerProps) => (
  <div
    className={`fixed inset-0 z-50 flex transition-none ${
      open ? 'pointer-events-auto' : 'pointer-events-none'
    }`}
  >
    <div
      className={`flex-1 bg-black/30 transition-opacity duration-300 ${
        open ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={onClose}
    />
    <div
      className={`w-64 bg-white shadow-xl p-4 transform transition-transform duration-300 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <ShellSidebar />
    </div>
  </div>
);

export const ShellNav = () => {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="md:hidden flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <BugAntIcon className="h-6 w-6 text-gray-900" />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={t('core.toggleMenu')}
          className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 cursor-pointer"
        >
          <Bars3Icon className="h-6 w-6 text-gray-900" />
        </button>
      </header>
      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
