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

export interface RegisterResponse {
  user: { id: number; email: string; full_name: string };
  access_token: string;
  token_type: string;
}

export async function registerUser(
  email: string,
  password: string,
  full_name: string,
): Promise<RegisterResponse> {
  const { data } = await api.post<RegisterResponse>("/auth/register", {
    email,
    password,
    full_name,
  });
  return data;
}
