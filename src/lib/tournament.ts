import axios from "axios";
import { getAccessTokenCookie } from "./auth";

export async function getTournamentList() {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch tournament list');
  }
}

export async function getTournamentDetails(id: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${id}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch tournament details');
  }
}

export async function createTournament(data: {
  name: string;
  game: string;
  startDate: string;
  endDate?: string;
  utc: string;
}) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tournament/`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create tournament');
  }
}

export async function editTournamentDetails(id: string, data: {
  name?: string;
  game?: string;
  startDate?: string;
  endDate?: string;
  utc?: string;
}) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.patch(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to edit tournament details');
  }
}

export async function deleteTournament(id: string) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to delete tournament');
  }
}

export async function updateTournamentAdmins(tournamentId: string, admins: {id: number, username: string}[]) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${tournamentId}/admins`,  {admins}, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to update tournament admins');
  }
}

export async function getTournamentsAdmined() {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/check-for-admin`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch admin tournaments');
  }
}