import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  ArrowLeftRight,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const userNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/accounts", label: "Accounts", icon: Wallet },
  { to: "/payments", label: "Payments", icon: ArrowLeftRight },
  { to: "/profile", label: "Profile", icon: UserCircle },
];

const adminNav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/profile", label: "Profile", icon: UserCircle },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { role } = useAuth();
  const nav = role === "admin" ? adminNav : userNav;

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          "fixed left-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-60 border-r border-border bg-surface transition-transform duration-200",
          "lg:translate-x-0 lg:static",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-end p-2 lg:hidden">
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close menu">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors min-h-[44px]",
                  isActive
                    ? "bg-accent/10 text-accent"
                    : "text-muted hover:bg-surface hover:text-foreground",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
