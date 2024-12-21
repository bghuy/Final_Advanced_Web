'use server'

import { Task } from "@/types/task"
import { v4 as uuidv4 } from 'uuid'

const tasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the project proposal for the new client",
    deadline: "2023-12-31",
    status: "In Progress",
    priority: "high",
    created_at: "2023-11-15T09:00:00Z",
    updated_at: "2023-11-15T09:00:00Z",
    focusSessions: 0,
  },
  {
    id: "2",
    title: "Review code changes",
    description: "Review and approve the latest pull requests",
    deadline: "2023-12-20",
    status: "Todo",
    priority: "medium",
    created_at: "2023-11-16T10:30:00Z",
    updated_at: "2023-11-16T10:30:00Z",
    focusSessions: 0,
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the user guide with the latest features",
    deadline: "2023-12-25",
    status: "Completed",
    priority: "low",
    created_at: "2023-11-17T11:45:00Z",
    updated_at: "2023-11-18T14:20:00Z",
    focusSessions: 2,
  },
  {
    id: "4",
    title: "Prepare presentation",
    description: "Create slides for the upcoming team meeting",
    deadline: "2023-12-22",
    status: "In Progress",
    priority: "medium",
    created_at: "2023-11-18T13:15:00Z",
    updated_at: "2023-11-18T13:15:00Z",
    focusSessions: 1,
  },
  {
    id: "5",
    title: "Debug reported issues",
    description: "Investigate and fix bugs reported by QA team",
    deadline: "2023-12-18",
    status: "Expired",
    priority: "high",
    created_at: "2023-11-19T09:30:00Z",
    updated_at: "2023-11-20T11:45:00Z",
    focusSessions: 0,
  }
]

export async function getTasks(): Promise<Task[]> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    return tasks
  } catch (error) {
    throw new Error("Failed to fetch tasks. Please try again later.")
  }
}

export async function editTask(updatedTask: Task): Promise<Task> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = tasks.findIndex(task => task.id === updatedTask.id)
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    updatedTask.updated_at = new Date().toISOString()
    tasks[index] = updatedTask
    return updatedTask
  } catch (error) {
    throw new Error("Failed to edit task. Please try again later.")
  }
}

export async function deleteTask(taskId: string): Promise<void> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const index = tasks.findIndex(task => task.id === taskId)
    if (index === -1) {
      throw new Error("Task not found")
    }
    
    tasks.splice(index, 1)
  } catch (error) {
    throw new Error("Failed to delete task. Please try again later.")
  }
}

export async function createTask(newTask: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'focusSessions'>): Promise<Task> {
  try {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const now = new Date().toISOString()
    const task: Task = {
      ...newTask,
      id: uuidv4(), // Generate a unique ID using uuid
      created_at: now,
      updated_at: now,
      focusSessions: 0,
    }

    tasks.push(task)
    return task
  } catch (error) {
    throw new Error("Failed to create task. Please try again later.")
  }
}

