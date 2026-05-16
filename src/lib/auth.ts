import axios from "axios";
import { cookies } from "next/headers";

export const AUTH_COOKIE_NAME = 'accessToken';
export const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

export async function login(credentials : {username : string, password : string}) {
    try {
        const tokens = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/login`, credentials);

        const cookieStore = await cookies();
        cookieStore.set(AUTH_COOKIE_NAME, tokens.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
        })
        
        cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, tokens.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
        });
        ;

        return tokens.data.accessToken;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
            throw new Error('Cannot connect to backend server. Please check if the API is running.');
        }
        throw new Error(`Login failed: ${error.message}`);
    }
}

export async function logout() {
  const cookieStore = await cookies();
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {}, {
      withCredentials: true
    });
  } catch (error) {
    // Ignore backend logout errors - still clear frontend cookies
    console.warn('Backend logout failed, clearing frontend cookies anyway');
  }
  cookieStore.delete(REFRESH_TOKEN_COOKIE_NAME);
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getAccessTokenCookie() {
    const cookieStore = await cookies();
    return cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
}

export async function refreshAccessTokenCookie() {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE_NAME)?.value;

    if (!refreshToken) {
        return null;
    }

    try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/refresh`,
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            }
        );

        const newAccessToken = response.data.accessToken;

        // Set the new access token cookie
        cookieStore.set(AUTH_COOKIE_NAME, newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 1000 * 60 * 60), // 1 hour
            path: '/',
            domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
        });

        // Update refresh token if a new one is provided
        if (response.data.refreshToken) {
            cookieStore.set(REFRESH_TOKEN_COOKIE_NAME, response.data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
                path: '/',
                domain: process.env.NODE_ENV === 'production' ? undefined : 'localhost',
            });
        }
        return newAccessToken;
    } catch (error) {
        // If refresh fails, clear tokens and force re-login
        await logout();
        throw error;
    }
}

export async function getCurrentUser(accessToken: string) {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return {
            userId: response.data.data.id,
            username: response.data.data.username
        };
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Failed to fetch user info');
    }
}

export async function register(userData: { username: string; email: string; password: string }): Promise<void> {
    try {
        await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/register`, userData);
        
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Registration failed');
    }
}
