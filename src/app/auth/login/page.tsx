'use client';

import React, { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

const LoginPage = () => {
    return (
        <Suspense fallback={<div>User</div>}>
            <LoginForm />
        </Suspense>
    );
};

export default LoginPage;
