import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/LoginForm";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { APP_NAME } from "@/lib/constants";

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{APP_NAME}</h1>
          <p className="text-sm text-muted mt-1">Sign in to your account</p>
        </div>
        <LoginForm mode="user" />
        <Link to="/admin/login" className="text-xs text-muted hover:text-accent transition-colors">
          Admin login
        </Link>
      </div>
    </div>
  );
}
