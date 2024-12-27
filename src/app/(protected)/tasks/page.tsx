'use client'
import { useState } from 'react'
import { TaskTable } from "./components/TaskTable"
import { AIChatBox } from "./components/AIChatBox"
import { ChatMode } from './components/AIChatBox'

export default function TaskManagerPage() {
  const [chatMode, setChatMode] = useState<ChatMode>('recommend')
  return (
    <div className="container mx-auto h-full my-auto py-2">
      <div className="flex gap-x-4 h-[550px] md:flex-row flex-col gap-y-4">
          <div className='min-w-[350px] min-h-[200px]'>
            <AIChatBox onModeChange={setChatMode} />
          </div>
          <TaskTable chatMode={chatMode}/>
      </div>
    </div>
  )
}

