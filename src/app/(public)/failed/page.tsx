'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const MessageCard = dynamic(() => import('@/components/MessageCard'), { ssr: false })

function FailedContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || "We encountered an issue while creating your AI plan. Please try again."

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100 p-4">
      <MessageCard message={message} status="error" />
    </div>
  )
}

export default function FailedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailedContent />
    </Suspense>
  )
}
