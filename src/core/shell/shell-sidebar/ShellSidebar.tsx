import React from 'react';
import { NavLink } from 'react-router';

import { useTranslation } from '../../../i18n/useTranslation';
import { Avatar } from '../../../ui/avatar/Avatar';
import { Text } from '../../../ui/text/Text';

export const ShellSidebar = () => {
  const { t } = useTranslation();

  return (
    <aside
      role="complementary"
      aria-label="Sidebar navigation"
      className="flex flex-col w-64 p-4 border-r h-screen"
    >
      <header role="banner" className="flex items-center gap-3 mb-6">
        <Avatar src="https://via.placeholder.com/32" alt="John Doe avatar" />
        <Text weight="bold">John Doe</Text>
      </header>
      <nav role="navigation" aria-label="Primary" className="flex flex-col gap-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isActive ? 'font-bold text-blue-600' : 'text-gray-800'
            }`
          }
        >
          {t('core.nav.home')}
        </NavLink>
      </nav>
    </aside>
  );
};