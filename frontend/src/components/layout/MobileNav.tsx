import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, ArrowLeftRight, UserCircle, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const userNav = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/payments", label: "Payments", icon: ArrowLeftRight },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

const adminNav = [
  { to: "/admin", label: "Home", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const { role } = useAuth();
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border bg-surface lg:hidden">
      {nav.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center gap-1 text-[10px] min-w-[44px] min-h-[44px] justify-center",
              isActive ? "text-accent" : "text-muted",
            )
          }
        >
          <item.icon className="h-5 w-5" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
