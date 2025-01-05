import axios from "@/setup/axios"

type CreateFocusTimerType = {
    duration:  number,
    estimated_duration: number,
    task_id: string,
}
export const createFocusTimer = async (data: CreateFocusTimerType) => {
  const response = await axios.post('/focus-timer', data)
  return response.data
}