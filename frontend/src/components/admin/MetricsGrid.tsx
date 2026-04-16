import { motion } from "framer-motion";
import { Users, Wallet, DollarSign } from "lucide-react";
import { AnimatedCounter } from "@/components/user/AnimatedCounter";
import { CURRENCY } from "@/lib/constants";
import type { AdminUser } from "@/types/api";

export function MetricsGrid({ users }: { users: AdminUser[] }) {
  const totalUsers = users.length;
  const totalAccounts = users.reduce((sum, u) => sum + u.accounts.length, 0);
  const totalBalance = users.reduce(
    (sum, u) => sum + u.accounts.reduce((s, a) => s + parseFloat(a.balance), 0),
    0,
  );

  const metrics = [
    { label: "Total Users", value: totalUsers, icon: Users, suffix: "" },
    { label: "Total Accounts", value: totalAccounts, icon: Wallet, suffix: "" },
    { label: "Total Balance", value: totalBalance, icon: DollarSign, suffix: ` ${CURRENCY}` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          className="rounded-xl border border-border bg-surface p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <m.icon className="h-4 w-4 text-muted" />
            <span className="text-sm text-muted">{m.label}</span>
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">
            <AnimatedCounter value={m.value} />
            {m.suffix && <span className="text-sm text-muted">{m.suffix}</span>}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
