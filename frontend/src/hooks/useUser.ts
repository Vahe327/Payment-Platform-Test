import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/users";
import { getAdminMe } from "@/api/admin";
import { useAuth } from "./useAuth";

export function useUser() {
  const { role } = useAuth();
  return useQuery({
    queryKey: ["me", role],
    queryFn: () => (role === "admin" ? getAdminMe() : getMe()),
    enabled: !!role,
  });
}
