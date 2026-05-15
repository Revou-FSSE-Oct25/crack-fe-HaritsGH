'use client'

import Header from '@/components/Header'
import React from 'react'
import TournamentCard from '@/components/TournamentCard';
import Link from 'next/link';
import { useUser } from '@/app/context/UserContext';

function UserDashboardPage() {
  const { userId } = useUser()
  const tourneyList = [
    {
      id : 1,
      name : 'turni',
      startdate : '17-10-1994',
      status : 'Upcoming',
      game : 'Mahjong',
    },
    {
      id : 2,
      name : 'turni2',
      startdate : '17-10-1994',
      status : 'Ongoing',
      game : 'Mahjong',
    },
    {
      id : 3,
      name : 'turni3',
      startdate : '17-10-1994',
      status : 'Completed',
      game : 'Mahjong',
    },
  ];

  // const priviledgedTourney = axios.get('/api/tournaments/admins');
  // const participatedTourney = axios.get('/api/participant');
  const priviledgedTourney = [
    {
      id : 2,
      name : 'turni2',
      startdate : '17-10-1994',
      status : 'Ongoing',
      game : 'Mahjong',
    }
  ];
  const participatedTourney = [
    {
      id : 1,
      name : 'turni',
      startdate : '17-10-1994',
      status : 'Upcoming',
      game : 'Mahjong',
    },
    {
      id : 3,
      name : 'turni3',
      startdate : '17-10-1994',
      status : 'Completed',
      game : 'Mahjong',
    }
  ];
  return (
    <>
      <Header/>
      <div className="flex justify-between items-center mb-6">
        <h2>Dashboard</h2>
        {userId && (
          <Link
            href="/tournament/create"
            className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Create Tournament
          </Link>
        )}
      </div>
      <p>Welcome to your dashboard</p>
      {priviledgedTourney.length > 0 && <div>
        <h3>Your Tournaments</h3>
        {
          priviledgedTourney.map((turni) => (
            <TournamentCard key={turni.id} details={turni}/>
          ))
        }
      </div>}
      <div>
        <h3>Upcoming Tournaments</h3>
        {
          participatedTourney.map((turni) => (
            turni.status === 'Upcoming' && (
              <TournamentCard key={turni.id} details={turni}/>
            )
          ))
        }
      </div>
      <div>
        <h3>Ongoing Tournaments</h3>
        {
          participatedTourney.map((turni) => (
            turni.status === 'Ongoing' && (
              <TournamentCard key={turni.id} details={turni}/>
            )
          ))
        }
      </div>
      <div>
        <h3>Past Tournaments</h3>
        {
          participatedTourney.map((turni) => (
            turni.status === 'Completed' && (
              <TournamentCard key={turni.id} details={turni}/>
            )
          ))
        }
      </div>
    </>
  )
}

export default UserDashboardPage
