'use client'

import { useForm } from 'react-hook-form'
import Header from '@/components/Header'
import { useAuth } from '@/app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createTournamentAction } from '../action'

interface TournamentFormData {
  name: string
  game: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  utc: string
}

interface CreateTournamentRequest {
  name: string
  game: string
  startDate: string
  endDate?: string
  utc: string
}

const TournamentCreatePage = () => {
  const today = new Date().toISOString().split('T')[0]
  const { register, formState: { errors }, handleSubmit } = useForm<TournamentFormData>({
    defaultValues: {
      startDate: today,
      startTime: '00:00',
      endDate: today,
      endTime: '23:59',
      utc: '+0'
    }
  })
  const { accessToken } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (data: TournamentFormData) => {
    setIsLoading(true)
    setError(null)

    try {
      const startDate = `${data.startDate}T${data.startTime}:00Z`
      const requestData: CreateTournamentRequest = {
        name: data.name,
        game: data.game,
        startDate: startDate,
        utc: data.utc
      }

      if (data.endDate && data.endTime) {
        const endDate = `${data.endDate}T${data.endTime}:00Z`
        requestData.endDate = endDate
      }

      const tournament = await createTournamentAction(requestData)
      router.push(`/tournament/${tournament.id}`)
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Tournament</h1>
          <p className="text-gray-600 mb-8">Fill in the details to create a new tournament</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Tournament Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name', { required: 'Tournament name is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter tournament name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="game" className="block text-sm font-medium text-gray-700 mb-2">
                Game
              </label>
              <input
                id="game"
                type="text"
                {...register('game', { required: 'Game is required' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="Enter game name"
              />
              {errors.game && (
                <p className="mt-1 text-sm text-red-600">{errors.game.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                {...register('startDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                {...register('startTime')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {errors.startTime && (
                <p className="mt-1 text-sm text-red-600">{errors.startTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {errors.endDate && (
                <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                {...register('endTime')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
              />
              {errors.endTime && (
                <p className="mt-1 text-sm text-red-600">{errors.endTime.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="utc" className="block text-sm font-medium text-gray-700 mb-2">
                UTC Offset
              </label>
              <input
                id="utc"
                type="text"
                {...register('utc')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent outline-none transition-all duration-200"
                placeholder="e.g., +07:00"
              />
              {errors.utc && (
                <p className="mt-1 text-sm text-red-600">{errors.utc.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? 'Creating Tournament...' : 'Create Tournament'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TournamentCreatePage