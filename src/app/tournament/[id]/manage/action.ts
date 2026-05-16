'use server'

import { redirect } from "next/navigation"
import { deleteTournament, editTournamentDetails, updateTournamentAdmins } from "@/lib/tournament"
import { getUsernamesById, getUserSearch } from "@/lib/user"
import { callForRefresh } from "@/lib/refresh"

export async function editTournamentDetailsAction(id: string, data: any) {
  if (!data.startTime || !data.endTime) {
    console.error('Missing startTime or endTime')
    return { error: 'Start time and end time are required' }
  }
  data.startDate = data.startDate + 'T' + data.startTime + ':00Z'
  data.endDate = data.endDate + 'T' + data.endTime + ':00Z'
  delete data.startTime
  delete data.endTime
  delete data.id
  delete data.owner
  delete data.admins
  try {
    await editTournamentDetails(id, data)
    redirect(`/tournament/${id}`)
  } catch (error: any) {
    if (error.response?.status === 401) {
      await callForRefresh(async () => {
        await editTournamentDetails(id, data)
      })
      redirect(`/tournament/${id}`)
    } else {
      return { error: error.message || 'Failed to edit tournament details' };
    }
  }
}

export async function getUserSearchAction(query: string) {
  try {
    const users = await getUserSearch(query)
    return users
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await getUserSearch(query)
      })
    } else {
      return { error: error.message || 'Failed to search users' };
    }
  }
}

export async function getUsernamesByIdAction(ids: number[]) {
  try {
    const users = await getUsernamesById(ids)
    return users
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await getUsernamesById(ids)
      })
    } else {
      return { error: error.message || 'Failed to get user by ids' };
    }
  }
}

export async function updateAdminsAction(tournamentId: string, admins: {id: number, username: string}[]) {
  try {
    const newAdmins = await updateTournamentAdmins(tournamentId, admins)
    return newAdmins
  } catch (error: any) {
    if (error.response?.status === 401) {
      return await callForRefresh(async () => {
        return await updateTournamentAdmins(tournamentId, admins)
      })
    } else {
      return { error: error.message || 'Failed to update admins' };
    }
  }
}

export async function deleteTournamentAction(tournamentId: string) {
  try {
    await deleteTournament(tournamentId)
    redirect('/dashboard')
  } catch (error: any) {
    if (error.response?.status === 401) {
      await callForRefresh(async () => {
        await deleteTournament(tournamentId)
      })
      redirect('/dashboard')
    } else {
      return { error: error.message || 'Failed to delete tournament' };
    }
  }
}