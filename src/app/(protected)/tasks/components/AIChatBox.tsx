'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send } from 'lucide-react'
import { TaskDetailModal } from "./TaskDetailModal"

type ChatMessage = {
  id: string
  content: string
  isUser: boolean
  tasks?: Task[]
}

export type ChatMode = 'recommend' | 'set deadline'

export function AIChatBox({ onModeChange }: { onModeChange: (mode: ChatMode) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<ChatMode>('recommend')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('deadline')
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const handleSendMessage = async () => {
    if (input.trim() === '') return

    setIsLoading(true)
    const userMessage: ChatMessage = { id: Date.now().toString(), content: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1000))

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: `Here are some ${mode === 'recommend' ? 'recommended tasks' : 'tasks with updated deadlines'} based on your input:`,
      isUser: false,
      tasks: generateMockTasks(mode)
    }
    setMessages(prev => [...prev, aiMessage])
    setIsLoading(false)
  }

  const generateMockTasks = (mode: ChatMode): Task[] => {
    const statuses: Task['status'][] = ['Todo', 'In Progress', 'Completed', 'Expired']
    const priorities: Task['priority'][] = ['high', 'medium', 'low']

    return Array.from({ length: 3 }, (_, i) => ({
      id: (Date.now() + i).toString(),
      title: `Task ${i + 1}`,
      description: 'This is a mock task description',
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      deadline: mode === 'set deadline' 
        ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))
  }

  const handleAcceptTask = (taskId: string) => {
    // Here you would typically update the task in your state or database
    console.log(`Task ${taskId} accepted`)
  }

  const handleDeclineTask = (messageId: string, taskId: string) => {
    setMessages(prevMessages => 
      prevMessages.map(message => 
        message.id === messageId
          ? { ...message, tasks: message.tasks?.filter(task => task.id !== taskId) }
          : message
      )
    )
  }

  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'Todo': return 'bg-yellow-500 text-white'
      case 'In Progress': return 'bg-blue-500 text-white'
      case 'Completed': return 'bg-green-500 text-white'
      case 'Expired': return 'bg-red-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high': return 'bg-red-500 text-white'
      case 'medium': return 'bg-yellow-500 text-white'
      case 'low': return 'bg-green-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const handleViewTaskDetail = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDetailModalOpen(true)
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-lg overflow-hidden">
      <ScrollArea className="flex-grow p-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {message.content}
            </div>
            {message.tasks && (
              <div className="mt-2 space-y-2">
                {message.tasks.map(task => (
                  <div key={task.id} className="bg-white p-2 rounded-lg shadow text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold truncate">{task.title}</h3>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleAcceptTask(task.id)}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeclineTask(message.id, task.id)}>Decline</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <p className="text-xs mt-1">Deadline: {new Date(task.deadline as string).toLocaleDateString()}</p>
                    <Button 
                      size="sm" 
                      variant="link" 
                      className="p-0 h-auto font-normal text-xs text-blue-500"
                      onClick={() => handleViewTaskDetail(task)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </ScrollArea>
      <div className="border-t p-4 space-y-2">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex space-x-2">
          <Select value={mode} onValueChange={(value) => {
            setMode(value as ChatMode);
            onModeChange(value as ChatMode);
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recommend">Recommend</SelectItem>
              <SelectItem value="set deadline">Set Deadline</SelectItem>
            </SelectContent>
          </Select>
          {mode === 'set deadline' && (
            <Select value={selectedColumn} onValueChange={setSelectedColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="deadline">Deadline</SelectItem>
                <SelectItem value="start_time">Start Time</SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <TaskDetailModal
        task={selectedTask}
        isOpen={isTaskDetailModalOpen}
        onClose={() => setIsTaskDetailModalOpen(false)}
        onEdit={() => {}}
        onDelete={() => {}}
        isLoading={false}
        onOpenEditModal={() => {}}
      />
    </div>
  )
}
