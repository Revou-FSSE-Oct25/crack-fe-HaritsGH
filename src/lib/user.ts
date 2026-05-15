import axios from "axios";
import { refreshAccessTokenCookie } from "./auth";
import { redirect } from "next/navigation";

export async function getUserProfile(accessToken: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessTokenCookie();
        if (!newAccessToken) {
          throw new Error('Session expired. Please login again.');
        }
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        return response.data.data;
      } catch (refreshError: any) {
        if (refreshError.response?.data?.message) {
          throw new Error(refreshError.response.data.message);
        }
        throw new Error('Session expired. Please login again.');
      }
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch user profile');
  }
}

export async function userChangePassword(accessToken: string, passwords: {newPassword: string, confirmPassword: string}) {

  try {
    if (passwords.newPassword !== passwords.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit`, passwords, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessTokenCookie();
        if (!newAccessToken) {
          throw new Error('Session expired. Please login again.');
        }
        const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/user/edit`, passwords, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        redirect('/');
      } catch (refreshError: any) {
        if (refreshError.response?.data?.message) {
          throw new Error(refreshError.response.data.message);
        }
        throw new Error('Session expired. Please login again.');
      }
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Change password failed');
  }
}

export async function userDeactivateAccount(accessToken: string) {
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessTokenCookie();
        if (!newAccessToken) {
          throw new Error('Session expired. Please login again.');
        }
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });
        return response.data.data;
      } catch (refreshError: any) {
        if (refreshError.response?.data?.message) {
          throw new Error(refreshError.response.data.message);
        }
        throw new Error('Session expired. Please login again.');
      }
    }
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Deactivate account failed');
  }
}
