'use client'

import Bracket from '@/components/Bracket'
import Header from '@/components/Header'
import TournamentSidebar from '@/components/TournamentSidebar'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useUser } from '@/app/context/UserContext'
import { useEffect, useState } from 'react'
import { getParticipantsAction } from './participate/action'
import { getTournamentDetailsAction, startTournamentAction, finishTournamentAction } from '../action'

function TournamentPage() {
  const params = useParams()
  const { userId } = useUser()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tournamentDetails, setTournamentDetails] = useState<any>({})
  const [tournamentParticipants, setTournamentParticipants] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined)

  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getUTCDate().toString().padStart(2, '0')
    const month = date.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' })
    const year = date.getUTCFullYear()
    const hours = date.getUTCHours().toString().padStart(2, '0')
    const minutes = date.getUTCMinutes().toString().padStart(2, '0')
    const seconds = date.getUTCSeconds().toString().padStart(2, '0')
    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`
  }

  useEffect(() => {
    const fetchData = async () => {
      const details = await getTournamentDetailsAction(params.id as string)
      setTournamentDetails(details)
      const participants = await getParticipantsAction(params.id as string)
      setTournamentParticipants(participants)
      
      // Calculate currentUser when participants are fetched
      if (userId && participants.length > 0) {
        const currentUserParticipant = participants.find((p: any) => p.userId === userId);
        setCurrentUser(currentUserParticipant ? `${currentUserParticipant.prefix} | ${currentUserParticipant.alias}` : undefined);
      } else {
        setCurrentUser(undefined);
      }
      
      setIsLoading(false)
    }
    fetchData()
  }, [userId])

  const pairArray = <T,>(arr: T[]): T[][] => {
    const result: T[][] = [];
    const workingArray = arr.length % 2 === 0 ? arr : [0 as T, ...arr];
    for (let i = 0; i < workingArray.length; i += 2) {
      result.push([workingArray[i], workingArray[i + 1]]);
    }
    return result.reverse();
  };

  const handleStartTournament = async () => {
    const processedUserIds = pairArray(tournamentParticipants.map((p: any) => p.userId))
    const initialScores = []
    for (let i = 0; i < tournamentParticipants.length - 1; i++) {
      initialScores.push({
        tournamentId: Number(params.id),
        matchId: i + 1,
        userIds: processedUserIds[i]
      })
    }
    // console.log(initialScores)
    const result = await startTournamentAction(params.id as string, initialScores)
    
    if (result?.error) {
      alert(result.error)
      return
    }
    // Refresh tournament details to update status
    const details = await getTournamentDetailsAction(params.id as string)
    setTournamentDetails(details)
  }

  const handleFinishTournament = async () => {
    const result = await finishTournamentAction(params.id as string)
    if (result?.error) {
      alert(result.error)
      return
    }
    // Refresh tournament details to update status
    const details = await getTournamentDetailsAction(params.id as string)
    setTournamentDetails(details)
  }

  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Tournament Content */}
          {!isLoading && (
            <div className="space-y-6">
              {/* Tournament Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{tournamentDetails.name}</h1>
                    <p className="text-gray-600">{tournamentDetails.game}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    {(userId === tournamentDetails.owner || tournamentDetails.admins?.includes(userId)) && 
                      tournamentDetails.status === 'Upcoming' && (
                        <button
                          onClick={handleStartTournament}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                        >
                          Start Tournament
                        </button>
                      )
                    }
                    {(userId === tournamentDetails.owner || tournamentDetails.admins?.includes(userId)) && 
                      tournamentDetails.status === 'Ongoing' && (
                        <button
                          onClick={handleFinishTournament}
                          className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                        >
                          Finish Tournament
                        </button>
                      )
                    }
                    {(userId === tournamentDetails.owner || tournamentDetails.admins?.includes(userId)) && 
                      <Link
                        href={`/tournament/${tournamentDetails.id}/manage`}
                        className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                      >
                        Edit Tournament
                      </Link>
                    }
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Date</p>
                    <p className="text-gray-900 font-medium">{formatDate(tournamentDetails.startDate)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Timezone</p>
                    <p className="text-gray-900 font-medium">{tournamentDetails.utc}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      tournamentDetails.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                      tournamentDetails.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {tournamentDetails.status}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">Game</p>
                    <p className="text-gray-900 font-medium">{tournamentDetails.game}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Participants Section */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Participants
                  </h2>
                  {tournamentParticipants && tournamentParticipants.length > 0 ? (
                    <div className="grid grid-cols-6 gap-2">
                      {tournamentParticipants.map((participant: any) => (
                        <div key={participant.userId} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
                          <p className="font-bold text-gray-900">{participant.prefix} | {participant.alias}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p>No participants yet</p>
                    </div>
                  )}
                </div>

                {/* Sidebar */}
                {params.id && (userId || tournamentDetails.status === 'Upcoming') && (
                  <div className="lg:w-80">
                    <TournamentSidebar tournamentId={params.id} tournamentStatus={tournamentDetails.status} />
                  </div>
                )}
              </div>

              {/* Bracket Section */}
              {tournamentDetails.status !== 'Upcoming' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Tournament Bracket
                  </h2>
                  <Bracket 
                    participants={tournamentParticipants}
                    currentUser={currentUser}
                    tournamentId={params.id as string}
                    isAdmin={userId === tournamentDetails.owner || tournamentDetails.admins?.includes(userId)}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TournamentPage
