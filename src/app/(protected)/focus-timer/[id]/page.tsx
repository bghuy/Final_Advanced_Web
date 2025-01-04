'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { FocusTimer } from './components/FocusTimer'
import { Task } from '@/types/task'
import { GetTask } from '@/services/task'

export default function FocusTimerPage() {
  const params = useParams()
  const taskId = params.id as string

  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const task = await GetTask(taskId)
        setTask(task || null)
      } catch (error) {
        console.error('Error fetching task:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTask()
  }, [taskId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <FocusTimer task={task} />
    </div>
  )
}
