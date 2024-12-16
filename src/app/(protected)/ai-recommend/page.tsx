'use client'

import { useState, useEffect } from 'react'
import { getRecommendedTasks } from '../../../../actions/getRecommendedTasks'
import TaskSidebar from './components/TaskSidebar'
import ChatBox from './components/ChatBox'

export default function AIRecommendPage() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const fetchedTasks = await getRecommendedTasks()
      setTasks(fetchedTasks)
      setLoading(false)
    }

    fetchTasks()
  }, [])

  const handleAIResponse = async () => {
    setLoading(true)
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    const newTasks = await getRecommendedTasks()
    setTasks(newTasks)
    setLoading(false)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-hidden">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">AI Task Recommendations</h1>
        <div className="bg-white rounded-lg shadow-md h-[calc(100vh-8rem)] overflow-hidden">
          <ChatBox 
            onAIResponse={handleAIResponse} 
            loading={loading} 
            initialMessage="Welcome! How can I assist you with task recommendations today?"
          />
        </div>
      </div>
      <TaskSidebar tasks={tasks} loading={loading} />
    </div>
  )
}

