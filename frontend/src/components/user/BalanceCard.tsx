import { AnimatedCounter } from "./AnimatedCounter";
import { CURRENCY } from "@/lib/constants";
import { motion } from "framer-motion";

export function BalanceCard({ balance }: { balance: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-border bg-surface p-6"
    >
      <p className="text-sm text-muted mb-1">Total Balance</p>
      <p className="text-3xl font-bold font-mono text-foreground">
        <AnimatedCounter value={balance} /> <span className="text-lg text-muted">{CURRENCY}</span>
      </p>
    </motion.div>
  );
}
