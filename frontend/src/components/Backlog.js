import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import GameCard from './GameCard';
import '../styles/GameLists.css';

function Backlog() {
  const [groupedGames, setGroupedGames] = useState({});
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchGames = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const backlogGames = userSnap.data().backlog || [];
          console.log('Fetched backlog games:', backlogGames); // Add this line
          const grouped = groupGamesByYear(backlogGames);
          setGroupedGames(grouped);
        }
      }
    };

    fetchGames();
  }, [user, db]);

  const groupGamesByYear = (games) => {
    return games.reduce((acc, game) => {
      console.log('Processing game:', game); // Add this line
      const year = game.released ? new Date(game.released).getFullYear() : 'Unknown';
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(game);
      return acc;
    }, {});
  };

  const handleRemove = (gameId) => {
    setGroupedGames(prevGrouped => {
      const newGrouped = { ...prevGrouped };
      Object.keys(newGrouped).forEach(year => {
        newGrouped[year] = newGrouped[year].filter(game => game.id !== gameId);
        if (newGrouped[year].length === 0) {
          delete newGrouped[year];
        }
      });
      return newGrouped;
    });
  };

  return (
    <div className="backlog-container">
      <h2>My Backlog</h2>
      {Object.keys(groupedGames).length === 0 ? (
        <p>No games in your backlog yet.</p>
      ) : (
        Object.entries(groupedGames)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([year, games]) => (
            <div key={year} className="year-group">
              <h3 className="year-heading">{year}</h3>
              <div className="game-grid">
                {games.map(game => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    listType="backlog"
                    onRemove={handleRemove} 
                  />
                ))}
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default Backlog;
