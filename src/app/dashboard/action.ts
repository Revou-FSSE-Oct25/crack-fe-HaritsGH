'use server';

import { getTournamentDetails, getTournamentsAdmined } from "@/lib/tournament";
import { getParticipatedTournament } from "@/lib/participation";
import { callForRefresh } from "@/lib/refresh";

export async function getTournamentsAdminedAction() {
  try {
    const response = await getTournamentsAdmined();
    return Promise.all(response.tournaments.map(async (tournamentId: number) => {
      const tournament = await getTournamentDetails(tournamentId.toString());
      return tournament;
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        const response = await getTournamentsAdmined();
        return Promise.all(response.tournaments.map(async (tournamentId: number) => {
          const tournament = await getTournamentDetails(tournamentId.toString());
          return tournament;
        }));
      });
    } else {
      return { error: error.message || 'Failed to fetch admin tournaments' };
    }
  }
}

export async function getParticipatedTournamentsAction() {
  try {
    const response = await getParticipatedTournament();
    return Promise.all(response.map(async (participation: any) => {
      const tournamentDetails = await getTournamentDetails(participation.tournamentId.toString());
      return tournamentDetails;
    }));
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        const response = await getParticipatedTournament();
        return Promise.all(response.map(async (participation: any) => {
          const tournamentDetails = await getTournamentDetails(participation.tournamentId.toString());
          return tournamentDetails;
        }));
      });
    } else {
      return { error: error.message || 'Failed to fetch participated tournaments' };
    }
  }
}