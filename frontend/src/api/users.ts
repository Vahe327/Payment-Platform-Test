import { api } from "./client";
import type { Account, Payment, User } from "@/types/api";

export async function getMe(): Promise<User> {
  const { data } = await api.get<User>("/users/me");
  return data;
}

export async function getMyAccounts(): Promise<Account[]> {
  const { data } = await api.get<Account[]>("/users/me/accounts");
  return data;
}

export async function getMyPayments(): Promise<Payment[]> {
  const { data } = await api.get<Payment[]>("/users/me/payments");
  return data;
}
