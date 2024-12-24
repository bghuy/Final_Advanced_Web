import axios from "@/setup/axios";
import { ISODateString } from "@/types/ISODateString";
export const GetTaskList = async (startTime: ISODateString, endTime: ISODateString) => {
    try {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0)).toISOString();
        const endOfMonth = new Date(Date.UTC(
            now.getUTCFullYear(), 
            now.getUTCMonth() + 1, // Tháng tiếp theo
            0, // Ngày 0 của tháng tiếp theo = ngày cuối cùng của tháng hiện tại
            23, 59, 59
          )).toISOString();
        const start = startTime || startOfMonth;
        const end = endTime || endOfMonth;
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