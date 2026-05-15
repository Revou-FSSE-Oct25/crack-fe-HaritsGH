'use server'

import { userChangePassword, getUserProfile, userDeactivateAccount } from "@/lib/user";
import { redirect } from "next/navigation";
import { PasswordEditProps } from "@/lib/props";
import { cookies } from "next/headers";

export async function getUserProfileAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const userProfile = await getUserProfile(accessToken!);
  return {username: userProfile.username, email: userProfile.email};
}

export async function changePasswordAction(passwords: PasswordEditProps) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  await userChangePassword(accessToken!, passwords);
  redirect('/profile');
}

export async function deactivateAccountAction() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  await userDeactivateAccount(accessToken!);
  redirect('/');
}