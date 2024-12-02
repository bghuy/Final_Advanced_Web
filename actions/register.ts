'use server'
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
// import bcrypt from "bcryptjs";
// import { db } from "@/lib/db";
// import { getUserByEmail } from "@/data/user";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";


type RegisterResponse = { success?: string; error?: string };

export const register = async(values: z.infer<typeof RegisterSchema>): Promise<RegisterResponse> => {

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Register failed!" };
    }

    // const { email, password, name } = validatedFields.data;

    try {
        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the user already exists
        // const existingUser = await getUserByEmail(email);

        // if (existingUser) {
        //     return { error: "Email already in use!" };
        // }

        // Create a new user
        // await db.user.create({
        //     data: {
        //         name,
        //         email,
        //         password: hashedPassword
        //     }
        // });

        // TODO: Send verification token email
        // const verificationToken = await generateVerificationToken(email);
        // await sendVerificationEmail(verificationToken.email, verificationToken.token)
        return { success: "Confirmation email sent!" };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: "Register failed!" };
    }
};
