'use client';

import { useSearchParams } from "next/navigation";
import Cookies from 'js-cookie';
import { useRouter } from "next/navigation";
import jwt from 'jsonwebtoken';
import { GetUserProfile } from "@/services/user";
import { useEffect } from "react";

const SocialLoginPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const access_token = searchParams.get("access_token") || null;

    useEffect(() => {
        const handleSocialLogin = async () => {
            if (access_token) {
                try {
                    // Decode token
                    const decodedToken = jwt.decode(access_token) as jwt.JwtPayload;
                    const expirationTime = decodedToken?.exp
                        ? new Date(decodedToken.exp * 1000)
                        : new Date(Date.now() + 3600 * 1000); // 1 hour default
                    
                    // Set access token in cookies
                    Cookies.set("access_token", access_token, {
                        path: "/",
                        expires: expirationTime,
                    });

                    // Fetch user profile
                    const userProfile = await GetUserProfile();
                    // Redirect if profile fetch is successful
                    if (userProfile) {
                        router.push("/");
                    } else {
                        router.push("/auth/login");
                    }
                } catch (error) {
                    console.error("Error during social login:", error);
                    router.push("/");
                }
            } else {
                router.push("/");
            }
        };

        handleSocialLogin();
    }, [access_token, router]);

    return null;
};

export default SocialLoginPage;
