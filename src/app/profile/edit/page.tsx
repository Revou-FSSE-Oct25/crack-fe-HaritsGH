'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { changePasswordAction } from '../action'
import { PasswordEditProps } from '@/lib/props'

const ProfileEditPage = () => {
  const { register, formState: { errors }, handleSubmit } = useForm<PasswordEditProps>()
  const [isPending, startTransition] = useTransition()

  const onSubmit = (data: PasswordEditProps) => {
    startTransition(async () => {
      // TODO: Call API to change password
      await changePasswordAction(data)
    })
  }
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Change Password</h1>
              <p className="text-gray-600">Update your password to keep your account secure</p>
            </div>
          </div>

          <div className="max-w-md">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {isPending && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium">Processing...</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input 
                    id="newPassword" 
                    type="password" 
                    placeholder="Enter new password" 
                    {...register('newPassword', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.newPassword && <p className='text-red-500 text-sm mt-1'>New Password is required</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input 
                    id="confirmPassword" 
                    type="password" 
                    placeholder="Confirm new password" 
                    {...register('confirmPassword', { required: true })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200"
                  />
                  {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>Confirm New Password is required</p>}
                </div>
                
                <div className="pt-4 space-y-4">
                  <button 
                    type="submit"
                    disabled={isPending}
                    className="w-full px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPending ? 'Saving...' : 'Save Password'}
                  </button>
                  
                  <Link 
                    href="/profile"
                    className="block w-full text-center px-6 py-3 text-gray-600 hover:text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition-all duration-200"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileEditPage