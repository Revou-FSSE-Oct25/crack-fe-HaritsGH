import React, { useEffect, useState } from 'react';
import { getTournamentBracketScoreAction } from '@/app/tournament/action';

interface Match {
  id: string;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
}

interface Round {
  name: string;
  matches: Match[];
}

interface BracketProps {
  participants: Array<{ userId: number; prefix: string; alias: string }>;
  matches?: Round[];
  currentUser?: string;
  tournamentId?: string;
}

const Bracket: React.FC<BracketProps> = ({ participants, currentUser, tournamentId }) => {
  const players = participants.map(p => `${p.prefix} | ${p.alias}`);
  const [bracketScores, setBracketScores] = useState<any[]>([]);

  useEffect(() => {
    if (tournamentId) {
      const fetchBracketScores = async () => {
        const scores = await getTournamentBracketScoreAction(tournamentId);
        setBracketScores(scores || []);
      };
      fetchBracketScores();
    }
  }, [tournamentId]);
  // Calculate number of rounds needed for single elimination
  const numRounds = Math.ceil(Math.log2(players.length));
  
  // Generate bracket rounds from fetched bracket score data
  const generateBracket = (): Round[] => {
    const rounds: Round[] = [];
    
    // Group bracket scores by round based on match structure
    // Calculate number of matches per round
    const totalMatches = bracketScores.length;
    let currentRoundMatches = totalMatches;
    let round = 1;
    
    while (currentRoundMatches > 0) {
      const roundName = round === numRounds ? 'Final' : `Round ${round}`;
      const matches: Match[] = [];
      
      // Calculate matches for this round (half of previous round)
      const numMatchesInRound = Math.ceil(currentRoundMatches / 2);
      
      // Get matches for this round
      const roundMatches = bracketScores.slice(0, numMatchesInRound);
      
      for (const bracketScore of roundMatches) {
        // Map userIds to player names
        const player1Id = bracketScore.userIds?.[0];
        const player2Id = bracketScore.userIds?.[1];
        
        const player1Participant = participants?.find(p => p.userId === player1Id);
        const player2Participant = participants?.find(p => p.userId === player2Id);
        
        const player1Name = player1Participant ? `${player1Participant.prefix} | ${player1Participant.alias}` : '';
        const player2Name = player2Participant ? `${player2Participant.prefix} | ${player2Participant.alias}` : '';
        
        // Get scores
        const score1 = bracketScore.scores?.[0];
        const score2 = bracketScore.scores?.[1];
        
        // Map winnerId to player name
        let winner = undefined;
        if (bracketScore.winnerId) {
          const winnerParticipant = participants?.find(p => p.userId === bracketScore.winnerId);
          winner = winnerParticipant ? `${winnerParticipant.prefix} | ${winnerParticipant.alias}` : undefined;
        }
        
        matches.push({
          id: bracketScore.matchId,
          player1: player1Name,
          player2: player2Name,
          score1,
          score2,
          winner,
        });
      }
      
      rounds.push({ name: roundName, matches });
      
      // Remove processed matches
      bracketScores.splice(0, numMatchesInRound);
      
      currentRoundMatches = bracketScores.length;
      round++;
    }
    
    return rounds;
  };
  
  const bracketRounds =  generateBracket();
  
  return (
    <div className="overflow-x-auto bg-white min-h-screen p-8">
      <div className="grid grid-flow-col auto-cols-max gap-x-24">
        {bracketRounds.map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col min-w-[200px]">
            <h3 className="text-lg font-bold text-center mb-6 text-gray-800">{round.name}</h3>
            <div className={`flex flex-col ${roundIndex === 0 ? 'gap-8' : ''}`}>
            {round.matches.map((match, matchIndex) => {
              const isFirstMatchInPair = matchIndex % 2 === 0;
              const isLastRound = roundIndex === bracketRounds.length - 1;
              
              // Calculate margin-top to center matches between their parent matches
              let marginTop = '0px';
              if (roundIndex === 1) {
                // Round 2: center between pairs from Round 1
                marginTop = matchIndex % 2 === 0 ? '56px' : '168px';
              } else if (roundIndex === 2) {
                // Round 3 (Final): center between the two Round 2 matches
                marginTop = '168px';
              }
              
              return (
                <div
                  key={matchIndex}
                  className="relative"
                  style={{ marginTop }}
                >
                  {/* Horizontal connector line to next round */}
                  {!isLastRound && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-px bg-gray-400"></div>
                  )}
                  
                  {/* Match container */}
                  <div className={`flex flex-col border rounded ${currentUser && (match.player1 === currentUser || match.player2 === currentUser) ? 'border-4 border-blue-600' : 'border border-gray-400'}`}>
                    {/* Match ID */}
                    <div className="px-3 py-1 bg-gray-100 border-b border-gray-400">
                      <span className="text-xs text-gray-600 font-medium">match {match.id}</span>
                    </div>
                    {/* Player 1 */}
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-400">
                      <span className={`text-sm ${match.winner === match.player1 ? 'text-gray-800 font-bold' : 'text-gray-800'}`}>{match.player1}</span>
                      <span className="text-gray-800 font-bold">
                        {match.score1 === -1 ? 'DQ' : match.score1 !== undefined ? match.score1 : '-'}
                      </span>
                    </div>
                    
                    {/* Player 2 */}
                    <div className="flex items-center justify-between px-3 py-2">
                      <span className={`text-sm ${match.winner === match.player2 ? 'text-gray-800 font-bold' : 'text-gray-800'}`}>{match.player2}</span>
                      <span className="text-gray-800 font-bold">
                        {match.score2 === -1 ? 'DQ' : match.score2 !== undefined ? match.score2 : '-'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Vertical connector line between pairs of matches */}
                  {!isLastRound && isFirstMatchInPair && (
                    <div 
                      className="absolute left-1/2 -translate-x-1/2 bg-gray-400"
                      style={{
                        top: '100%',
                        width: '1px',
                        height: '32px'
                      }}
                    ></div>
                  )}
                </div>
              );
            })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bracket;
