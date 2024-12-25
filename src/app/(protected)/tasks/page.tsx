'use client'
import { useState } from 'react'
import { TaskTable } from "./components/TaskTable"
import { AIChatBox } from "./components/AIChatBox"
import { ChatMode } from './components/AIChatBox'

export default function TaskManagerPage() {
  const [chatMode, setChatMode] = useState<ChatMode>('recommend')
  return (
    <div className="container mx-auto py-10 px-2">
      <div className="grid grid-cols-12 gap-4 h-full">
        <div className = "h-full col-span-4">
          <AIChatBox onModeChange={setChatMode} />
        </div>
        <div className = "col-span-8 h-full">
          <TaskTable chatMode={chatMode} />
        </div>
      </div>
    </div>
  )
}

