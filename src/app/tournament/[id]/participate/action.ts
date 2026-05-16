'use server'

import { participate, updateParticipation, cancelParticipation, getParticipatedTournament, getParticipants } from "@/lib/participation";
import { redirect } from "next/navigation";
import { ParticipationProps } from "@/lib/props";
import { callForRefresh } from "@/lib/refresh";

export async function getParticipantsAction(tournamentId: string) {
    try {
        return await getParticipants(tournamentId);
    } catch (error: any) {
        return { error: error.message || 'Failed to fetch tournament participants' };
    }
}

export async function getParticipatedTournamentAction() {
    try {
        return await getParticipatedTournament();
    } catch (error: any) {
        if (error.response?.status === 401) {
            return await callForRefresh(async () => {
                return await getParticipatedTournament();
            });
        }
        return { error: error.message || 'Failed to fetch participated tournaments' };
    }
}

export async function participateAction(tournamentId: string, data: ParticipationProps) {
    try {
        await participate(tournamentId, data);
    } catch (error: any) {
        if (error.response?.status === 401) {
            await callForRefresh(async () => {
                await participate(tournamentId, data);
            });
        } else {
            return { error: error.message || 'Failed to participate' };
        }
    }
    redirect(`/tournament/${tournamentId}`);
}

export async function editParticipationAction(tournamentId: string, data: ParticipationProps) {
    try {
        await updateParticipation(tournamentId, data);
    } catch (error: any) {
        if (error.response?.status === 401) {
            await callForRefresh(async () => {
                await updateParticipation(tournamentId, data);
            });
        } else {
            return { error: error.message || 'Failed to update participation' };
        }
    }
    redirect(`/tournament/${tournamentId}`);
}

export async function cancelParticipationAction(tournamentId: string) {
    try {
        await cancelParticipation(tournamentId);
    } catch (error: any) {
        if (error.response?.status === 401) {
            await callForRefresh(async () => {
                await cancelParticipation(tournamentId);
            });
        } else {
            return { error: error.message || 'Failed to cancel participation' };
        }
    }
    redirect(`/tournament/${tournamentId}`);
}
