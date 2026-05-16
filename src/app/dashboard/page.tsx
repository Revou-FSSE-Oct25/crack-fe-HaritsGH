'use client'

import Header from '@/components/Header'
import React, { useState, useEffect } from 'react'
import TournamentCard from '@/components/TournamentCard';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';
import { getTournamentsAdminedAction, getParticipatedTournamentsAction } from './action';
import { TournamentProps } from '@/lib/props';

function UserDashboardPage() {
  const { userId } = useUser()
  const [priviledgedTourney, setPriviledgedTourney] = useState<TournamentProps[]>([]);
  const [participatedTourney, setParticipatedTourney] = useState<TournamentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [adminData, participatedData] = await Promise.all([
          getTournamentsAdminedAction(),
          getParticipatedTournamentsAction()
        ]);
        
        if (adminData && !('error' in adminData)) {
          setPriviledgedTourney(adminData);
        }
        if (participatedData && !('error' in participatedData)) {
          setParticipatedTourney(participatedData);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load tournaments');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchData();
    }
  }, [userId]);
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Welcome to your tournament dashboard</p>
            </div>
            {userId && (
              <Link
                href="/tournament/create"
                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
              >
                Create Tournament
              </Link>
            )}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Tournament Sections */}
          {!loading && !error && (
            <div className="space-y-8">
              {/* Your Tournaments */}
              {priviledgedTourney.length > 0 && (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Your Tournaments
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {priviledgedTourney.map((turni) => (
                        <TournamentCard key={turni.id} details={turni}/>
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-gray-700"></div> 
                </>
              )}

              {/* Upcoming Tournaments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Upcoming Tournaments
                </h2>
                {participatedTourney.filter((turni) => turni.status === 'Upcoming').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participatedTourney
                      .filter((turni) => turni.status === 'Upcoming')
                      .map((turni) => (
                        <TournamentCard key={turni.id} details={turni}/>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p>No upcoming tournaments</p>
                  </div>
                )}
              </div>

              {/* Ongoing Tournaments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ongoing Tournaments
                </h2>
                {participatedTourney.filter((turni) => turni.status === 'Ongoing').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participatedTourney
                      .filter((turni) => turni.status === 'Ongoing')
                      .map((turni) => (
                        <TournamentCard key={turni.id} details={turni}/>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No ongoing tournaments</p>
                  </div>
                )}
              </div>

              {/* Past Tournaments */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Past Tournaments
                </h2>
                {participatedTourney.filter((turni) => turni.status === 'Completed').length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {participatedTourney
                      .filter((turni) => turni.status === 'Completed')
                      .map((turni) => (
                        <TournamentCard key={turni.id} details={turni}/>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No past tournaments</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default UserDashboardPage
