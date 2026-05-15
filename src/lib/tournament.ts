import axios from "axios";

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

export async function createTournament(accessToken: string, data: {
  name: string;
  game: string;
  startDate: string;
  endDate?: string;
  utc: string;
}) {
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

export async function editTournamentDetails(accessToken: string, id: string, data: any) {
  try {
    const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/tournament/${id}`, data, {
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
