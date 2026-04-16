import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useWithdraw } from "@/hooks/useAccounts";
import type { Account } from "@/types/api";
import { CURRENCY } from "@/lib/constants";

interface WithdrawDialogProps {
  account: Account | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WithdrawDialog({ account, open, onOpenChange }: WithdrawDialogProps) {
  const [amount, setAmount] = useState("");
  const withdraw = useWithdraw();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !amount) return;
    withdraw.mutate(
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
          <DialogTitle>Withdraw from Account #{account?.id}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="wd-amount">Amount ({CURRENCY})</Label>
            <Input
              id="wd-amount"
              type="number"
              step="0.01"
              min="0.01"
              max={account?.balance}
              placeholder="50.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <p className="text-xs text-muted">
            Available: {account?.balance} {CURRENCY}
          </p>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={withdraw.isPending || !amount}>
              {withdraw.isPending ? "Processing..." : "Withdraw"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
