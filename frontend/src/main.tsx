import { StrictMode, useState, useCallback, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { AuthContext } from "@/hooks/useAuth";
import App from "./App";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import "./styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("access_token"));
  const [role, setRole] = useState<string | null>(() => localStorage.getItem("role"));

  const login = useCallback((newToken: string, newRole: string) => {
    localStorage.setItem("access_token", newToken);
    localStorage.setItem("role", newRole);
    setToken(newToken);
    setRole(newRole);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    queryClient.clear();
    window.location.href = "/login";
  }, []);

  const value = useMemo(
    () => ({ token, role, login, logout, isAuthenticated: !!token }),
    [token, role, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!bg-surface !text-foreground !border-border",
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
);
