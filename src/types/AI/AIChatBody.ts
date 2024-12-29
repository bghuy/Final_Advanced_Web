import { Task } from "../task"

export type AIChatBody = {
    content: string,
    task_ids?: string[]
}

export type AIChatSetTimeResponse = {
    content: string,
    tasks?: Task[]
}