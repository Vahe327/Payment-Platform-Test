import { motion } from "framer-motion";
import { useAccounts } from "@/hooks/useAccounts";
import { AccountCard } from "@/components/user/AccountCard";
import { CardSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function Accounts() {
  const { data: accounts, isLoading, error, refetch } = useAccounts();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <h1 className="text-xl font-semibold text-foreground">Accounts</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !accounts?.length ? (
        <EmptyState message="No accounts yet" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((a) => <AccountCard key={a.id} account={a} />)}
        </div>
      )}
    </motion.div>
  );
}
