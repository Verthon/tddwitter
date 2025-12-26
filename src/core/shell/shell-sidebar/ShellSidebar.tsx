import { SignedIn } from "src/core/auth/components/SignedIn";
import { SignedOut } from "src/core/auth/components/SignedOut";
import { useTranslation } from "src/i18n/useTranslation";
import { Avatar } from "src/ui/avatar/Avatar";
import { Text } from "src/ui/text/Text";

import { SidebarLink } from "./SidebarLink";

export const ShellSidebar = () => {
  const { t } = useTranslation();

  return (
    <aside
      aria-label="Sidebar navigation"
      className="flex flex-col w-64 p-4 border-r border-r-gray-300 h-screen"
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
        <SidebarLink route="home">
          {t("core.nav.home")}
        </SidebarLink>
        <SignedIn>
          <SidebarLink route="createPost">
            {t("core.nav.createPost")}
          </SidebarLink>
        </SignedIn>
      </nav>

      <SignedOut>
        <div className="mt-auto flex flex-col gap-3">
          <SidebarLink route="login" variant="primary">
            {t("core.auth.sidebar.login")}
          </SidebarLink>
          <SidebarLink route="signup" variant="outline">
            {t("core.auth.sidebar.createAccount")}
          </SidebarLink>
        </div>
      </SignedOut>
    </aside>
  );
};
