'use client';
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "../ui/button";
// import { useSearchParams } from "next/navigation"
export const Social = () =>{

    const signInOauth = async(provider: "google" | "github") => {
        if(provider === "google") {
            console.log(process.env.NEXT_PUBLIC_API_URL,"NEXT_PUBLIC_API_URL");
            
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/social/google/login` || `http://localhost:8080/api/v1/auth/social/google/login`;
        }
    }
    return(
        <div className="flex items-center w-full gap-x-2">
            <Button 
                size="lg"
                className="w-full"
                variant="outline"
                onClick={()=>{signInOauth('google')}}
            >
                <FcGoogle className="h-5 w-5"/>
            </Button>
            <Button 
                size="lg"
                className="w-full"
                variant="outline"
                disabled
                // onClick={()=>{signInOauth('github')}}
            >
                <FaGithub className="h-5 w-5"/>
            </Button>
        </div>
    )
}