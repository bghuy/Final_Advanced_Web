import axios from "@/setup/axios";
import queryString from "query-string";
export const getCountDailyDuration = async (start_time: string, end_time: string) => {
    try {

        const query = queryString.stringify({
            start_time,
            end_time,
        });
        const response = await axios.get(`/focus-timer/count-daily-duration?${query}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}


export const getAIAnalyzeSchedule = async (start_time?: string, end_time?: string) => {
    try {
        const response = await axios.post(`/ai/analyze-schedule`, {
            start_time,
            end_time,
        });
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getCountAllStatus = async (start_time?: string, end_time?: string) => {
    try {
        const query = queryString.stringify({
            start_time,
            end_time,
        });
        const response = await axios.get(`/task/count-all-status?${query}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

