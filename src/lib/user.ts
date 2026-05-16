import axios from "axios";
import { redirect } from "next/navigation";
import { getAccessTokenCookie } from "./auth";

export async function getUserProfile() {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch user profile');
  }
}

export async function userChangePassword(passwords: {newPassword: string, confirmPassword: string}) {
  if (passwords.newPassword !== passwords.confirmPassword) {
    throw new Error('Passwords do not match');
  }
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit`, passwords, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Change password failed');
  }
}

export async function userDeactivateAccount() {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Deactivate account failed');
  }
}

export async function getUserSearch(query: string) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user/search?q=${query}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Search user failed');
  }
}

export async function getUsernamesById(ids: number[]) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/usernames`, ids, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Get user by ids failed');
  }
}