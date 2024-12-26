import { getFirstDayOfMonth, getLastDayOfMonth } from "@/lib/utils";
import axios from "@/setup/axios";
import { CreateTaskType} from "@/types/task";
export const GetTaskList = async (startTime: string, endTime: string) => {
    try {
        const now = new Date();
        // const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString();
        // const endOfMonth = new Date(Date.UTC(
        //     now.getUTCFullYear(), 
        //     now.getUTCMonth() + 1,
        //     0,
        //     23, 59, 59
        //   )).toISOString();
        const start_day_month = getFirstDayOfMonth(now);
        const end_day_month = getLastDayOfMonth(now);
        const start = startTime || start_day_month;
        const end = endTime || end_day_month;
        const response = await axios.get(`/task/all?start_time=${start}&end_time=${end}`);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Task list not found!", error.message);
        } else {
            console.log("Task list not  found!", "An unknown error occurred");
        }
    }
};

export const CreateTask = async (task: CreateTaskType) => {
    try {
        const response = await axios.post("/task", task);
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.log("Task not created!", error.message);
        } else {
            console.log("Task not created!", "An unknown error occurred");
        }
    }
};