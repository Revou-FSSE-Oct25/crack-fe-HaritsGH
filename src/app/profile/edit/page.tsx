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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-8">
              <h2 className="text-3xl font-bold text-white">Change Password</h2>
              <p className="text-gray-300 mt-2">Update your password to keep your account secure</p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 space-y-6">
              {isPending && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-200 font-medium">Processing...</p>
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  New Password
                </label>
                <input 
                  id="newPassword" 
                  type="password" 
                  placeholder="Enter new password" 
                  {...register('newPassword', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
                />
                {errors.newPassword && <p className='text-red-500 text-sm mt-1'>New Password is required</p>}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input 
                  id="confirmPassword" 
                  type="password" 
                  placeholder="Confirm new password" 
                  {...register('confirmPassword', { required: true })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-200"
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
                  className="block w-full text-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfileEditPage