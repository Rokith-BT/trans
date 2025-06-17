import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid Email provided').max(255),
  password: z.string().min(1, 'Password is required').max(255)
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid Email provided').max(255)
});

export const passwordFormSchema = z
  .object({
    password: z.string().min(1, 'Password is required').max(255),
    confirm: z.string().min(1, 'Confirm Password is required').max(255)
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords don't match",
    path: ['confirm'] // path of error
  });

export const aadharLoginSchema = z.object({
  mobileoremail: z.string().min(1, 'Mobile or Email is required').max(120)
});
