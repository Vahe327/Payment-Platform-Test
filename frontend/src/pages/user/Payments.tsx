import { useState } from "react";
import { motion } from "framer-motion";
import { usePayments } from "@/hooks/usePayments";
import { PaymentRow } from "@/components/user/PaymentRow";
import { TableSkeleton } from "@/components/common/Skeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Payments() {
  const { data: payments, isLoading, error, refetch } = usePayments();
  const [search, setSearch] = useState("");

  const filtered = payments?.filter((p) =>
    p.transaction_id.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-5xl"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-foreground">Payments</h1>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <Input
            placeholder="Search by transaction ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      {isLoading ? (
        <TableSkeleton rows={8} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !filtered?.length ? (
        <EmptyState message={search ? "No matching payments" : "No payments yet"} />
      ) : (
        <div className="rounded-xl border border-border bg-surface divide-y divide-border">
          {filtered.map((p) => <PaymentRow key={p.id} payment={p} />)}
        </div>
      )}
    </motion.div>
  );
}
