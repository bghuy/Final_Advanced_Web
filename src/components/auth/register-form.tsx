'use client'
import { CardWrapper } from "./card-wrapper"
import { RegisterSchema } from "@/schemas"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { useState, useTransition } from "react"
import { register } from "../../../actions/register"
import { useRouter } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes"
// import { useSearchParams } from "next/navigation"
export const RegisterForm = () =>{
    const [isPending,startTransition] = useTransition();
    const [error,setError] = useState<string | undefined>("");
    const [success,setSuccess] = useState<string | undefined>("")
    const router = useRouter();
    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            username: ""
        },
    });
    const submitForm = async (values: z.infer<typeof RegisterSchema>) => {
        setError(undefined);
        setSuccess(undefined);
        startTransition(async () => {
            try {
                const data = await register(values);
                if (data.error) {
                    setError(data.error);
                } else {
                    setSuccess(data.success);
                    router.push(DEFAULT_LOGIN_REDIRECT);
                }
            } catch (err) {
                console.log(err);
                setError("An error occurred. Please try again later.");
            }
        });
    };
    const backButtonHref = `/auth/login`;
    return (
        <CardWrapper
            headerLabel="Create an account"
            backButtonLabel="Already have an account"
            backButtonHref={backButtonHref}
            showSocial
        >
            <Form {...form}>
                <form 
                    action="" 
                    onSubmit={form.handleSubmit((values)=>{submitForm(values)})}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>UserName</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john doe"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="john.doe@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field})=>(
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="******"
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <Button 
                        className="w-full"
                        type="submit"
                        disabled={isPending}
                    >
                        Create an account
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}