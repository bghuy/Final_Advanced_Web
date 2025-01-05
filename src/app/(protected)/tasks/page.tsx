'use client'
import { useState } from 'react'
import { TaskTable } from "./components/TaskTable"
import { AIChatBox } from "./components/AIChatBox"
import { ChatMode } from './components/AIChatBox'
// import { Spinner } from './components/Spinner'

export default function TaskManagerPage() {
  const [chatMode, setChatMode] = useState<ChatMode>('recommend')
  const [refreshCount, setRefreshCount] = useState(0)
  const triggerRefresh = () => {
    setRefreshCount((prev) => prev + 1)
  }
  // const [isLoading, setIsLoading] = useState(false)
  // useEffect(()=>{
  //   try {
  //     setIsLoading(true)
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setIsLoading(false)
  //   }
  // },[])
  return (
    <div className="container mx-auto h-full my-auto py-2 px-2">
      <div className="flex gap-x-4 h-[550px] md:flex-row flex-col gap-y-4">
          <div className='min-w-[350px] min-h-[200px]'>
            <AIChatBox onModeChange={setChatMode} onRequestRefresh={triggerRefresh}/>
          </div>
          {/* {isLoading ? <Spinner/> : <TaskTable chatMode={chatMode}/>} */}
          <TaskTable chatMode={chatMode} refreshCount={refreshCount}/>
      </div>
    </div>
  )
}

