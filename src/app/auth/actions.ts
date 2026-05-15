'use server';

import { getAccessTokenCookie, refreshAccessTokenCookie } from '@/lib/auth';

export async function getAccessTokenAction() {
  try {
    const token = await getAccessTokenCookie();
    return token;
  } catch (error) {
    console.error('Failed to get access token:', error);
    return null;
  }
}

export async function refreshAccessTokenAction() {
  try {
    const newToken = await refreshAccessTokenCookie();
    return newToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    return null;
  }
}
