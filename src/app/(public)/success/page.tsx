'use client'

import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MessageCard = dynamic(() => import('@/components/MessageCard'), { ssr: false })

function SuccessContent() {
  const searchParams = useSearchParams()
  const message = searchParams.get('message') || "Your AI-powered plan has been created and is ready for you!"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-4">
      <MessageCard message={message} status="success" />
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  )
}
