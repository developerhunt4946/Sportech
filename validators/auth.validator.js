import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(4, "First Name must be 4 character long."),
  lastName: z.string().min(4, "Last Name must be 4 character long."),
  email: z.string().email("Invalid Email."),
  firstName: z.string().min(6, "Password must be of minimum 6 character long."),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid Email."),
  password: z.string().min(1, "Password is required."),
});
