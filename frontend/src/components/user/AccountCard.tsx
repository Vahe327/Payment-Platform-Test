import { motion } from "framer-motion";
import { Wallet } from "lucide-react";
import { formatBalance } from "@/lib/format";
import { CURRENCY } from "@/lib/constants";
import type { Account } from "@/types/api";

export function AccountCard({ account }: { account: Account }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="rounded-xl border border-border bg-surface p-5 hover:shadow-lg hover:shadow-accent/5 transition-shadow cursor-default"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-accent/10">
          <Wallet className="h-4 w-4 text-accent" />
        </div>
        <span className="text-sm text-muted">Account #{account.id}</span>
      </div>
      <p className="text-xl font-bold font-mono text-foreground">
        {formatBalance(account.balance)} <span className="text-sm text-muted">{CURRENCY}</span>
      </p>
    </motion.div>
  );
}
