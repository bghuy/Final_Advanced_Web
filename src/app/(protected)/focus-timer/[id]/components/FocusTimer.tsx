'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Task } from '@/types/task'
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'
import { createFocusTimer } from '@/services/focus-timer'

export function FocusTimer({ task }: { task: Task }) {
  const [focusTime, setFocusTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [estimatedTime, setEstimatedTime] = useState(60)
  const [timeLeft, setTimeLeft] = useState(focusTime * 60)
  const [isActive, setIsActive] = useState(false)
  const [isFocusTime, setIsFocusTime] = useState(true)
  const [totalFocusTime, setTotalFocusTime] = useState(0)
  const [isEndTimeReached, setIsEndTimeReached] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const checkEndTime = () => {
      const now = new Date()
      const endTime = task.end_time ? new Date(task.end_time) : null
      return endTime ? now > endTime : false
    }

    const initialEndTimeReached = checkEndTime()
    setIsEndTimeReached(initialEndTimeReached)

    if (initialEndTimeReached) {
      console.log(`Task "${task.title}" end time has already passed.`)
    }

    let interval: NodeJS.Timeout | null = null
    if (isActive && !initialEndTimeReached) {
      interval = setInterval(() => {
        const now = new Date()
        now.setSeconds(now.getSeconds() + 1)
        const endTime = task.end_time ? new Date(task.end_time) : null
        
        if (endTime && now > endTime) {
          createFocusTimer({duration: totalFocusTime || 1, task_id: task.id, estimated_duration: estimatedTime * 60 || 60})
          setIsActive(false)
          setTimeLeft(0)
          setIsEndTimeReached(true)
          console.log(`Task "${task.title}" has reached its end time.`)
        } else {
          setTimeLeft((prevTime) => {
            if (prevTime > 0) {
              if (isFocusTime) {
                setTotalFocusTime((prevTotal) => prevTotal + 1)
              }
              return prevTime - 1
            } else {
              if (isFocusTime) {
                setIsFocusTime(false)
                return breakTime * 60
              } else {
                setIsFocusTime(true)
                return focusTime * 60
              }
            }
          })
        }
      }, 1000)    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, isFocusTime, focusTime, breakTime, task.end_time, task.title, task.id, totalFocusTime, estimatedTime])

  const startFocus = () => {
    if (!isEndTimeReached) {
      setIsActive(true)
      setIsFocusTime(true)
      setTimeLeft(focusTime * 60)
    }
  }

  const endFocus = async() => {
    try {
      setIsLoading(true)
      setIsActive(false)
      setIsFocusTime(true)
      setTimeLeft(focusTime * 60)
      await createFocusTimer({duration: totalFocusTime || 1, task_id: task.id, estimated_duration: estimatedTime * 60 || 60})
      console.log(`Total focus time: ${Math.floor(totalFocusTime / 60)} minutes and ${totalFocusTime % 60} seconds`)
      setTotalFocusTime(0)
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    const totalSeconds = isFocusTime ? focusTime * 60 : breakTime * 60
    return ((totalSeconds - timeLeft) / totalSeconds) * 100
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-64 h-64 mx-auto">
          <CircularProgressbar
            value={getProgress()}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textSize: '16px',
              pathColor: isFocusTime ? '#3b82f6' : '#10b981',
              textColor: '#1f2937',
              trailColor: '#e2e8f0',
            })}
          />
        </div>
        <div className="text-center text-lg font-semibold">
          {isFocusTime ? "Focus Time" : "Break Time"}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="estimatedTime" className="block text-sm font-medium text-gray-700">Estimated (min)</label>
            <Input
              id="estimatedTime"
              type="number"
              value={estimatedTime}
              onChange={(e) => setEstimatedTime(Number(e.target.value))}
              min={1}
              disabled={isActive}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="focusTime" className="block text-sm font-medium text-gray-700">Focus (min)</label>
            <Input
              id="focusTime"
              type="number"
              value={focusTime}
              onChange={(e) => setFocusTime(Number(e.target.value))}
              min={1}
              disabled={isActive}
              className="mt-1"
            />
          </div>
          <div>
            <label htmlFor="breakTime" className="block text-sm font-medium text-gray-700">Break (min)</label>
            <Input
              id="breakTime"
              type="number"
              value={breakTime}
              onChange={(e) => setBreakTime(Number(e.target.value))}
              min={1}
              disabled={isActive}
              className="mt-1"
            />
          </div>
        </div>
        <div className="flex justify-center space-x-4">
          {!isActive && !isEndTimeReached && (
            <Button onClick={startFocus} className="bg-blue-500 hover:bg-blue-600" disabled = {isLoading}>Start Focus</Button>
          )}
          {isActive && (
            <Button onClick={endFocus} className="bg-red-500 hover:bg-red-600" disabled = {isLoading}>End Session</Button>
          )}
          {isEndTimeReached && (
            <div className="text-red-500 font-semibold">Task end time has passed. Timer cannot be started.</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

