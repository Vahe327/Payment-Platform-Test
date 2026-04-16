import { Navigate, Outlet } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function ProtectedRoute({ requiredRole }: { requiredRole: string }) {
  const { isAuthenticated, role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role !== requiredRole) {
    return <Navigate to={role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuToggle={() => setSidebarOpen((o) => !o)} />
      <div className="flex">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
