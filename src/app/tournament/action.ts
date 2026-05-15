'use server'

import { createTournament, getTournamentDetails, getTournamentList } from "@/lib/tournament"

export async function getTournamentListAction() {
  return await getTournamentList()
}

export async function getTournamentDetailsAction(id: string) {
  return await getTournamentDetails(id)
}

export async function createTournamentAction(accessToken: string, data: {
  name: string;
  game: string;
  startDate: string;
  endDate?: string;
  utc: string;
}) {
  return await createTournament(accessToken, data)
}