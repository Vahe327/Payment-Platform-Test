import { api } from "./client";
import type { TokenResponse } from "@/types/api";

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/auth/login", { email, password });
  return data;
}

export async function loginAdmin(email: string, password: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>("/admin/auth/login", { email, password });
  return data;
}
