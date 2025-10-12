import { NavLink, useNavigate } from "react-router";

import { SignedIn } from "src/core/auth/components/SignedIn";
import { SignedOut } from "src/core/auth/components/SignedOut";
import { useTranslation } from "src/i18n/useTranslation";
import { Avatar } from "src/ui/avatar/Avatar";
import { Button } from "src/ui/Button/Button";
import { Text } from "src/ui/text/Text";

import { routesConfig } from "../../../routing/routesConfig";

export const ShellSidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate(routesConfig.login);
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex flex-col w-64 p-4 border-r h-screen"
    >
      <header className="flex items-center gap-3 mb-6">
        <SignedIn>
          <Avatar alt="John Doe avatar" />
          <Text weight="bold">John Doe</Text>
        </SignedIn>
        <SignedOut>
          <Text weight="bold" size="xl">
            {t("core.title")}
          </Text>
        </SignedOut>
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

      <SignedOut>
        <div className="mt-auto flex flex-col gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleLoginClick}
            fullWidth
          >
            {t("core.auth.sidebar.login")}
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={handleSignupClick}
            fullWidth
          >
            {t("core.auth.sidebar.createAccount")}
          </Button>
        </div>
      </SignedOut>
    </aside>
  );
};
