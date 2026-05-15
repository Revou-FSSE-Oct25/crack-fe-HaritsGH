'use client';

import { logoutAction } from "@/app/login/action";
import Link from "next/link"
import { useTransition, useEffect, useState } from "react"
import { useAuth } from "@/app/context/AuthContext"
import axios from "axios"
import { useUser } from "@/app/context/UserContext";
import { useParams } from "next/navigation";

const Header : React.FC = () => {
  const params = useParams()
  const { accessToken, setAccessToken, refreshAccessTokenState } = useAuth()
  const { username, setUserInfo, clearUserInfo } = useUser()
  const [isPending, startTransition] = useTransition()
  const [headerUsername, setHeaderUsername] = useState('')
  
  useEffect(() => {
    const fetchUsername = async () => {
      if (accessToken) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/user`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          setUserInfo(response.data.data.id, response.data.data.username)
          setHeaderUsername(response.data.data.username)
        } catch (error: any) {
          if (error.response?.status === 401) {
            try {
              await refreshAccessTokenState();
              // The useEffect will re-run with the new accessToken, so no need to retry here
            } catch (refreshError) {
              clearUserInfo()
            }
          } else {
            console.error('Failed to fetch user:', error)
          }
        }
      } else {
        // If accessToken is null, try to refresh it using refreshToken cookie
        try {
          await refreshAccessTokenState();
          // The useEffect will re-run with the new accessToken
        } catch (refreshError) {
          clearUserInfo()
        }
      }
    }
    fetchUsername();
  }, [accessToken, params]);

  const handleLogout = () => {
    startTransition(async () => {
      clearUserInfo()
      setAccessToken(null)
      await logoutAction()
    })
  }
  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={'/'} className="flex-shrink-0">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent hover:from-gray-800 hover:to-black transition-all duration-200">
              Noartumnent
            </h1>
          </Link>

          <div className="flex items-center gap-6">
            {headerUsername ? (
              <div className="flex items-center gap-6">
                <span className="text-gray-700 font-medium hidden sm:block">
                  Hi, <span className="font-semibold">{headerUsername}</span>
                </span>
                <Link 
                  href={'/dashboard'} 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
                <Link 
                  href={'/profile'} 
                  className="text-gray-600 hover:text-gray-900 font-medium transition-colors duration-200"
                >
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  disabled={isPending}
                  className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isPending ? 'Logging out...' : 'Logout'}
                </button>
              </div>
            ) : (
              <Link 
                href={'/login'} 
                className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-medium rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
