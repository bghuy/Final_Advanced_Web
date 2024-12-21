'use client'
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import { registerService } from "@/services/auth";
import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { AxiosError } from "axios";
type RegisterResponse = { success?: string; error?: string };

export const register = async(values: z.infer<typeof RegisterSchema>): Promise<RegisterResponse> => {

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Register failed!" };
    }
    try {
        const res = await registerService(values)
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
        return { success: "Register successful!" };
    } catch (error) {
        if (error instanceof AxiosError) {
            console.log("Register failed!", error);
            return { error: error.response?.data?.message || "Register failed!" };
        }

        console.log("Unexpected error!", error);
        return { error: "An unexpected error occurred!" };
    }
};