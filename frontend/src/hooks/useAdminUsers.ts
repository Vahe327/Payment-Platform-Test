import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUser, deleteUser, getAdminUsers, updateUser } from "@/api/admin";
import { toast } from "sonner";

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: getAdminUsers,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User created");
    },
    onError: () => toast.error("Failed to create user"),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...payload }: { id: number; email?: string; full_name?: string }) =>
      updateUser(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User updated");
    },
    onError: () => toast.error("Failed to update user"),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });
}
