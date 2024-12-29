'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Task } from "@/types/task"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send } from 'lucide-react'
import { TaskDetailModal } from "./TaskDetailModal"
import { getAIResponse } from '../../../../../actions/AI/getAiRecommend'
import { useSelector} from 'react-redux';
import { RootState } from '../../../../../redux/store'
import ReactMarkdown from 'react-markdown';
import { createNewTask, updatedTask } from '../../../../../actions/taskActions'
type ChatMessage = {
  id: string
  content: string
  isUser: boolean
  tasks?: Task[]
}

export type ChatMode = 'recommend' | 'set deadline'

export function AIChatBox({ onModeChange, onRequestRefresh }: { onModeChange: (mode: ChatMode) => void, onRequestRefresh: ()=> void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{id: "5FBFQBjS77", content: "Hello, I'm your AI assistant. How can I help you today?", isUser: false}])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<ChatMode>('recommend')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedColumn, setSelectedColumn] = useState<string>('standard')
  const [isTaskDetailModalOpen, setIsTaskDetailModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const previousModeRef = useRef<ChatMode | null>(null);
  const tasks = useSelector((state: RootState) => state.task);
  useEffect(() => {
    if (previousModeRef.current !== null && previousModeRef.current !== mode) {
      setMessages([{id: "5FBFQBjS77", content: "Hello, I'm your AI assistant. How can I help you today?", isUser: false}])
    }
    previousModeRef.current = mode;
  }, [mode]);
  const handleSendMessage = async () => {
    if (input.trim() === '') return

    setIsLoading(true)
    const body: { content: string; task_ids?: string[] } = {
      content: input,
    }
    if(tasks.selectedTaskIds.length) {
      body.task_ids = [...tasks.selectedTaskIds]
    }

    const response = await getAIResponse(body);

    console.log(response, "res");
    
    const userMessage: ChatMessage = { id: Date.now().toString(), content: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')

    // Simulate AI response

    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      content: response.content || (mode === "set deadline" ? 'Please check all task modifications' : 'Sorry, I could not generate a response.'),
      isUser: false, 
      tasks: response.tasks?.map((task, index) => ({
        ...task,
        id: task.id || `${Date.now()}-${index}`,
      })) || [],
    }
    setMessages(prev => [...prev, aiMessage])
    setIsLoading(false)
  }
  // const generateMockTasks = (mode: ChatMode): Task[] => {
  //   const statuses: Task['status'][] = ['to do', 'in progress', 'completed', 'expired']
  //   const priorities: Task['priority'][] = ['high', 'medium', 'low']

  //   return Array.from({ length: 3 }, (_, i) => ({
  //     id: (Date.now() + i).toString(),
  //     title: `Task ${i + 1}`,
  //     description: 'This is a mock task description',
  //     status: statuses[Math.floor(Math.random() * statuses.length)],
  //     priority: priorities[Math.floor(Math.random() * priorities.length)],
  //     end_time: mode === 'set deadline' 
  //       ? new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  //       : new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  //     created_at: new Date().toISOString(),
  //     updated_at: new Date().toISOString(),
  //   }))
  // }

  const handleAcceptTask = async(task: Task & {created_at?: string; updated_at?: string;}, messageId: string) => {
    // Here you would typically update the task in your state or database
    try {
      if(mode === 'recommend'){
        await createNewTask(task)
      }
      else if(mode === 'set deadline') {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { created_at, updated_at, ...taskWithoutCreatedAt } = task;
        console.log(taskWithoutCreatedAt, "taskWithoutCreatedAt");
        await updatedTask(taskWithoutCreatedAt);
      }
      onRequestRefresh();
      handleDeclineTask(messageId, task.id);
    } catch (error) {
      console.log(error);
    }
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
      case 'to do': return 'bg-yellow-500 text-white'
      case 'in progress': return 'bg-blue-500 text-white'
      case 'completed': return 'bg-green-500 text-white'
      case 'expired': return 'bg-red-500 text-white'
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
    <div className="flex flex-col border rounded-lg overflow-hidden h-full">
      <ScrollArea className="flex-grow p-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-4 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
            {message.tasks && (
              <div className="mt-2 space-y-2">
                {message.tasks.map(task => (
                  <div key={task.id} className="bg-white p-2 rounded-lg shadow text-sm">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold truncate">{task.title}</h3>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" onClick={() => handleAcceptTask(task, message.id)}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeclineTask(message.id, task.id)}>Decline</Button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </div>
                    <p className="text-xs mt-1">Deadline: {new Date(task.end_time as string).toLocaleDateString()}</p>
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
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
                <SelectItem value="standard">Standard</SelectItem>
                {/* <SelectItem value="start_time">Start Time</SelectItem> */}
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
        hideAllActions={true}
      />
    </div>
  )
}

