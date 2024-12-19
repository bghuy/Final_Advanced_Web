'use server'
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { LoginFormResponse } from "@/types/auth/LoginFormResponse";
import { loginService } from "@/services/auth";
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken';
export const login = async(values: z.infer<typeof LoginSchema>): Promise<LoginFormResponse> => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return({ error: "Login failed!" });
    }
    try {
        if (validatedFields.success) {
            const res = await loginService(values)
            console.log(res,"res");
            
            if(!res?.access_token) {
                return({ error: "Login failed!" });
            }
            const decodedToken = jwt.decode(res.access_token) as jwt.JwtPayload;
            const expirationTime = decodedToken?.exp || Math.floor(Date.now() / 1000) + 3600; // 1 giờ
            console.log(decodedToken, "decodedToken");
            
            const cookieStore = await cookies();
            
            cookieStore.set("access_token", res.access_token, {
                path: "/",
                maxAge: expirationTime - Math.floor(Date.now() / 1000),
            });
            return({ success: "Login successfully!" });
        }
        else{
            return({ error: "Login failed!" });
        }
    } catch (error) {
        console.log(error, "error");
        throw error; 
    }
}