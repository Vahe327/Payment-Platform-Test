import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight, Plus } from "lucide-react";
import { useAccounts, useCreateAccount } from "@/hooks/useAccounts";
import { AccountCard } from "@/components/user/AccountCard";
import { DepositDialog } from "@/components/user/DepositDialog";
import { WithdrawDialog } from "@/components/user/WithdrawDialog";
import { TransferDialog } from "@/components/user/TransferDialog";
import { CardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Button } from "@/components/ui/button";
import type { Account } from "@/types/api";

export default function Accounts() {
  const { data: accounts, isLoading, error, refetch } = useAccounts();
  const createAccount = useCreateAccount();
  const [depositTarget, setDepositTarget] = useState<Account | null>(null);
  const [withdrawTarget, setWithdrawTarget] = useState<Account | null>(null);
  const [transferOpen, setTransferOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-foreground">Accounts</h1>
        <div className="flex gap-2">
          <Button onClick={() => createAccount.mutate()} disabled={createAccount.isPending}>
            <Plus className="h-4 w-4 mr-2" /> New Account
          </Button>
          {accounts && accounts.length >= 2 && (
            <Button variant="outline" onClick={() => setTransferOpen(true)}>
              <ArrowLeftRight className="h-4 w-4 mr-2" /> Transfer
            </Button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
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

      <DepositDialog account={depositTarget} open={!!depositTarget} onOpenChange={(v) => !v && setDepositTarget(null)} />
      <WithdrawDialog account={withdrawTarget} open={!!withdrawTarget} onOpenChange={(v) => !v && setWithdrawTarget(null)} />
      {accounts && (
        <TransferDialog accounts={accounts} open={transferOpen} onOpenChange={setTransferOpen} />
      )}
    </motion.div>
  );
}
