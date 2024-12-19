import axios from "@/setup/axios";
import { LoginRequest } from "@/types/auth/LoginRequest";
export const loginService = async (values: LoginRequest) => {
    try {
        const response = await axios.post("/auth/login", values);
        console.log(response,"da");
        return response.data;
    } catch (error) {
        console.error("Login failed!", error);
    }
};