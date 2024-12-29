'use client'

import { CreateTaskType, Task, UpdateTaskType } from "@/types/task"
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { CreateTask, DeleteTasks, GetTaskList, UpdateTask } from "@/services/task"
import { convertToISODateString } from "@/lib/utils"
// import { ISODateString } from "@/types/ISODateString"

const tasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the project proposal for the new client",
    start_time: "2023-12-31T09:00:00",
    end_time: "2023-12-31T23:59:00",
    status: "in progress",
    priority: "high",
    created_at: "2023-11-15T09:00:00Z",
    updated_at: "2023-11-15T09:00:00Z",
  },
  {
    id: "2",
    title: "Review code changes",
    description: "Review and approve the latest pull requests",
    start_time: "2023-12-20T10:00:00",
    end_time: "2023-12-20T18:00:00",
    status: "to do",
    priority: "medium",
    created_at: "2023-11-16T10:30:00Z",
    updated_at: "2023-11-16T10:30:00Z",
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the user guide with the latest features",
    start_time: "2023-12-25T09:00:00",
    end_time: "2023-12-25T12:00:00",
    status: "completed",
    priority: "low",
    created_at: "2023-11-17T11:45:00Z",
    updated_at: "2023-11-18T14:20:00Z",
  },
  {
    id: "4",
    title: "Prepare presentation",
    description: "Create slides for the upcoming team meeting",
    start_time: "2023-12-22T13:00:00",
    status: "in progress",
    priority: "medium",
    created_at: "2023-11-18T13:15:00Z",
    updated_at: "2023-11-18T13:15:00Z",
  },
  {
    id: "5",
    title: "Debug reported issues",
    description: "Investigate and fix bugs reported by QA team",
    start_time: "2023-12-18T09:00:00",
    end_time: "2023-12-18T17:00:00",
    status: "expired",
    priority: "high",
    created_at: "2023-11-19T09:30:00Z",
    updated_at: "2023-11-20T11:45:00Z",
  }
]

export async function getTasks(): Promise<Task[]> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return tasks
}

export async function fetchTaskList(start_time: string | Date | undefined, end_time: string | Date | undefined): Promise<Task[]> {
  const start = start_time instanceof Date ? convertToISODateString(start_time) : start_time; 
  const end = end_time instanceof Date ? convertToISODateString(end_time) : end_time;
  return await GetTaskList(start || '', end || '');
}

export async function createNewTask(newTask: CreateTaskType){
  return await CreateTask(newTask);
}

export async function updatedTask(updatedTask: UpdateTaskType) {
  const { id, ...taskData } = updatedTask;
  return await UpdateTask(id, taskData);
}

export async function editTask(updatedTask: Task): Promise<Task> {
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const index = tasks.findIndex(task => task.id === updatedTask.id)
  if (index === -1) {
    throw new Error("Task not found")
  }
  
  updatedTask.updated_at = new Date().toISOString()
  tasks[index] = updatedTask
  revalidatePath('/') // Revalidate the home page
  return updatedTask
}

export async function removeTask (Ids: string[]) {
  return await DeleteTasks(Ids);
}

export async function deleteTask(taskId: string): Promise<void> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const index = tasks.findIndex(task => task.id === taskId)
  if (index === -1) {
    throw new Error("Task not found")
  }
  
  tasks.splice(index, 1)
  revalidatePath('/') // Revalidate the home page
}

export async function createTask(newTask: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  const now = new Date().toISOString()
  const task: Task = {
    ...newTask,
    id: uuidv4(), // Generate a unique ID using uuid
    created_at: now,
    updated_at: now,
  }

  tasks.push(task)
  revalidatePath('/') // Revalidate the home page
  return task
}

