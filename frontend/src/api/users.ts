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

export async function createMyAccount(): Promise<Account> {
  const { data } = await api.post<Account>("/users/me/accounts");
  return data;
}

export interface TransactionResult {
  status: string;
  transaction_id: string;
  account_id: number;
  amount: string;
  balance: string;
}

export interface TransferResult {
  status: string;
  from_account: { id: number; balance: string };
  to_account: { id: number; balance: string };
  amount: string;
}

export async function depositToAccount(accountId: number, amount: string): Promise<TransactionResult> {
  const { data } = await api.post<TransactionResult>(`/users/me/accounts/${accountId}/deposit`, { amount: Number(amount) });
  return data;
}

export async function withdrawFromAccount(accountId: number, amount: string): Promise<TransactionResult> {
  const { data } = await api.post<TransactionResult>(`/users/me/accounts/${accountId}/withdraw`, { amount: Number(amount) });
  return data;
}

export async function transferBetweenAccounts(fromId: number, toId: number, amount: string): Promise<TransferResult> {
  const { data } = await api.post<TransferResult>("/users/me/transfers", {
    from_account_id: fromId,
    to_account_id: toId,
    amount: Number(amount),
  });
  return data;
}
