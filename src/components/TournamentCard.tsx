import { TournamentProps } from '@/lib/props'
import Link from 'next/link'

const TournamentCard = ({details}: {details: TournamentProps}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Ongoing':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Completed':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="group">
      <Link href={`tournament/${details.id}`}>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {details.name}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(details.status)}`}>
                {details.status}
              </span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{details.startdate}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium">{details.game}</span>
              </div>
            </div>
          </div>
          <div className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-100">
            <span className="text-sm text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default TournamentCard
