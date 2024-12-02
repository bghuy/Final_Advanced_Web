// import {Poppins} from "next/font/google"
// import { AuthScreen } from "@/features/auth/components/auth-screen"
import { currentUser } from "@/lib/current-user"
import { redirect } from "next/navigation"
// const font = Poppins({
//   subsets: ["latin"],
//   weight: ['600']
// })
export default async function Home() {
  const user = await currentUser();
  if(user){
    return redirect("/setup")
  }else{
    return redirect("/auth/login")
  }
}
