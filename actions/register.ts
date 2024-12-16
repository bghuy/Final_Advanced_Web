'use server'
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { authService } from "@/services/auth";
import { cookies } from 'next/headers';

type RegisterResponse = { success?: string; error?: string };

export const register = async(values: z.infer<typeof RegisterSchema>): Promise<RegisterResponse> => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    try {
        const { email, password, name: username } = validatedFields.data;
        const response = await authService.register({ username, email, password });
        
        // Store the access token in a cookie
        const cookieStore = await cookies();
        cookieStore.set('access_token', response.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return { success: "Registration successful!" };
    } catch (error: any) {
        if (error.response?.data?.message) {
            return { error: error.response.data.message };
        }
        return { error: "Something went wrong!" };
    }
}
