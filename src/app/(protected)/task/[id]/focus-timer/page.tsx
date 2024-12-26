'use client'

import { useState, useEffect } from 'react'
import { getTasks, editTask } from '../../../../../../actions/taskActions'
import { Task } from '@/types/task'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Play, Pause, StopCircle } from 'lucide-react'

export default function FocusTimerPage({ params }: { params: Promise<{ id: string }> }) {
  const [task, setTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [timerDuration, setTimerDuration] = useState(25)
  const [breakDuration, setBreakDuration] = useState(5)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [taskId, setTaskId] = useState<string | null>(null) // Store resolved ID here
  const { toast } = useToast()

  // Resolve `params` and set `taskId`
  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await params
      setTaskId(id)
    }
    resolveParams()
  }, [params])

  // Fetch task when `taskId` is available
  useEffect(() => {
    if (!taskId) return

    const fetchTask = async () => {
      const tasks = await getTasks()
      const foundTask = tasks.find(t => t.id === taskId)
      if (foundTask) {
        setTask(foundTask)
      }
      setLoading(false)
    }
    fetchTask()
  }, [taskId])

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
    } else if (isRunning && timeLeft === 0) {
      handleTimerComplete()
    }

    return () => clearInterval(interval)
  }, [isRunning, timeLeft])

  const startTimer = () => {
    if (task?.status !== 'in progress') {
      toast({
        title: "Cannot start timer",
        description: "The task must be in progress to start the timer.",
        variant: "destructive",
      })
      return
    }

    setTimeLeft(timerDuration * 60)
    setIsRunning(true)
    setIsBreak(false)
  }

  const startBreakTimer = () => {
    setTimeLeft(breakDuration * 60)
    setIsRunning(true)
    setIsBreak(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setTimeLeft(0)
  }

  const handleTimerComplete = async () => {
    setIsRunning(false)
    if (!isBreak && task) {
      const updatedTask = {
        ...task,
        // focusSessions: (task.focusSessions || 0) + 1,
      }
      await editTask(updatedTask)
      setTask(updatedTask)
    }
    toast({
      title: isBreak ? "Break time over" : "Focus session complete",
      description: isBreak ? "Time to get back to work!" : "Great job! Take a break or start another session.",
    })
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-4 animate-spin" /></div>
  }

  if (!task) {
    return <div>Task not found</div>
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Focus Timer: {task.title}</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <Label htmlFor="timerDuration">Timer Duration (minutes)</Label>
          <Input
            id="timerDuration"
            type="number"
            value={timerDuration}
            onChange={(e) => setTimerDuration(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="breakDuration">Break Duration (minutes)</Label>
          <Input
            id="breakDuration"
            type="number"
            value={breakDuration}
            onChange={(e) => setBreakDuration(Number(e.target.value))}
            disabled={isRunning}
          />
        </div>
        <div className="text-center mb-4">
          <h2 className="text-4xl font-bold">{formatTime(timeLeft)}</h2>
          <p>{isBreak ? 'Break Time' : 'Focus Time'}</p>
        </div>
        <div className="flex justify-center space-x-2">
          {!isRunning ? (
            <Button onClick={startTimer} disabled={task.status !== 'in progress'}>
              <Play className="mr-2 h-4 w-4" />
              Start Focus Timer
            </Button>
          ) : (
            <Button onClick={pauseTimer}>
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          )}
          <Button onClick={stopTimer} variant="destructive">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop
          </Button>
          {!isRunning && !isBreak && (
            <Button onClick={startBreakTimer}>
              Start Break Timer
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
