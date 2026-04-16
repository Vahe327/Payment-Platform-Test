import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTransfer } from "@/hooks/useAccounts";
import type { Account } from "@/types/api";
import { CURRENCY } from "@/lib/constants";

interface TransferDialogProps {
  accounts: Account[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransferDialog({ accounts, open, onOpenChange }: TransferDialogProps) {
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const transfer = useTransfer();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromId || !toId || !amount) return;
    transfer.mutate(
      { fromId: Number(fromId), toId: Number(toId), amount },
      {
        onSuccess: () => {
          setFromId("");
          setToId("");
          setAmount("");
          onOpenChange(false);
        },
      },
    );
  };

  const fromAccount = accounts.find((a) => a.id === Number(fromId));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Between Accounts</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="tf-from">From Account</Label>
            <select
              id="tf-from"
              value={fromId}
              onChange={(e) => setFromId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select account</option>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>
                  Account #{a.id} — {a.balance} {CURRENCY}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tf-to">To Account</Label>
            <select
              id="tf-to"
              value={toId}
              onChange={(e) => setToId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              <option value="">Select account</option>
              {accounts
                .filter((a) => a.id !== Number(fromId))
                .map((a) => (
                  <option key={a.id} value={a.id}>
                    Account #{a.id} — {a.balance} {CURRENCY}
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tf-amount">Amount ({CURRENCY})</Label>
            <Input
              id="tf-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="25.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {fromAccount && (
            <p className="text-xs text-muted">
              Available: {fromAccount.balance} {CURRENCY}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={transfer.isPending || !fromId || !toId || !amount}>
              {transfer.isPending ? "Transferring..." : "Transfer"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
