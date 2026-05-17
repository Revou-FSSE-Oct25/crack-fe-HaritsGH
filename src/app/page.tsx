'use client';

import { useState, useEffect } from 'react';
import TournamentCard from "@/components/TournamentCard";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TournamentProps } from "@/lib/props";
import { getTournamentListAction } from "@/app/tournament/action";
import Link from "next/link";


export default function Home() {
  const [tourneyList, setTourneyList] = useState<TournamentProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTournaments() {
      try {
        const data = await getTournamentListAction();
        setTourneyList(data.slice(0, 5));
      } catch (err: any) {
        setError(err.message || 'Failed to load tournaments');
      } finally {
        setLoading(false);
      }
    }
    fetchTournaments();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <Header/>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">Elite Ball Knowledge</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the ultimate gaming tournament platform. Compete, win, and become a legend.
            </p>
            <div className="flex gap-4 justify-center">
              <Link 
                href="/tournament" 
                className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Browse Tournaments
              </Link>
              <Link 
                href="/register" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>
          
        {/* Tournaments Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Tournaments</h2>
              <p className="text-gray-600 text-lg">Compete in the best gaming events</p>
            </div>
            {loading ? (
              <div className="text-center text-gray-600">Loading tournaments...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : tourneyList.length === 0 ? (
              <div className="text-center text-gray-600">No tournaments available</div>
            ) : (
              <div className="flex flex-wrap gap-6 justify-center">
                {tourneyList.map((turni : TournamentProps) => (
                  <div key={turni.id} className="transform hover:scale-105 transition-transform duration-300">
                    <TournamentCard details={turni} />
                  </div>
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <Link 
                href="/tournament" 
                className="inline-block px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-black text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
              >
                View All Tournaments
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
