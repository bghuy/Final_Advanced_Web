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

export const sendOtp = async () => {
    try {
        const response = await axios.post("/auth/send-otp");
        return response.data;
    } catch (error) {
        console.log("send otp Error", error);
        throw error;
    }
};

export const verifyOtp = async (otp: string) => {
    try {
        const response = await axios.post("/auth/verify-otp", {
            otp,
        });
        return response.data;
    } catch (error) {
        console.log("verify otp Error", error);
        throw error;
    }
};

export const changePassword = async (new_password: string, old_password: string) => {
    try {
        const response = await axios.put("/auth/change-password", {
            new_password,
            old_password
        });
        return response.data;
    } catch (error) {
        console.log("change password Error", error);
        throw error;
    }
};