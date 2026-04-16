import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { getAdminUser } from "@/api/admin";
import { AccountCard } from "@/components/user/AccountCard";
import { PaymentRow } from "@/components/user/PaymentRow";
import { CardSkeleton, TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export default function UserDetail() {
  const { id } = useParams<{ id: string }>();
  const userId = Number(id);

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-user", userId],
    queryFn: () => getAdminUser(userId),
    enabled: !isNaN(userId),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CardSkeleton />
        <TableSkeleton rows={3} />
      </div>
    );
  }

  if (error) return <ErrorState onRetry={refetch} />;

  if (!user) return <EmptyState message="User not found" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-2 text-sm text-muted">
        <Link to="/admin/users" className="flex items-center gap-1 hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" /> Users
        </Link>
        <span>/</span>
        <span className="text-foreground">{user.email}</span>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6">
        <h1 className="text-xl font-semibold text-foreground">{user.full_name}</h1>
        <p className="text-sm text-muted">{user.email}</p>
        <p className="text-xs text-muted mt-1">ID: {user.id}</p>
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Accounts</h2>
        {user.accounts.length === 0 ? (
          <EmptyState message="No accounts" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {user.accounts.map((a) => <AccountCard key={a.id} account={a} />)}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-lg font-medium text-foreground mb-3">Payments</h2>
        {user.payments.length === 0 ? (
          <EmptyState message="No payments" />
        ) : (
          <div className="rounded-xl border border-border bg-surface divide-y divide-border">
            {user.payments.map((p) => <PaymentRow key={p.id} payment={p} />)}
          </div>
        )}
      </div>
    </motion.div>
  );
}
