import { motion } from "framer-motion";
import { useUser } from "@/hooks/useUser";
import { CardSkeleton } from "@/components/common/Skeleton";

export default function AdminProfile() {
  const { data: user, isLoading } = useUser();

  if (isLoading) return <CardSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-lg"
    >
      <h1 className="text-xl font-semibold text-foreground mb-6">Admin Profile</h1>
      <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <div>
          <p className="text-sm text-muted">ID</p>
          <p className="font-mono text-foreground">{user?.id}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Email</p>
          <p className="text-foreground">{user?.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted">Full Name</p>
          <p className="text-foreground">{user?.full_name}</p>
        </div>
      </div>
    </motion.div>
  );
}
