import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import type { AdminUser } from "@/types/api";

interface DeleteUserDialogProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteUserDialog({
  user,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: DeleteUserDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete User"
      description={`Are you sure you want to delete ${user?.email ?? "this user"}? This action cannot be undone. All accounts and payments will be removed.`}
      onConfirm={onConfirm}
      loading={loading}
    />
  );
}
