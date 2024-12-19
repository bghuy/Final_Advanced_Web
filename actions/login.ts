'use server'
import * as z from "zod"
import { LoginSchema } from "@/schemas";
import { LoginFormResponse } from "@/types/auth/LoginFormResponse";
import { loginService } from "@/services/auth";
import { cookies } from 'next/headers'
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
                throw new Error("Login failed!");
            }
            const cookieStore = await cookies();
            cookieStore.set("access_token", res.access_token, {
                path: "/",
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