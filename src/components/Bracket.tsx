const Bracket : React.FC = () => {
  const players = [
    'Player 1',
    'Player 2',
    'Player 3',
    'Player 4',
    'Player 5',
    'Player 6',
    'Player 7',
    'Player 8',
  ]
  const numOfMatches = players.length - 1 // karena biar menang harus eliminasi n - 1 lawan

  // for each round, half of the players advance
  const numOfRounds = Math.ceil(Math.log2(players.length)) // math.floor + 1 final round
  return (
    <div className="container">
      <div className="round1">
        <div className="match">
          <div className="players">
            <div>{players[0]}</div>
            <div>{players[1]}</div>
          </div>
          <div className="score">
            <div>0</div>
            <div>0</div>
          </div>
        </div>
        <div className="match">
          <div className="players">
            <div>{players[2]}</div>
            <div>{players[3]}</div>
          </div>
          <div className="score">
            <div>0</div>
            <div>0</div>
          </div>
        </div>
        <div className="match">
          <div className="players">
            <div>{players[4]}</div>
            <div>{players[5]}</div>
          </div>
          <div className="score">
            <div>0</div>
            <div>0</div>
          </div>
        </div>
        <div className="match">
          <div className="players">
            <div>{players[6]}</div>
            <div>{players[7]}</div>
          </div>
          <div className="score">
            <div>0</div>
            <div>0</div>
          </div>
        </div>
      </div>
      <div className="round2">
        <div className="match">
          <div className="players">
            <div>{players[0]}</div>
            <div>{players[1]}</div>
          </div>
          <div className="score">
            <div>0</div>
            <div>0</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Bracket
