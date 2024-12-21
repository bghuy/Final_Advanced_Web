'use client'
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { LoginFormResponse } from "@/types/auth/LoginFormResponse";
import { loginService } from "@/services/auth";
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';

export const login = async(values: z.infer<typeof LoginSchema>): Promise<LoginFormResponse> => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return({ error: "Invalid input data" });
    }
    try {
        const res = await loginService(values)
        if(!res?.access_token) {
            return({ error: "Login failed. Please check your credentials." });
        }
        const decodedToken = jwt.decode(res.access_token) as jwt.JwtPayload;
        const expirationTime = decodedToken?.exp || Math.floor(Date.now() / 1000) + 3600; // 1 hour
        
        // Calculate expiration in days for js-cookie
        const expirationInDays = (expirationTime - Math.floor(Date.now() / 1000)) / (60 * 60 * 24);
        
        Cookies.set("access_token", res.access_token, {
            path: "/",
            expires: expirationInDays,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            sameSite: 'strict'
        });
        return({ success: "Login successful!" });
    } catch (error) {
        return({ error: "An unexpected error occurred. Please try again." });
    }
}