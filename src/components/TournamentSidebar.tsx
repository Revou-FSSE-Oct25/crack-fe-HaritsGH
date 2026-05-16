'use client'

import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getParticipatedTournamentAction } from '@/app/tournament/[id]/participate/action'

interface TournamentSidebarProps {
  tournamentId: string | string[]
  tournamentStatus: string
}

interface ParticipantData {
  alias: string
  prefix: string
}

export default function TournamentSidebar({ tournamentId, tournamentStatus }: TournamentSidebarProps) {
  const { accessToken, refreshAccessTokenState } = useAuth()
  const pathname = usePathname()
  const [isParticipating, setIsParticipating] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [participantData, setParticipantData] = useState<ParticipantData | null>(null)

  useEffect(() => {
    const checkParticipation = async () => {
      try {
        const response = await getParticipatedTournamentAction() // array of int for participants
        if (Array.isArray(response)) {
          const currentParticipant = response.find((p: any) => p.tournamentId === Number(tournamentId))

          if (currentParticipant) {
            setIsParticipating(true)
            setParticipantData({
              alias: currentParticipant.alias,
              prefix: currentParticipant.prefix
            })
          } else {
            setIsParticipating(false)
          }
        } else {
          setIsParticipating(false)
        }
      } catch (error: any) {
        console.error('Failed to check participation status:', error)
        setIsParticipating(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkParticipation()
  }, [accessToken, tournamentId])


  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-semibold mb-4">Participation Details</h3>
      
      {isLoading ? (
        <p>Loading...</p>
      ) : accessToken ? (
        isParticipating ? (
          <div className="space-y-3">
            {participantData && (
              <div>
                <div className='flex space-x-2'>
                  <p className='w-1/4'><strong>Prefix</strong></p>
                  <p className='w-3/4 text-center'><strong>Alias</strong></p>
                </div>
                <div className="flex space-x-2">
                  <p className='w-1/4 text-center'>{participantData.prefix}</p>
                  <p className='w-3/4 text-center'>{participantData.alias}</p>
                </div>
              </div>
            )}
            {tournamentStatus === 'Upcoming' && (
              <div className="space-y-2">
                <p className="font-semibold mb-4 text-center">Actions</p>
                <Link 
                  href={`/tournament/${tournamentId}/participate`}
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Manage participation
                </Link>
              </div>
            )}
          </div>
        ) : tournamentStatus === 'Upcoming' ? (
          <Link 
            href={`/tournament/${tournamentId}/participate`}
            className="block w-full text-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Participate
          </Link>
        ) : null
      ) : tournamentStatus === 'Upcoming' ? (
        <div className="space-y-3">
          <button 
            disabled
            className="w-full px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
          >
            Participate
          </button>
          <Link 
            href={`/login?redirect=${encodeURIComponent(pathname)}`}
            className="block w-full text-center text-blue-600 hover:underline"
          >
            Login to participate
          </Link>
        </div>
      ) : null}
    </div>
  )
}
