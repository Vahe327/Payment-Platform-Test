import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { APP_NAME } from "@/lib/constants";
import { Shield } from "lucide-react";

export default function AdminLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="h-6 w-6 text-accent" />
            <h1 className="text-2xl font-bold text-foreground">{APP_NAME}</h1>
          </div>
          <p className="text-sm text-muted">Admin Panel</p>
        </div>
        <LoginForm mode="admin" />
        <Link to="/login" className="text-xs text-muted hover:text-accent transition-colors">
          User login
        </Link>
      </div>
    </div>
  );
}
