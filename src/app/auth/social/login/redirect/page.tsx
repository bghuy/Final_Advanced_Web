'use client';

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from 'js-cookie';
import jwt from 'jsonwebtoken';
import { GetUserProfile } from "@/services/user";

const SocialLoginComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const access_token = searchParams.get("access_token") || null;

    useEffect(() => {
        const handleSocialLogin = async () => {
            if (access_token) {
                try {
                    const decodedToken = jwt.decode(access_token) as jwt.JwtPayload;
                    const expirationTime = decodedToken?.exp
                        ? new Date(decodedToken.exp * 1000)
                        : new Date(Date.now() + 3600 * 1000);

                    Cookies.set("access_token", access_token, {
                        path: "/",
                        expires: expirationTime,
                    });

                    const userProfile = await GetUserProfile();
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

const SocialLoginPage = () => (
    <Suspense fallback={<div>Loading...</div>}>
        <SocialLoginComponent />
    </Suspense>
);

export default SocialLoginPage;
