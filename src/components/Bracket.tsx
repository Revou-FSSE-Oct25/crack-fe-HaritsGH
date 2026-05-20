import React, { useEffect, useState } from 'react';
import { getTournamentBracketScoreAction, updateMatchScoreAction } from '@/app/tournament/action';

interface Match {
  id: string;
  player1: string;
  player2: string;
  score1?: number;
  score2?: number;
  winner?: string;
  originalMatch?: any;
}

interface Participant {
  userId: number;
  prefix: string;
  alias: string;
  participateTime?: string;
}

interface BracketProps {
  participants: Participant[];
  matches?: Match[];
  currentUser?: string;
  tournamentId?: string;
  isAdmin?: boolean;
}

const Bracket: React.FC<BracketProps> = ({ participants, currentUser, tournamentId, isAdmin }) => {
  const [bracketScores, setBracketScores] = useState<any[]>([{}]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [score1, setScore1] = useState<number | undefined>(undefined);
  const [score2, setScore2] = useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log('passed in user:', currentUser)

  const handleMatchClick = (match: any, originalMatch: any) => {
    if (isAdmin) {
      setSelectedMatch({ ...match, userIds: originalMatch.userIds, winnerId: originalMatch.winnerId });
      setScore1(match.score1);
      setScore2(match.score2);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
    setScore1(undefined);
    setScore2(undefined);
  };

  const handleSubmitScore = async () => {
    if (!selectedMatch || !tournamentId || score1 === undefined || score2 === undefined) return;

    // console.log(selectedMatch)
    
    // Calculate winner based on scores
    let winnerId: number | undefined | null;
    if (score1 === 0 && score2 === 0) {
      winnerId = null; // No winner if both scores are 0
    } else if (score1 > score2) {
      winnerId = selectedMatch.userIds?.[0];
    } else if (score2 > score1) {
      winnerId = selectedMatch.userIds?.[1];
    }

    // Calculate next round match Id
    // const nextRoundMatchId = selectedMatch.nextRoundMatchId + 1;
    
    setIsSubmitting(true);
    try {
      const result = await updateMatchScoreAction(
        tournamentId, 
        selectedMatch.id, 
        [score1, score2], 
        selectedMatch.userIds,
        winnerId,
        // nextRoundMatchId
      );
      
      if (result?.error) {
        alert(result.error);
        return;
      }
      
      // Refresh bracket scores
      const scores = await getTournamentBracketScoreAction(tournamentId);
      setBracketScores(scores || []);
      handleCloseModal();
    } catch (error) {
      console.error('Failed to update score:', error);
      alert('Failed to update score');
    } finally {
      setIsSubmitting(false);
    }
  };

  const BracketRoundGenerator = (bracketScoresData: any[]) => {
    // function getBaseLog(base: number, n: number) {
    //   return Math.log(n) / Math.log(base);
    // }
    // function modulo(x: number, y: number) {
    //   return y * Math.floor(x / y) + (x % y); JUST DO MATH.FLOOR BRUH
    // }
    const N = participants.length; // Number of participants - 5
    const R = Math.ceil(Math.log2(N)); // Number of rounds - 3
    // const M = N - 1 // Total number of matches - 4
    const S = N % Math.pow(2, R - 1); // Number of matches in First Round - 1 match = 2 people
    const D = S === 0 ? Math.pow(2, R-1) : Math.pow(2, R-1) / 2; // Number of matches in Second Round - 4 matches

    let rounds: any[] = [];

    let start: number = 0;
    let end: number = S;

    rounds.push(bracketScoresData.slice(start, end)); // .slice(0, 0) Round 1 [match id 0-0]
    
    rounds = rounds.filter(inner => inner.length > 0); // remove empty array if N is the power of 2
    const r = S === 0 ? R : R-1
    for (let i = 0; i < r; i++) {
        start = end
        end = start + D * Math.pow(1/2, i)
        rounds.push(bracketScoresData.slice(start, end))
    }
    return rounds;
  };

  useEffect(() => {
    if (tournamentId) {
      const fetchBracketScores = async () => {
        const scores = await getTournamentBracketScoreAction(tournamentId);
        setBracketScores(scores || []);
      };
      fetchBracketScores();
    }
  }, [tournamentId]);

  // Use BracketRoundGenerator to get the rounds
  const generatedRounds = BracketRoundGenerator(bracketScores);

  // Helper function to map match data to display format
  const mapMatchToDisplay = (match: any, roundIndex: number, matchIndex: number): Match => {
    
    const player1Id = match.userIds?.[0];
    const player2Id = match.userIds?.[1];
    
    const player1Participant = participants?.find(p => p.userId === player1Id);
    const player2Participant = participants?.find(p => p.userId === player2Id);
    
    const participantsRemainder = participants.length % Math.pow(2, Math.floor(Math.log2(participants.length)))
    const roundOffset = participantsRemainder === 0
      ? 0 
      : Math.floor(Math.log2(participants.length - match.matchId));

    const player1Name = player1Participant 
      ? `${player1Participant.prefix? player1Participant.prefix + ' |' : ''} ${player1Participant.alias}` 
      : player1Id === 0 && roundIndex > 0
        ? `Winner of match ${match.matchId - roundOffset - 2}`
        : '';
    
    const player2Name = player2Participant 
      ? `${player2Participant.prefix ? player2Participant.prefix + ' |' : ''} ${player2Participant.alias}` 
      : player2Id === 0 && roundIndex > 0
        ? `Winner of match ${match.matchId - roundOffset - 1}`
        : '';
    
    let winner = undefined;
    if (match.winnerId) {
      const winnerParticipant = participants?.find(p => p.userId === match.winnerId);
      winner = winnerParticipant ? `${winnerParticipant.prefix} | ${winnerParticipant.alias}` : undefined;
    }
    
    return {
      id: match.matchId,
      player1: player1Name,
      player2: player2Name,
      score1: match.scores?.[0],
      score2: match.scores?.[1],
      winner,
      originalMatch: match,
    };
  };

  return (
    <div className="overflow-x-auto bg-white min-h-screen p-8">
      <div 
        className="grid gap-x-24 gap-y-4"
        style={{
          gridTemplateColumns: `repeat(${generatedRounds.length}, minmax(200px, auto))`,
          gridTemplateRows: `repeat(${generatedRounds[0]?.length || 1}, min-content)`
        }}
      >
        {generatedRounds.map((roundMatches, roundIndex) => {
          const roundNumber = roundIndex + 1;
          const isLastRound = roundIndex === generatedRounds.length - 1;
          const roundName = isLastRound ? 'Final' : `Round ${roundNumber}`;
          
          return (
            <React.Fragment key={roundIndex}>
              <div 
                style={{ 
                  gridColumn: roundIndex + 1,
                  gridRow: 1,
                  textAlign: 'center'
                }}
              >
                <h3 className="text-lg font-bold text-gray-800">{roundName}</h3>
              </div>
              {roundMatches.map((match: any, matchIndex: number) => {
                const displayMatch = mapMatchToDisplay(match, roundIndex, matchIndex);
                console.log('match id', displayMatch.id)
                console.log('displayMatch player 1:', displayMatch.player1)
                console.log('displayMatch player 2:', displayMatch.player2)
                // Calculate row span: each round doubles the span
                const rowSpan = Math.pow(2, roundIndex);
                const gridRowStart = matchIndex * rowSpan + 2; // +2 because row 1 is for the header
                
                return (
                  <div 
                    key={matchIndex} 
                    style={{ 
                      gridColumn: roundIndex + 1,
                      gridRow: `${gridRowStart} / span ${rowSpan}`,
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {/* Match container */}
                    <div 
                      className={`flex flex-col border rounded w-full ${isAdmin ? 'cursor-pointer hover:border-blue-500 hover:shadow-md transition-all' : ''} ${currentUser && (displayMatch.player1 === currentUser || displayMatch.player2 === currentUser) ? 'border-4 border-blue-600' : 'border border-gray-400'}`}
                      onClick={() => handleMatchClick(displayMatch, displayMatch.originalMatch)}
                    >
                      {/* Match ID */}
                      <div className="px-3 py-1 bg-gray-100 border-b border-gray-400">
                        <span className="text-xs text-gray-600 font-medium">Match {displayMatch.id}</span>
                      </div>
                      {/* Player 1 */}
                      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-400">
                        <span className={`text-sm ${displayMatch.winner === displayMatch.player1 ? 'text-gray-800 font-bold' : 'text-gray-800'}`}>{displayMatch.player1}</span>
                        <span className="text-gray-800 font-bold">
                          {displayMatch.score1 === -1 ? 'DQ' : displayMatch.score1}
                        </span>
                      </div>
                      
                      {/* Player 2 */}
                      <div className="flex items-center justify-between px-3 py-2">
                        <span className={`text-sm ${displayMatch.winner === displayMatch.player2 ? 'text-gray-800 font-bold' : 'text-gray-800'}`}>{displayMatch.player2}</span>
                        <span className="text-gray-800 font-bold">
                          {displayMatch.score2 === -1 ? 'DQ' : displayMatch.score2}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          );
        })}
      </div>

      {/* Score Edit Modal */}
      {isModalOpen && selectedMatch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Match Score</h2>
            <p className="text-sm text-gray-600 mb-4">Match {selectedMatch.id}</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedMatch.player1}
                </label>
                <input
                  type="number"
                  min="-1"
                  value={score1 !== undefined ? score1 : ''}
                  onChange={(e) => setScore1(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter score (-1 for DQ)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedMatch.player2}
                </label>
                <input
                  type="number"
                  min="-1"
                  value={score2 !== undefined ? score2 : ''}
                  onChange={(e) => setScore2(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter score (-1 for DQ)"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCloseModal}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitScore}
                disabled={isSubmitting || score1 === undefined || score2 === undefined}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Score'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bracket;
