import Header from '@/components/Header'
import React from 'react'

function TournamentPage() {
  return (
    <div>
      <Header/>
      <div className='flex justify-between'>
        <div>
          <p>Details</p>
        </div>
        <div>
          <p>Sidebar</p>
          <p>Regisitration Info if already Login</p>
          <button>Cancel Registration</button>
        </div>
      </div>
    </div>
  )
}

export default TournamentPage
