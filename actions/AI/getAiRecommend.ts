'use client'

import { getAIChatResponse, getTaskAnalysis, setTaskTimeByAi } from "@/services/ai"
import { AIChatBody } from "@/types/AI/AIChatBody"

export const getAIResponse = async (prompt: AIChatBody) => {
    let response = null;
    if(prompt.task_ids) {
        response = await setTaskTimeByAi(prompt)
    }
    else {
        response = await getAIChatResponse(prompt)
    }
    
    return response
}

export const getRecommendedTaskAnalysis = async (start_time: string, end_time: string) => {
    const response = await getTaskAnalysis(start_time,end_time)
    return response
}