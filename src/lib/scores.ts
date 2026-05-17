import axios from "axios";

export async function getTournamentBracketScore(tournamentId: string) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/bracket-score/${tournamentId}`);
    return response.data.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to fetch tournament bracket scores');
  }
}