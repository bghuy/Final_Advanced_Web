'use server'

import { Task } from "@/types/task"

export async function getRecommendedTasks(): Promise<Task[]> {
  // Simulating API call with a longer delay
  await new Promise(resolve => setTimeout(resolve, 2000))

  // Returning fake data
  return [
    {
      id: "1",
      title: "Review project proposal",
      description: "Go through the latest project proposal and provide feedback",
      deadline: "2023-12-25",
      status: "Todo",
      priority: "high",
      created_at: "2023-11-20T10:00:00Z",
      updated_at: "2023-11-20T10:00:00Z",
    },
    {
      id: "2",
      title: "Prepare presentation slides",
      description: "Create slides for the upcoming client meeting",
      deadline: "2023-12-28",
      status: "In Progress",
      priority: "medium",
      created_at: "2023-11-21T09:30:00Z",
      updated_at: "2023-11-21T14:45:00Z",
    },
    {
      id: "3",
      title: "Update documentation",
      description: "Update the user manual with the latest features",
      deadline: "2023-12-30",
      status: "Expired",
      priority: "low",
      created_at: "2023-11-22T11:15:00Z",
      updated_at: "2023-11-22T11:15:00Z",
    },
  ]
}

