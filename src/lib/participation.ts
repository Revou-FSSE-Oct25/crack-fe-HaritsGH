import axios from "axios";
import { getAccessTokenCookie } from "./auth";

export async function getParticipants(tournamentId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/participant/${tournamentId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch participant data');
  }
}

export async function getParticipatedTournament() {
  try {
    const accessToken = await getAccessTokenCookie();
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/participant`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch participated tournament data');
  }
}

export async function participate(tournamentId: string, data: { alias: string; prefix: string }) {
  try {
    const accessToken = await getAccessTokenCookie();
    await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/participant/${tournamentId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to participate');
  }
}

export async function updateParticipation(tournamentId: string, data: { alias: string; prefix: string }) {
  try {
    const accessToken = await getAccessTokenCookie();
    await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/participant/${tournamentId}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update participation');
  }
}

export async function cancelParticipation(tournamentId: string) {
  try {
    const accessToken = await getAccessTokenCookie();
    await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/participant/${tournamentId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to cancel participation');
  }
}