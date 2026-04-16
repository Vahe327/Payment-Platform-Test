import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search } from "lucide-react";
import { useAdminUsers, useCreateUser, useDeleteUser, useUpdateUser } from "@/hooks/useAdminUsers";
import { UsersTable } from "@/components/admin/UsersTable";
import { UserFormDialog } from "@/components/admin/UserFormDialog";
import { DeleteUserDialog } from "@/components/admin/DeleteUserDialog";
import { TableSkeleton } from "@/components/common/Skeleton";
import { ErrorState } from "@/components/common/ErrorState";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminUser } from "@/types/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export default function AdminUsers() {
  const { data: users, isLoading, error, refetch } = useAdminUsers();
  const createMutation = useCreateUser();
  const deleteMutation = useDeleteUser();
  const updateMutation = useUpdateUser();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [editTarget, setEditTarget] = useState<AdminUser | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-xl font-semibold text-foreground">Users Management</h1>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Create User
        </Button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {isLoading ? (
        <TableSkeleton rows={5} />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : !users?.length ? (
        <EmptyState message="No users yet" />
      ) : (
        <UsersTable
          users={users}
          search={search}
          onEdit={setEditTarget}
          onDelete={setDeleteTarget}
        />
      )}

      <UserFormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={(data) => {
          createMutation.mutate(data, { onSuccess: () => setCreateOpen(false) });
        }}
        loading={createMutation.isPending}
      />

      <DeleteUserDialog
        user={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
        loading={deleteMutation.isPending}
      />

      <EditUserDialog
        user={editTarget}
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSubmit={(data) => {
          if (editTarget) {
            updateMutation.mutate(
              { id: editTarget.id, ...data },
              { onSuccess: () => setEditTarget(null) },
            );
          }
        }}
        loading={updateMutation.isPending}
      />
    </motion.div>
  );
}

function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSubmit,
  loading,
}: {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (data: { email?: string; full_name?: string }) => void;
  loading?: boolean;
}) {
  const { register, handleSubmit, reset } = useForm({
    values: { email: user?.email ?? "", full_name: user?.full_name ?? "" },
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="e-email">Email</Label>
            <Input id="e-email" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="e-name">Full Name</Label>
            <Input id="e-name" {...register("full_name")} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
