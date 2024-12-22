"use server"
import { cookies } from 'next/headers'

export const logOut = async () => {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        cookieStore.delete('refresh_token');
        cookieStore.delete('user_profile');
        return { redirectTo: "/auth/login" }; // Trả về thông tin chuyển hướng
    } catch (error) {
        console.error("Logout error:", error);
        return { error: true, message: "Failed to logout" }; // Trả về lỗi nếu có
    }
};
