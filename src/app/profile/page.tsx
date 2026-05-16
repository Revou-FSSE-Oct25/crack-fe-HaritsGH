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
        const result = await getUserProfileAction()
        if ('error' in result) {
          console.error(result.error)
        } else {
          setUserProfile({
            username: result.username,
            email: result.email
          })
        }
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
              <p className="text-gray-600">Manage your account settings</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Username</p>
                <p className="text-gray-900 font-medium">{userProfile.username}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-gray-900 font-medium">{userProfile.email}</p>
              </div>
              
              <div className="pt-6 border-t border-gray-200 space-y-4">
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-md w-full overflow-hidden">
            <div className="px-6 py-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Deactivate Account
              </h3>
              <p className="text-gray-700 mb-6">
                Are you sure you want to deactivate your account? This action cannot be undone.
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-all duration-200"
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
