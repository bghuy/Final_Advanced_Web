'use server'
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { authService } from "@/services/auth";
import { cookies } from 'next/headers';

export const login = async(values: z.infer<typeof LoginSchema>) => {
    try {
        const validatedFields = LoginSchema.safeParse(values);
        
        if (!validatedFields.success) {
            return { error: "Invalid fields" };
        }

        const { email, password } = validatedFields.data;
        const response = await authService.login({ email, password });
        
        // Set the cookie
        const cookieStore = await cookies();
        cookieStore.set('access_token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return { success: "Login successful!" };
    } catch (error: any) {
        console.error('Login error:', error);
        return { 
            error: error.response?.data?.message || "Something went wrong!" 
        };
    }
}