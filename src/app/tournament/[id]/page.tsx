'use client'

import Bracket from '@/components/Bracket'
import Header from '@/components/Header'
import TournamentSidebar from '@/components/TournamentSidebar'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useUser } from '@/app/context/UserContext'
import { useEffect, useState } from 'react'
import { getParticipantsAction } from './participate/action'
import { getTournamentDetailsAction } from '../action'

function TournamentPage() {
  const params = useParams()
  const { userId } = useUser()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tournamentDetails, setTournamentDetails] = useState<any>({})
  const [tournamentParticipants, setTournamentParticipants] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const details = await getTournamentDetailsAction(params.id as string)
      setTournamentDetails(details)
      const participants = await getParticipantsAction(params.id as string)
      setTournamentParticipants(participants)
      setIsLoading(false)
    }
    fetchData()
  }, [])
  
  return (
    <div>
      <Header/>
      <div className='flex justify-between'>
        <div>
          <div>
            <h2>{tournamentDetails.name}</h2>
            <p>Date: {tournamentDetails.starDate}</p>
            <p>UTC: {tournamentDetails.utc}</p>
            <p>Status: {tournamentDetails.status}</p>
            <p>Game: {tournamentDetails.game}</p>
            {(userId === tournamentDetails.owner || tournamentDetails.admins?.includes(userId)) && 
              <Link href={`/tournament/${tournamentDetails.id}/manage`}>Edit</Link>
            }
          </div>
          <div>
            <h2>Participants</h2>
            <ul>
              {tournamentParticipants?.map((participant: any) => (
                <li key={participant.userId}>{participant.prefix} | {participant.alias}</li>  
              ))}
            </ul>
          </div>
        </div>
        {params.id && <TournamentSidebar tournamentId={params.id} tournamentStatus={tournamentDetails.status} />}
      </div>
      <Bracket/>
    </div>
  )
}

export default TournamentPage
