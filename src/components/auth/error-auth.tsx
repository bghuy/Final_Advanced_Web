// import { Header } from "./header";
// import { BackButton } from "./back-button";
// import {
//     Card,
//     CardFooter,
//     CardHeader
// } from "@/components/ui/card"
import { CardWrapper } from "./card-wrapper";
import { FaExclamationTriangle } from "react-icons/fa";

export const ErrorCard = () =>{
    return(
        <CardWrapper
            headerLabel="Oops! Something went wrong!"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="w-full items-center flex justify-center">
                <FaExclamationTriangle className="text-destructive"/>
            </div>
        </CardWrapper>
    )
}