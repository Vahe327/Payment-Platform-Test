import { api } from "./client";
import type { AdminUser, AdminUserDetail, User } from "@/types/api";

export async function getAdminMe(): Promise<User> {
  const { data } = await api.get<User>("/admin/me");
  return data;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const { data } = await api.get<AdminUser[]>("/admin/users");
  return data;
}

export async function getAdminUser(id: number): Promise<AdminUserDetail> {
  const { data } = await api.get<AdminUserDetail>(`/admin/users/${id}`);
  return data;
}

export async function createUser(payload: {
  email: string;
  password: string;
  full_name: string;
}): Promise<User> {
  const { data } = await api.post<User>("/admin/users", payload);
  return data;
}

export async function updateUser(
  id: number,
  payload: { email?: string; password?: string; full_name?: string },
): Promise<User> {
  const { data } = await api.patch<User>(`/admin/users/${id}`, payload);
  return data;
}

export async function deleteUser(id: number): Promise<void> {
  await api.delete(`/admin/users/${id}`);
}
