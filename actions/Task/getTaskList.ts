'use client'
import { GetTaskList } from "@/services/task";
import { ISODateString } from "@/types/ISODateString";
export async function getTaskList(startTime: ISODateString, endTime: ISODateString) {
    const taskList = await GetTaskList(startTime, endTime);
    return taskList;
}

