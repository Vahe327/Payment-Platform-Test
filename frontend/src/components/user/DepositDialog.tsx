import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeposit } from "@/hooks/useAccounts";
import type { Account } from "@/types/api";
import { CURRENCY } from "@/lib/constants";

interface DepositDialogProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DepositDialog({ account, open, onOpenChange }: DepositDialogProps) {
  const [amount, setAmount] = useState("");
  const deposit = useDeposit();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !amount) return;
    deposit.mutate(
      { accountId: account.id, amount },
      {
        onSuccess: () => {
          setAmount("");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deposit to Account #{account?.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="dep-amount">Amount ({CURRENCY})</Label>
            <Input
              id="dep-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="100.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted">
            Current balance: {account?.balance} {CURRENCY}
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={deposit.isPending || !amount}>
              {deposit.isPending ? "Processing..." : "Deposit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
