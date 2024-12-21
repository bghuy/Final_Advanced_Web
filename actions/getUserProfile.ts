'use server'
import { GetUserProfile } from '@/services/user';
export async function getUserProfile() {
    const user_data = await GetUserProfile();
    return user_data;
}

