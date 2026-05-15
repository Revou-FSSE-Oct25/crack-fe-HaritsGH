'use server'

import { redirect } from "next/navigation"
import { editTournamentDetails } from "@/lib/tournament"

export async function editTournamentDetailsAction(accessToken: string, id: string, data: any) {
  await editTournamentDetails(accessToken, id, data)
  redirect(`/tournament/${id}`)
}