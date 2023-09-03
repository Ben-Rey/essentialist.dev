import { z } from "zod";

export const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

export const editUserSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export const getUserSchema = z.object({
  email: z.string().email(),
});
