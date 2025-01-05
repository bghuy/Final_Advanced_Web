'use client'
import { motion } from "framer-motion"

interface PlannerIllustrationProps {
  status: "success" | "error"
}

export default function PlannerIllustration({ status }: PlannerIllustrationProps) {
  const color = status === "success" ? "#10B981" : "#EF4444"

  return (
    <motion.svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.circle
        cx="100"
        cy="100"
        r="80"
        fill="none"
        stroke={color}
        strokeWidth="4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {status === "success" ? (
        <motion.path
          d="M70 100 L90 120 L130 80"
          fill="none"
          stroke={color}
          strokeWidth="4"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      ) : (
        <>
          <motion.line
            x1="70"
            y1="70"
            x2="130"
            y2="130"
            stroke={color}
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />
          <motion.line
            x1="130"
            y1="70"
            x2="70"
            y2="130"
            stroke={color}
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          />
        </>
      )}
    </motion.svg>
  )
}

