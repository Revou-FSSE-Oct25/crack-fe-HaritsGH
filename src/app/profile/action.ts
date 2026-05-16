'use server'

import { userChangePassword, getUserProfile, userDeactivateAccount } from "@/lib/user";
import { redirect } from "next/navigation";
import { PasswordEditProps } from "@/lib/props";
import { callForRefresh } from "@/lib/refresh";

export async function getUserProfileAction() {
  try {
    const userProfile = await getUserProfile();
    return {username: userProfile.username, email: userProfile.email};
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        const userProfile = await getUserProfile();
        return {username: userProfile.username, email: userProfile.email};
      });
    } else {
      return { error: error.message || 'Failed to fetch user profile' };
    }
  }
}

export async function changePasswordAction(passwords: PasswordEditProps) {
  try {
    await userChangePassword(passwords);
  } catch (error: any) {
    if (error.response?.status === 401) {
      await callForRefresh(async () => {
        await userChangePassword(passwords);
      });
    } else {
      return { error: error.message || 'Failed to change password' };
    }
  }
  redirect('/profile');
}

export async function deactivateAccountAction() {
  try {
    await userDeactivateAccount();
  } catch (error: any) {
    if (error.response?.status === 401) {
      await callForRefresh(async () => {
        await userDeactivateAccount();
      });
    } else {
      return { error: error.message || 'Failed to deactivate account' };
    }
  }
  redirect('/');
}