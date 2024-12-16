'use server'

import { Task } from "@/types/task"
import { v4 as uuidv4 } from 'uuid'

// Mock data with more realistic dates
const tasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Draft and finalize the project proposal for the new client",
    deadline: "2024-12-09", // Random future date within 1-7 days
    status: "In Progress",
    priority: "high",
    created_at: "2024-12-06T09:00:00Z",
    updated_at: "2024-12-06T09:00:00Z"
  },
  {
    id: "2",
    title: "Review code changes",
    description: "Review and approve the latest pull requests",
    deadline: "2024-12-11", // Random future date within 1-7 days
    status: "Todo",
    priority: "medium",
    created_at: "2024-12-06T10:30:00Z",
    updated_at: "2024-12-06T10:30:00Z"
  },
  {
    id: "3",
    title: "Update documentation",
    description: "Update the user guide with the latest features",
    deadline: "2024-12-12", // Random future date within 1-7 days
    status: "Completed",
    priority: "low",
    created_at: "2024-12-06T11:45:00Z",
    updated_at: "2024-12-06T11:45:00Z"
  },
  {
    id: "4",
    title: "Prepare presentation",
    description: "Create slides for the upcoming team meeting",
    deadline: "2024-12-10", // Random future date within 1-7 days
    status: "In Progress",
    priority: "medium",
    created_at: "2024-12-06T13:15:00Z",
    updated_at: "2024-12-06T13:15:00Z"
  },
  {
    id: "5",
    title: "Debug reported issues",
    description: "Investigate and fix bugs reported by QA team",
    deadline: "2024-12-08", // Random future date within 1-7 days
    status: "Expired",
    priority: "high",
    created_at: "2024-12-06T09:30:00Z",
    updated_at: "2024-12-06T09:30:00Z"
  },
  {
    id: "6",
    title: "Weekly team meeting",
    description: "Regular team sync-up and progress review",
    deadline: "2024-12-13", // Random future date within 1-7 days
    status: "Todo",
    priority: "medium",
    created_at: "2024-12-06T09:00:00Z",
    updated_at: "2024-12-06T09:00:00Z"
  },
  {
    id: "7",
    title: "Client presentation",
    description: "Present project progress to the client",
    deadline: "2024-12-14", // Random future date within 1-7 days
    status: "Todo",
    priority: "high",
    created_at: "2024-12-06T09:00:00Z",
    updated_at: "2024-12-06T09:00:00Z"
  },
  {
    id: "8",
    title: "Security audit",
    description: "Perform security review of the application",
    deadline: "2024-12-07", // Random future date within 1-7 days
    status: "Todo",
    priority: "high",
    created_at: "2024-12-06T09:00:00Z",
    updated_at: "2024-12-06T09:00:00Z"
  }
];

export const getTasks = async (): Promise<Task[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return tasks;
}

export const getTask = async (id: string): Promise<Task | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return tasks.find(task => task.id === id);
}

export const createTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newTask: Task = {
    ...task,
    id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  tasks.push(newTask);
  return newTask;
}

export const editTask = async (updatedTask: Task): Promise<Task> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = tasks.findIndex(task => task.id === updatedTask.id);
  if (index === -1) throw new Error('Task not found');
  
  tasks[index] = {
    ...updatedTask,
    updated_at: new Date().toISOString()
  };
  
  return tasks[index];
}

export const deleteTask = async (id: string): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) throw new Error('Task not found');
  
  tasks.splice(index, 1);
}

