import axios from "@/setup/axios";
import { LoginRequest } from "@/types/auth/LoginRequest";
import { RegisterRequest } from "@/types/auth/registerRequest";
export const loginService = async (values: LoginRequest) => {
    try {
        const response = await axios.post("/auth/login", values);
        return response.data;
    } catch (error) {
        console.log("Login failed!", error);
    }
};

export const registerService = async (values: RegisterRequest) => {
    try {
        const response = await axios.post("/auth/register", values);
        return response.data;
    } catch (error) {
        console.log("register Error", error);
        throw error;
    }
};