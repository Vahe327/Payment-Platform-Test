import { motion } from "framer-motion";
import { ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";
import { formatBalance } from "@/lib/format";
import { CURRENCY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import type { Account } from "@/types/api";

interface AccountCardProps {
  account: Account;
  onDeposit?: (account: Account) => void;
  onWithdraw?: (account: Account) => void;
}

export function AccountCard({ account, onDeposit, onWithdraw }: AccountCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-border bg-surface p-5 hover:shadow-lg hover:shadow-accent/5 transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-accent/10">
          <Wallet className="h-4 w-4 text-accent" />
        </div>
        <span className="text-sm text-muted">Account #{account.id}</span>
      </div>
      <p className="text-xl font-bold font-mono text-foreground mb-4">
        {formatBalance(account.balance)} <span className="text-sm text-muted">{CURRENCY}</span>
      </p>
      {(onDeposit || onWithdraw) && (
        <div className="flex gap-2">
          {onDeposit && (
            <Button variant="outline" size="sm" onClick={() => onDeposit(account)} className="flex-1">
              <ArrowDownToLine className="h-3.5 w-3.5 mr-1.5" /> Deposit
            </Button>
          )}
          {onWithdraw && (
            <Button variant="outline" size="sm" onClick={() => onWithdraw(account)} className="flex-1">
              <ArrowUpFromLine className="h-3.5 w-3.5 mr-1.5" /> Withdraw
            </Button>
          )}
        </div>
      )}
    </motion.div>
  );
}
