'use server'

import { createTournament, getTournamentDetails, getTournamentList, startTournament, finishTournament } from "@/lib/tournament"
import { getTournamentBracketScore, updateMatchScore } from "@/lib/scores"
import { callForRefresh } from "@/lib/refresh"
import { getAccessTokenCookie } from "@/lib/auth"

export async function getTournamentListAction() {
  return await getTournamentList()
}

export async function getTournamentDetailsAction(id: string) {
  return await getTournamentDetails(id)
}

export async function getTournamentBracketScoreAction(id: string) {
  return await getTournamentBracketScore(id)
}

export async function createTournamentAction(data: {
  name: string;
  game: string;
  startDate: string;
  endDate?: string;
  utc: string;
}) {
  try {
    return await createTournament(data)
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await createTournament(data)
      })
    } else {
      return { error: error.message || 'Failed to create tournament' };
    }
  }
}

export async function startTournamentAction(id: string, participantList:{tournamentId: number, matchId: number, userIds: number[]}[]) {
  try {
    return await startTournament(id, participantList)
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await startTournament(id, participantList)
      })
    } else {
      return { error: error.message || 'Failed to start tournament' };
    }
  }
}

export async function finishTournamentAction(id: string) {
  try {
    return await finishTournament(id)
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await finishTournament(id)
      })
    } else {
      return { error: error.message || 'Failed to finish tournament' };
    }
  }
}

export async function updateMatchScoreAction(tournamentId: string, matchId: string, scores: number[], userIds?: number[], winnerId?: number | null) {
  const accessToken = await getAccessTokenCookie();
  try {
    return await updateMatchScore(tournamentId, Number(matchId), scores, userIds, winnerId)
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await updateMatchScore(tournamentId, Number(matchId), scores, userIds, winnerId)
      })
    } else {
      return { error: error.message || 'Failed to update match score' };
    }
  }
}