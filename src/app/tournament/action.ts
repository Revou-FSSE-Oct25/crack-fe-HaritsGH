'use server'

import { createTournament, getTournamentDetails, getTournamentList } from "@/lib/tournament"
import { getTournamentBracketScore } from "@/lib/scores"
import { callForRefresh } from "@/lib/refresh"

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