'use server'
import { cookies } from 'next/headers'
export async function getUserProfileFromCookie() {
    const cookieStore = await cookies()
    const userProfile = cookieStore.get('user_profile')?.value;
    if (userProfile) {
         return JSON.parse(decodeURIComponent(userProfile));
    }
    return null
}

