import TournamentCard from "@/components/TournamentCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { TournamentProps } from "./lib/tournament";


export default function Home() {
  const tourneyList : TournamentProps[] = [
    {
      id : 1,
      title : 'turni',
      date : '17-10-1994',
      location : 'Online',
      game : 'Mahjong',
      // imageUrl : ''
    }
  ]
  return (
    <div className="bg-white text-black h-screen w-full border-b-1">
      <Header/>
      <main className="h-full bg-gray-200 ">
        <section>
          <p>Hero Section</p>
          <p>Elite Ball Knowledge</p>
        </section>
          
        <section>
          <p>Tournaments</p>
          {/* {tourneyList.map((turni : TournamentProps) => TournamentCard({turni}))} */}
        </section>
      </main>
      <Footer/>
    </div>
  );
}
