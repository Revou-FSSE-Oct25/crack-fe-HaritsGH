import { TournamentProps } from '@/app/lib/tournament'
import Link from 'next/link'

const TournamentCard = ({details}: {details: TournamentProps}) => {
  return (
    <div key={details.id} className="border-1 border-gray-300 p-4">
      <Link href={`tournament/${details.id}`}>
        <p>{details.name}</p>
        <p>{details.startdate}</p>
        <p>{details.status}</p>
        <p>{details.game}</p>
      </Link>
    </div>
  )
}

export default TournamentCard
