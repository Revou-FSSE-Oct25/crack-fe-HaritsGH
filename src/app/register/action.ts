'use server';

import { register } from "@/lib/auth";
import { redirect } from "next/navigation";
import { RegisterProps } from "@/lib/props";

export async function registerAction(userData: RegisterProps) {
    try {
        if (userData.password !== userData.confirmPassword) {
            return { error: 'Passwords do not match' };
        }
        
        await register({
            username: userData.username,
            email: userData.email,
            password: userData.password
        });
        redirect('/login');
    } catch (error: any) {
        // Don't catch redirect errors
        if (error.digest === 'NEXT_REDIRECT' || error.message?.includes('NEXT_REDIRECT')) {
            throw error;
        }
        return { error: error.message || 'Registration failed' };
    }
}