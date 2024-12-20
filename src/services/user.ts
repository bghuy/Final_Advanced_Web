import axios from "@/setup/axios";
export const GetUserProfile = async () => {
    try {
        const response = await axios.get("/auth/profile");
        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.log("User not found!", error.message);
        } else {
            console.log("User not found!", "An unknown error occurred");
        }
    }
};