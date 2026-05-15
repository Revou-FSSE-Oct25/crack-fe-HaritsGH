'use client';

import Header from '@/components/Header';
import SearchUser from '@/components/SearchUser';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react';
import { getTournamentDetailsAction } from '../../action';
import { editTournamentDetailsAction } from './action';
import { useAuth } from '@/app/context/AuthContext';
import { useUser } from '@/app/context/UserContext';

function TournamentManagePage() {
  const params = useParams()
  const { accessToken } = useAuth()
  const { userId } = useUser()
  const [tournamentDetails, setTournamentDetails] = useState<any>(null)
  const [isOwner, setIsOwner] = useState<boolean>(false)

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await getTournamentDetailsAction(params.id as string)
        const startDateStr = response?.startDate ? new Date(response.startDate).toISOString().split('T')[0] : ''
        const endDateStr = response?.endDate ? new Date(response.endDate).toISOString().split('T')[0] : ''
        setTournamentDetails({
          ...response,
          startDate: startDateStr,
          endDate: endDateStr
        })
      } catch (error) {
        console.error(error)
      } 
    }
    fetchTournamentDetails()
    setIsOwner(userId === tournamentDetails?.ownerId)
  }, [])
  
  const { register, formState: { errors }, handleSubmit } = useForm()
  const onSubmit = async (data: any) => {
    await editTournamentDetailsAction(accessToken!, params.id as string, data)
  }
  return (
    <div>
      <Header />
      <h2>Manage Tournament</h2>
      <p>Edit tournament details</p>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col'>
        <label htmlFor="name">Tournament Name</label>
        <input type="text" placeholder="Tournament Name" {...register('name', { required: true })} value={tournamentDetails?.name || ''} />
        {errors.name && <p className='text-red-500'>Tournament Name is required</p>}

        <label htmlFor="startDate">Start Date</label>
        <input type="date" placeholder="Start Date" {...register('startDate', { required: true })} value={tournamentDetails?.startDate || ''} />
        {errors.startDate && <p className='text-red-500'>Start Date is required</p>}

        <label htmlFor="endDate">End Date</label>
        <input type="date" placeholder="End Date" {...register('endDate', { required: true })} value={tournamentDetails?.endDate || ''} />

        <label htmlFor="status">Status</label>
        <select {...register('status', { required: true })}>
          <option value="Upcoming">Upcoming</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Completed">Completed</option>
        </select>

        <label htmlFor="game">Game</label>
        <input type="text" placeholder="Game" {...register('game', { required: true })} value={tournamentDetails?.game || ''} />
        {errors.game && <p className='text-red-500'>Game is required</p>}

        <button type="submit">Edit</button>
      </form>

      {isOwner && (
          <>
            <p>Manage Admins</p>
            <SearchUser />
          </>
        )}
      
      <p>Delete Tournament</p>
      {isOwner && <button>Delete</button>}
    </div>
  )
}

export default TournamentManagePage