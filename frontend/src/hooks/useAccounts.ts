import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMyAccount,
  depositToAccount,
  getMyAccounts,
  transferBetweenAccounts,
  withdrawFromAccount,
} from "@/api/users";
import { toast } from "sonner";

export function useAccounts() {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getMyAccounts,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createMyAccount,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      toast.success("Account created");
    },
    onError: () => toast.error("Failed to create account"),
  });
}

export function useDeposit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, amount }: { accountId: number; amount: string }) =>
      depositToAccount(accountId, amount),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`Deposited! New balance: ${data.balance} USDT`);
    },
    onError: () => toast.error("Deposit failed"),
  });
}

export function useWithdraw() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ accountId, amount }: { accountId: number; amount: string }) =>
      withdrawFromAccount(accountId, amount),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success(`Withdrawn! New balance: ${data.balance} USDT`);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Withdraw failed";
      toast.error(msg);
    },
  });
}

export function useTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ fromId, toId, amount }: { fromId: number; toId: number; amount: string }) =>
      transferBetweenAccounts(fromId, toId, amount),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["accounts"] });
      qc.invalidateQueries({ queryKey: ["payments"] });
      toast.success("Transfer completed!");
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message || "Transfer failed";
      toast.error(msg);
    },
  });
}
