'use client'

import { getUsernamesByIdAction, getUserSearchAction, updateAdminsAction } from '@/app/tournament/[id]/manage/action'
import { getTournamentDetailsAction } from '@/app/tournament/action'
import { useState, useEffect } from 'react'

interface User {
  id: number
  username: string
}

interface SearchUserProps {
  tournamentId?: string
  ownerUserId?: number
}

const SearchUser = ({ tournamentId, ownerUserId }: SearchUserProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [admins, setAdmins] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSearch = async () => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([])
      setIsDropdownOpen(false)
      return
    }

    setIsLoading(true)
    try {
      // TODO: Replace with your actual API call
      const userSearchResult = await getUserSearchAction(searchQuery)

      // Filter out users already in admins list
      const filteredData = userSearchResult.filter((user: User) => !admins.some(admin => admin.id === user.id))
      setSearchResults(filteredData)
      setIsDropdownOpen(true)
    } catch (error) {
      console.error('Error searching users:', error)
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch tournament admins on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      if (!tournamentId) return

      try {
        const dataAdminTourney = await getTournamentDetailsAction(tournamentId)
        // Filter out integer IDs, only keep User objects with username
        
        const adminUsers = await getUsernamesByIdAction(dataAdminTourney.admins)
        setAdmins(adminUsers)
      } catch (error) {
        console.error('Error fetching admins:', error)
      }
    }

    fetchAdmins()
  }, [tournamentId])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleUserSelect = (user: User) => {
    setSearchQuery('')
    setIsDropdownOpen(false)
    setAdmins(prev => [...prev, user])
  }

  const handleRemoveAdmin = (adminId: number) => {
    setAdmins(prev => prev.filter(admin => admin.id !== adminId))
  }

  const handleUpdateAdmins = async () => {
    if (!tournamentId) return

    setIsUpdating(true)
    try {
      await updateAdminsAction(tournamentId, admins)
    } catch (error) {
      console.error('Error updating admins:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search username..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {searchResults.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              {user.username}
            </button>
          ))}
        </div>
      )}

      {/* Admins List */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Tournament Admins</h3>
        {admins.length > 0 ? (
          <ul className="space-y-2">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex items-center justify-between px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg"
              >
                {admin.username}
                <button
                  onClick={() => handleRemoveAdmin(admin.id)}
                  disabled={admin.id === ownerUserId}
                  className={`px-3 py-1 text-sm rounded border ${
                    admin.id === ownerUserId
                      ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                      : 'text-red-600 border-red-200 hover:bg-red-50'
                  }`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No tournament admins.</p>
        )}
        <button
          onClick={handleUpdateAdmins}
          disabled={isUpdating}
          className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {isUpdating ? 'Updating...' : 'Update Admins'}
        </button>
      </div>
    </div>
  )
}

export default SearchUser
