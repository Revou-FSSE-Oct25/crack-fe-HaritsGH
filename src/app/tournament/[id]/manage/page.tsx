'use client';

import Header from '@/components/Header';
import SearchUser from '@/components/SearchUser';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react';
import { getTournamentDetailsAction } from '../../action';
import { deleteTournamentAction, editTournamentDetailsAction } from './action';
import { useUser } from '@/app/context/UserContext';

function TournamentManagePage() {
  const params = useParams()
  const router = useRouter()
  const { userId } = useUser()
  const [isOwner, setIsOwner] = useState<boolean>(false)
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false)

  const { register, formState: { errors }, handleSubmit, reset } = useForm()

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await getTournamentDetailsAction(params.id as string)
        const startDateStr = response?.startDate ? new Date(response.startDate).toISOString().split('T')[0] : ''
        const endDateStr = response?.endDate ? new Date(response.endDate).toISOString().split('T')[0] : ''
        const startTimeStr = response?.startDate ? 
          new Date(response.startDate).getUTCHours().toString().padStart(2, '0') + ':' + 
          new Date(response.startDate).getUTCMinutes().toString().padStart(2, '0') : ''
        const endTimeStr = response?.endDate ? 
          new Date(response.endDate).getUTCHours().toString().padStart(2, '0') + ':' + 
          new Date(response.endDate).getUTCMinutes().toString().padStart(2, '0') : ''
        const details = {
          ...response,
          startDate: startDateStr,
          endDate: endDateStr,
          startTime: startTimeStr,
          endTime: endTimeStr
        }
        setIsOwner(userId === details?.owner)
        reset(details)
      } catch (error) {
        console.error(error)
      } 
    }
    fetchTournamentDetails()
  }, [userId, reset])
  
  const onSubmit = async (data: any) => {
    const result = await editTournamentDetailsAction(params.id as string, data)
    if (result && result.error) {
      console.error(result.error)
    } else {
      router.push(`/tournament/${params.id}`)
    }
  }

  const handleDelete = async () => {
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    const result = await deleteTournamentAction(params.id as string)
    if (result && result.error) {
      console.error(result.error)
    } else {
      router.push('/dashboard')
    }
    setShowDeleteModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Manage Tournament</h2>
          <p className="text-slate-600">Edit tournament details and settings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white border-2 border-slate-200 rounded-xl shadow-lg p-6 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 mb-4">Tournament Details</h3>
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Tournament Name</label>
            <input 
              type="text" 
              placeholder="Tournament Name" 
              {...register('name', { required: true })} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.name && <p className='text-red-500 text-sm mt-1'>Tournament Name is required</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
              <input 
                type="date" 
                {...register('startDate', { required: true })} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.startDate && <p className='text-red-500 text-sm mt-1'>Start Date is required</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
              <input 
                type="date" 
                {...register('endDate', { required: true })} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {errors.endDate && <p className='text-red-500 text-sm mt-1'>End Date is required</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startTime" className="block text-sm font-semibold text-slate-700 mb-2">Start Time</label>
              <input 
                type="time" 
                {...register('startTime')} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-semibold text-slate-700 mb-2">End Time</label>
              <input 
                type="time" 
                {...register('endTime')} 
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="utc" className="block text-sm font-semibold text-slate-700 mb-2">UTC Offset</label>
            <input 
              type="text" 
              placeholder="+0" 
              {...register('utc')} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
            <select 
              {...register('status', { required: true })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>
            {errors.status && <p className='text-red-500 text-sm mt-1'>Status is required</p>}
          </div>

          <div>
            <label htmlFor="game" className="block text-sm font-semibold text-slate-700 mb-2">Game</label>
            <input 
              type="text" 
              placeholder="Game" 
              {...register('game', { required: true })} 
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {errors.game && <p className='text-red-500 text-sm mt-1'>Game is required</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Save Changes
          </button>
        </form>

        {isOwner && (
          <div className="mt-8 bg-white border-2 border-slate-200 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Manage Admins</h3>
            <SearchUser tournamentId={params.id as string} ownerUserId={userId ? Number(userId) : undefined} />
          </div>
        )}
        
        {isOwner && (
          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-700 mb-4">Once you delete a tournament, there is no going back. Please be certain.</p>
            <button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
            >
              Delete Tournament
            </button>
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Tournament</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to delete this tournament? This action cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TournamentManagePage