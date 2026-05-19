import axios from "axios";
import { getAccessTokenCookie } from "./auth";

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

export async function updateMatchScore(tournamentId: string, matchId: number, scores: number[], userIds?: number[], winnerId?: number | null) {
  const accessToken = await getAccessTokenCookie();
  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bracket-score/${tournamentId}`,
      { matchId, userIds, scores, winnerId },
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
    throw new Error('Failed to update match score');
  }
}

export async function updateWinnerNextRoundMatch(tournamentId: string, nextRoundMatchId: number, userIds?: number[], winnerId?: number | null) {
  const accessToken = await getAccessTokenCookie();

  try {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/bracket-score/${tournamentId}`,
      { matchId: nextRoundMatchId, userIds: [winnerId, ] },
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
    throw new Error('Failed to update match winner');
  }
}