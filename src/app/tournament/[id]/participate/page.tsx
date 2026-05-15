'use client'

import Header from "@/components/Header"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import { editParticipationAction, cancelParticipationAction, participateAction, getParticipantsAction } from "./action"
import { ParticipationProps } from "@/lib/props"
import { useUser } from "@/app/context/UserContext"

const TournamentParticipatePage = () => {
  const params = useParams()
  const router = useRouter()
  const { register, formState: { errors }, handleSubmit } = useForm<ParticipationProps>()
  const { userId } = useUser()
  const [alias, setAlias] = useState('')
  const [prefix, setPrefix] = useState('')
  const [isParticipated, setIsParticipated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParticipantData = async () => {
      try {
        const result = await getParticipantsAction(params.id as string)
        const participant = result.find((p: any) => p.userId === userId)
        if (participant) {
          setIsParticipated(true)
          setAlias(participant.alias)
          setPrefix(participant.prefix)
        }
      } catch (error: any) {
        setFormError(error.message || 'Failed to load participant data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchParticipantData()
  }, [])

  const onSubmit = (data: ParticipationProps, isParticipated: boolean) => {
    setFormError(null)
    startTransition(async () => {
      const result = isParticipated ? await editParticipationAction(params.id as string, data) : await participateAction(params.id as string, data)
      if (result?.error) {
        setFormError(result.error)
      }
    })
  }

  const handleCancel = () => {
    router.push(`/tournament/${params.id}`)
  }

  const handleWithdraw = () => {
    setFormError(null)
    startTransition(async () => {
      const result = await cancelParticipationAction(params.id as string)
      if (result?.error) {
        setFormError(result.error)
      }
    })
  }

  if (isLoading) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center px-4 py-12">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Header />
      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-200">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">{isParticipated ? 'Edit Participation' : 'Participate'}</h2>
            <p className="text-gray-600 text-center mb-8">{isParticipated ? 'Update your tournament participation details' : 'Join the tournament by providing your details'}</p>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit((data) => onSubmit(data, isParticipated))} className="space-y-6">
              <div>
                <label htmlFor="alias" className="block text-sm font-medium text-gray-700 mb-2">Alias</label>
                <input
                  type="text"
                  placeholder="Enter your alias"
                  {...register('alias', { required: true, value: alias })}
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
                {errors.alias && <p className='text-red-600 text-sm mt-1'>Alias is required</p>}
              </div>

              <div>
                <label htmlFor="prefix" className="block text-sm font-medium text-gray-700 mb-2">Prefix</label>
                <input
                  type="text"
                  placeholder="Enter your prefix"
                  {...register('prefix', { value: prefix })}
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                type='submit'
                disabled={isPending}
                className="w-full py-3 px-4 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </form>

            <div className="mt-6 space-y-3">
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="w-full py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              {isParticipated && <button
                onClick={handleWithdraw}
                disabled={isPending}
                className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Withdraw Participation
              </button>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentParticipatePage