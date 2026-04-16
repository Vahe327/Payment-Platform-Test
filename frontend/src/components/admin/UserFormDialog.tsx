import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, type CreateUserFormData } from "@/schemas/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { email: string; password: string; full_name: string }) => void;
  loading?: boolean;
}

export function UserFormDialog({ open, onOpenChange, onSubmit, loading }: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const handleClose = (val: boolean) => {
    if (!val) reset();
    onOpenChange(val);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((d) => {
            onSubmit({ email: d.email, password: d.password, full_name: d.full_name });
            reset();
          })}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="cf-email">Email</Label>
            <Input id="cf-email" {...register("email")} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cf-name">Full Name</Label>
            <Input id="cf-name" {...register("full_name")} />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cf-pass">Password</Label>
            <Input id="cf-pass" type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cf-confirm">Confirm Password</Label>
            <Input id="cf-confirm" type="password" {...register("confirm")} />
            {errors.confirm && <p className="text-xs text-red-500">{errors.confirm.message}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
