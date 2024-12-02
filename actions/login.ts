'use server'
import * as z from "zod"
import { LoginSchema } from "@/schemas";
// import { signIn } from "@/auth";
// import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
// import { AuthError } from "next-auth";
// import { getUserByEmail } from "@/data/user";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";
type LoginResponse = { success?: string; error?: string };
export const login = async(values: z.infer<typeof LoginSchema>): Promise<LoginResponse> => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return({ error: "Login failed!" });
    }
    // const {email , password } = validatedFields.data;
    // const existingUser = await getUserByEmail(email);
    // if(!existingUser || !existingUser?.email || !existingUser.password){
    //     return { error: "Email does not exist!"}
    // }
    // if(!existingUser.emailVerified){
    //     const verificationToken = await generateVerificationToken(existingUser.email);
    //     await sendVerificationEmail(verificationToken.email,verificationToken.token);
    //     return {success: "Confirmation email sent!"}
    // }
    try {
        if (validatedFields.success) {
            // await signIn("credentials",{
            //     email,
            //     password,
            //     // redirectTo: DEFAULT_LOGIN_REDIRECT,
            //     redirect: false
            // })
            return({ success: "Login successfully!" });
        }
        else{
            return({ error: "Login failed!" });
        }
    } catch (error) {
        console.log(error, "error");
        // if(error instanceof AuthError){
        //     switch (error.type) {
        //         case "CredentialsSignin":
        //             return { error: "Invalid credentials!"}
        //         default:
        //             return { error: "Something went wrong!"}
        //     }
        // }
        throw error; 
    }
}