'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Send } from 'lucide-react'

interface ChatBoxProps {
  onAIResponse: () => Promise<void>
  loading: boolean
  initialMessage: string
}

export default function ChatBox({ onAIResponse, loading, initialMessage }: ChatBoxProps) {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([
    { text: initialMessage, isUser: false }
  ])
  const [input, setInput] = useState('')

  const handleSendMessage = async () => {
    if (input.trim() && !loading) {
      setMessages([...messages, { text: input, isUser: true }])
      setInput('')
      // Simulate AI response
      await onAIResponse()
      setMessages(prev => [...prev, { text: "I've updated the task recommendations based on your input.", isUser: false }])
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for task recommendations..."
            className="flex-grow"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
          />
          <Button onClick={handleSendMessage} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}

