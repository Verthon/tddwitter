import { NavLink } from "react-router";

import { useTranslation } from "src/i18n/useTranslation";
import { Avatar } from "src/ui/avatar/Avatar";
import { Text } from "src/ui/text/Text";

export const ShellSidebar = () => {
  const { t } = useTranslation();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex flex-col w-64 p-4 border-r h-screen"
    >
      <header className="flex items-center gap-3 mb-6">
        <Avatar alt="John Doe avatar" />
        <Text weight="bold">John Doe</Text>
      </header>
      <nav
        aria-label="Primary"
        className="flex flex-col gap-2"
      >
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `px-3 py-2 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
              isActive ? "font-bold text-blue-600" : "text-gray-800"
            }`
          }
        >
          {t("core.nav.home")}
        </NavLink>
      </nav>
    </aside>
  );
};
