'use server';

import { login, logout, getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginProps } from "@/lib/props";

export async function loginAction(credentials: LoginProps) {
    try {
        const accessToken = await login(credentials);
        const userInfo = await getCurrentUser(accessToken);
        return { userId: userInfo.userId, username: userInfo.username };
    } catch (error: any) {
        // Don't catch redirect errors
        if (error.digest === 'NEXT_REDIRECT' || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        return { error: error.message || 'Login failed' };
    }
}

export async function logoutAction() {
    await logout();
    redirect('/');
}
