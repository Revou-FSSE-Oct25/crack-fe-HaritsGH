'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { getUserProfileAction, deactivateAccountAction } from './action'
import { useTransition } from 'react'

const ProfilePage = () => {
  const [userProfile, setUserProfile] = useState({
    username: '',
    email: ''
  })
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfileAction()
        setUserProfile(userProfile)
      } catch (error) {
        console.error(error)
      }
    }
    fetchData()
  }, [])

  const handleDeactivateAccount = () => {
    startTransition(async () => {
      await deactivateAccountAction()
    })
  }
  
  return (
    <>
      <Header/>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-8">
              <h2 className="text-3xl font-bold text-white">Profile</h2>
              <p className="text-gray-300 mt-2">Manage your account settings</p>
            </div>
            
            <div className="px-6 py-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Username</label>
                <p className="text-lg text-gray-900 dark:text-white font-medium">{userProfile.username}</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Email</label>
                <p className="text-lg text-gray-900 dark:text-white font-medium">{userProfile.email}</p>
              </div>
              
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                <Link 
                  href="/profile/edit"
                  className="block w-full text-center px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Change Password
                </Link>
                
                <button 
                  onClick={() => setShowDeactivateModal(true)}
                  className="block w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDeactivateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-6">
              <h3 className="text-2xl font-bold text-white">Deactivate Account</h3>
            </div>
            
            <div className="px-6 py-6 space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to deactivate your account? This action cannot be undone.
              </p>
              
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg transition-all duration-200"
                  disabled={isPending}
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleDeactivateAccount}
                  disabled={isPending}
                  className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? 'Deactivating...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfilePage
