import axios from "@/setup/axios"
import { AIChatBody, AIChatSetTimeResponse } from "@/types/AI/AIChatBody"

export const getAIChatResponse = async (prompt: AIChatBody): Promise<AIChatSetTimeResponse> => {
  const response = await axios.post('/ai/recommend', prompt)
  return response.data
}

export const setTaskTimeByAi = async (prompt: AIChatBody): Promise<AIChatSetTimeResponse> => {
    const response = await axios.post('/ai/set-task-time', prompt)
    return response.data
}

export const getTaskAnalysis = async (start_time: string, end_time: string) => {
    const response = await axios.post('/ai/analyze-schedule', { start_time, end_time })
    return response.data
}