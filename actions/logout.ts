"use server"
// import { signOut } from "@/auth";
// import { redirect } from "next/navigation";
export const logOut = async()=>{
    try {
        // await signOut();
    } catch (error) {
        console.log(error,"error");
    }
}