'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getTasks, editTask, deleteTask } from '../../../../../actions/taskActions'
import { notFound } from 'next/navigation'
import { Task } from '@/types/task'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EditTaskModal } from "@/app/(protected)/tasks/components/EditTaskModal"
import { Loader2, Edit, Trash2, Timer } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import Link from 'next/link'

export default function TaskPage() {
  const params = useParams(); // Use useParams to access the `params` object
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const fetchTask = async () => {
      const tasks = await getTasks()
      const foundTask = tasks.find(t => t.id === params.id)
      if (foundTask) {
        setTask(foundTask)
      }
      setLoading(false)
    }
    fetchTask()
  }, [params.id])

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  if (!task) {
    notFound()
  }

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'to do':
        return 'bg-yellow-500'
      case 'in progress':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'expired':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500'
      case 'medium':
        return 'bg-yellow-500'
      case 'low':
        return 'bg-green-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const result = await editTask(updatedTask)
      setTask(result)
      setIsEditModalOpen(false)
      toast({
        title: "Task updated",
        description: "The task has been successfully updated.",
      })
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to update the task. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTask = async () => {
    setIsDeleting(true)
    try {
      await deleteTask(task.id)
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      })
      router.push('/')
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete the task. Please try again.",
        variant: "destructive",
      })
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <p className="text-gray-700 text-base">{task.description}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Deadline
          </label>
          <p className="text-gray-700 text-base">{new Date(task.end_time as string).toLocaleDateString()}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Status
          </label>
          <Badge className={`${getStatusColor(task.status)} text-white`}>
            {task.status}
          </Badge>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Priority
          </label>
          <Badge className={`${getPriorityColor(task.priority)} text-white`}>
            {task.priority}
          </Badge>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Created At
          </label>
          <p className="text-gray-700 text-base">{new Date(task.created_at).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Updated At
          </label>
          <p className="text-gray-700 text-base">{new Date(task.updated_at).toLocaleString()}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Focus Sessions
          </label>
          {/* <p className="text-gray-700 text-base">{task.focusSessions}</p> */}
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button variant="outline" onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={handleDeleteTask} disabled={isDeleting}>
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </>
            )}
          </Button>
          <Link href={`/task/${task.id}/focus-timer`} passHref>
            <Button variant="default" disabled={task.status !== 'in progress'}>
              <Timer className="mr-2 h-4 w-4" />
              Focus Timer
            </Button>
          </Link>
        </div>
      </div>
      <EditTaskModal
        task={task}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdateTask={handleUpdateTask}
        isLoading={false}
      />
    </div>
  )
}
