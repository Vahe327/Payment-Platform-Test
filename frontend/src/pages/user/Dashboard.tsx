import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { useAccounts, useCreateAccount } from "@/hooks/useAccounts";
import { usePayments } from "@/hooks/usePayments";
import { BalanceCard } from "@/components/user/BalanceCard";
import { AccountCard } from "@/components/user/AccountCard";
import { PaymentRow } from "@/components/user/PaymentRow";
import { DepositDialog } from "@/components/user/DepositDialog";
import { WithdrawDialog } from "@/components/user/WithdrawDialog";
import { TransferDialog } from "@/components/user/TransferDialog";
import { CardSkeleton, TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import type { Account } from "@/types/api";

export default function Dashboard() {
  const { data: user } = useUser();
  const { data: accounts, isLoading: accLoading, error: accError, refetch: refetchAcc } = useAccounts();
  const { data: payments, isLoading: payLoading, error: payError, refetch: refetchPay } = usePayments();
  const createAccount = useCreateAccount();

  const [depositTarget, setDepositTarget] = useState<Account | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<Account | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);

  const totalBalance = accounts?.reduce((s, a) => s + parseFloat(a.balance), 0) ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 max-w-5xl"
    >
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        {user && <p className="text-sm text-muted mt-1">Welcome back, {user.full_name}</p>}
      </div>

      {accLoading ? <CardSkeleton /> : accError ? <ErrorState onRetry={refetchAcc} /> : <BalanceCard balance={totalBalance} />}

      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={() => createAccount.mutate()} disabled={createAccount.isPending}>
          <Plus className="h-4 w-4 mr-2" /> New Account
        </Button>
        {accounts && accounts.length >= 2 && (
          <Button variant="outline" onClick={() => setTransferOpen(true)}>
            <ArrowLeftRight className="h-4 w-4 mr-2" /> Transfer
          </Button>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Accounts</h2>
        {accLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : accError ? (
          <ErrorState onRetry={refetchAcc} />
        ) : !accounts?.length ? (
          <EmptyState message="No accounts yet — create one above" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((a) => (
              <AccountCard
                key={a.id}
                account={a}
                onDeposit={setDepositTarget}
                onWithdraw={setWithdrawTarget}
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Recent Payments</h2>
        {payLoading ? (
          <TableSkeleton rows={5} />
        ) : payError ? (
          <ErrorState onRetry={refetchPay} />
        ) : !payments?.length ? (
          <EmptyState message="No payments yet — deposit funds to get started" />
        ) : (
          <div className="rounded-xl border border-border bg-surface divide-y divide-border">
            {payments.slice(0, 5).map((p) => <PaymentRow key={p.id} payment={p} />)}
          </div>
        )}
      </div>

      <DepositDialog account={depositTarget} open={!!depositTarget} onOpenChange={(v) => !v && setDepositTarget(null)} />
      <WithdrawDialog account={withdrawTarget} open={!!withdrawTarget} onOpenChange={(v) => !v && setWithdrawTarget(null)} />
      {accounts && (
        <TransferDialog accounts={accounts} open={transferOpen} onOpenChange={setTransferOpen} />
      )}
    </motion.div>
  );
}
