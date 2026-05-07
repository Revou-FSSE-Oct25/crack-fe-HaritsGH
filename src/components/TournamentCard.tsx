import { TournamentProps } from '@/app/lib/tournament'
import Image from 'next/image'
import Link from 'next/link'

const TournamentCard : React.FC<TournamentProps> = (details) => {
  return (
    <div key={details.id}>
      <Link href={`events/${details.id}`}>
        {/* <Image
          src={details.imageUrl}
          alt={`${details.title}`}
        /> */}
        <p>{details.title}</p>
        <p>{details.date}</p>
        <p>{details.location}</p>
        <p>{details.game}</p>
      </Link>
    </div>
  )
}

export default TournamentCard
