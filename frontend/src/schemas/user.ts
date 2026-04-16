import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z.string().email("Invalid email"),
    full_name: z.string().min(1, "Name is required"),
    password: z.string().min(6, "Min 6 characters"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  full_name: z.string().min(1).optional(),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
