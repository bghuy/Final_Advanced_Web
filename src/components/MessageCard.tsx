'use client'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import PlannerIllustration from "./PlannerIllustration"
import { motion } from "framer-motion"

interface MessageCardProps {
  message: string
  status: "success" | "error"
}

export default function MessageCard({ message, status }: MessageCardProps) {
  const bgColor = status === "success" ? "bg-green-50" : "bg-red-50"
  const textColor = status === "success" ? "text-green-700" : "text-red-700"
  const borderColor = status === "success" ? "border-green-200" : "border-red-200"
  const gradientFrom = status === "success" ? "from-green-400" : "from-red-400"
  const gradientTo = status === "success" ? "to-blue-500" : "to-pink-500"

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className={`w-full max-w-md ${bgColor} ${borderColor} border-2 overflow-hidden`}>
        <div className={`h-2 bg-gradient-to-r ${gradientFrom} ${gradientTo}`} />
        <CardContent className="pt-6 flex flex-col items-center">
          <PlannerIllustration status={status} />
          {/* <h2 className={`text-2xl font-bold mb-4 ${textColor} mt-4`}>
            {status === "success" ? "Plan Created Successfully!" : "Oops! Planning Error"}
          </h2>
          <p className={`${textColor} text-center`}>{message}</p> */}
          <h2 className={`text-2xl font-bold mb-4 ${textColor} mt-4`}>
            {message}
          </h2>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Link href="/" passHref>
            <Button className="bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600 transition duration-300">
              Back to Planner
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  )
}

