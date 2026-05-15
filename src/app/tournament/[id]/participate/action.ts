'use server'

import { participate, updateParticipation, cancelParticipation, getParticipatedTournament, getParticipants } from "@/lib/participation";
import { redirect } from "next/navigation";
import { ParticipationProps } from "@/lib/props";

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
        return { error: error.message || 'Failed to fetch participated tournaments' };
    }
}

export async function participateAction(tournamentId: string, data: ParticipationProps) {
    try {
        await participate(tournamentId, data);
    } catch (error: any) {
        return { error: error.message || 'Failed to participate' };
    }
    redirect(`/tournament/${tournamentId}`);
}

export async function editParticipationAction(tournamentId: string, data: ParticipationProps) {
    try {
        await updateParticipation(tournamentId, data);
    } catch (error: any) {
        return { error: error.message || 'Failed to update participation' };
    }
    redirect(`/tournament/${tournamentId}`);
}

export async function cancelParticipationAction(tournamentId: string) {
    try {
        await cancelParticipation(tournamentId);
    } catch (error: any) {
        return { error: error.message || 'Failed to cancel participation' };
    }
    redirect(`/tournament/${tournamentId}`);
}
