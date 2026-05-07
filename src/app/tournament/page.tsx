import Header from '@/components/Header'
import TournamentCard from '@/components/TournamentCard'
import React from 'react'
import { TournamentProps } from '../lib/tournament'

function TournamentListPage() {
  const tourneyList : TournamentProps[] = [
      {
        id : 1,
        title : 'turni',
        date : '17-10-1994',
        location : 'Online',
        game : 'Mahjong',
        imageUrl : ''
      }
    ]
  return (
    <div>
      <Header/>
      {/* {tourneyList.map((turni) => TournamentCard({turni}))} */}
    </div>
  )
}

export default TournamentListPage
