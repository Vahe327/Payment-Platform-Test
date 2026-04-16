import { motion } from "framer-motion";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { MetricsGrid } from "@/components/admin/MetricsGrid";
import { UsersTable } from "@/components/admin/UsersTable";
import { CardSkeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";

export default function AdminDashboard() {
  const { data: users, isLoading, error, refetch } = useAdminUsers();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h1 className="text-xl font-semibold text-foreground">Admin Dashboard</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : users ? (
        <>
          <MetricsGrid users={users} />
          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">Users</h2>
            {users.length === 0 ? (
              <EmptyState message="No users yet" />
            ) : (
              <UsersTable
                users={users}
                search=""
                onEdit={() => {}}
                onDelete={() => {}}
              />
            )}
          </div>
        </>
      ) : null}
    </motion.div>
  );
}
