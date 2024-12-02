import * as z from "zod"
export const LoginSchema = z.object({
    email: z.string({
        // invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    password: z.string().min(1,{
        message: "Password is required"
    }).refine(value => !/\s/.test(value), {
        message: "Password cannot contain spaces",
    }),
})

export const RegisterSchema = z.object({
    email: z.string({
        // invalid_type_error: "Must be a string"
    }).email({
        message: "Email is required"
    }),
    password: z.string().min(6,{
        message: "Minimum 6 characters is required"
    }).refine(value => !/\s/.test(value), {
        message: "Password cannot contain spaces",
    }),
    name: z.string().min(1,{
        message: "Name is required"
    })

})