import axios from "@/setup/axios";
export const GetUserProfile = async () => {
    try {
        const response = await axios.get("/auth/profile");
        console.log(response,"response");
        return response.data;
    } catch (error) {
        // console.log("User not found!", error);
    }
};