'use client';

import Header from '@/components/Header'
import TournamentCard from '@/components/TournamentCard'
import { useEffect, useState } from 'react'
import { TournamentProps } from '@/lib/props'
import { getTournamentListAction } from './action';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';

function TournamentListPage() {
  const { userId } = useUser()
  const [tourneyList, setTourneyList] = useState<TournamentProps[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchTournaments = async () => {
      try{
        const response : TournamentProps[] = await getTournamentListAction()
        setTourneyList(response)
        setLoading(false)
      } catch(error : any) {
        setError(error.message)
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  return (
    <div>
      <Header/>
      <div className="flex justify-between items-center mb-6">
        <h2>Browse Tournaments</h2>
        {userId && (
          <Link
            href="/tournament/create"
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Tournament
          </Link>
        )}
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading && !error && (
        <div className="flex flex-wrap gap-4">
          {tourneyList.map((turni : TournamentProps) => (
            <TournamentCard key={turni.id} details={turni}  />
          ))}
        </div>
      )}
      <p>Page 1 of 10</p>
      <div className="flex gap-2">
        <button>Previous</button>
        <button>Next</button>
      </div>
      <div className="flex gap-2">
        <button>1</button>
        <button>2</button>
        <button>3</button>
        <button>4</button>
        <button>5</button>
      </div>
    </div>
  )
}

export default TournamentListPage
