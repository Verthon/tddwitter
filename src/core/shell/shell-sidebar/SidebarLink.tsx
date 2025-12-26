import { NavLink } from "react-router";

import { routesConfig } from "src/routing/routesConfig";

type Route = keyof typeof routesConfig;

type Variant = "default" | "primary" | "outline";

type SidebarLinkProps = {
  route: Route;
  children: React.ReactNode;
  variant?: Variant;
};

const variantStyles: Record<Variant, { base: string; active: string }> = {
  default: {
    base: "px-3 py-2 rounded hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 text-gray-800",
    active: "font-bold text-blue-600",
  },
  primary: {
    base: "px-4 py-2 rounded bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    active: "",
  },
  outline: {
    base: "px-4 py-2 rounded border border-gray-300 text-gray-800 font-semibold text-center hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    active: "",
  },
};

export const SidebarLink = ({ route, children, variant = "default" }: SidebarLinkProps) => {
  const styles = variantStyles[variant];

  return (
    <NavLink
      to={routesConfig[route]}
      end
      className={({ isActive }) =>
        variant === "default" && isActive
          ? `${styles.base} ${styles.active}`
          : styles.base
      }
    >
      {children}
    </NavLink>
  );
};
