import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/schemas/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { loginUser, loginAdmin } from "@/api/auth";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface LoginFormProps {
  mode: "user" | "admin";
}

export function LoginForm({ mode }: LoginFormProps) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const fn = mode === "admin" ? loginAdmin : loginUser;
      const res = await fn(data.email, data.password);
      login(res.access_token, mode);
      navigate(mode === "admin" ? "/admin" : "/dashboard");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="email@example.com" {...register("email")} />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="Password" {...register("password")} />
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </Button>
    </motion.form>
  );
}
