import { LogOut, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { APP_NAME } from "@/lib/constants";

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { logout, role } = useAuth();
  const { data: user } = useUser();

  const homeLink = role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-surface/80 backdrop-blur-md px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="sm"
          className="lg:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Link to={homeLink} className="text-lg font-semibold text-foreground tracking-tight">
          {APP_NAME}
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && (
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center h-8 w-8 rounded-full bg-accent/20 text-accent text-xs font-bold">
              {user.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <span className="hidden md:block text-sm text-muted">{user.email}</span>
          </div>
        )}
        <Button variant="ghost" size="sm" onClick={logout} aria-label="Logout">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
