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
        const response = await getTournamentListAction()
        setTourneyList(response || [])
        setLoading(false)
      } catch(error : any) {
        setError(error.message)
        setLoading(false)
      }
    }
    fetchTournaments()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Tournaments</h1>
            <p className="text-gray-600">Discover and join exciting tournaments</p>
          </div>
          {userId && (
            <Link
              href="/tournament/create"
              className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Create Tournament
            </Link>
          )}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <p className="font-medium">Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {tourneyList.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No tournaments available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {tourneyList.map((turni : TournamentProps) => (
                  <TournamentCard key={turni.id} details={turni} />
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 font-medium">Page 1 of 10</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium">
              Previous
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 font-medium">
              Next
            </button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                  page === 1
                    ? 'bg-gray-900 text-white shadow-md'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentListPage
