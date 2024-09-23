import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import GameCard from './GameCard';
import '../styles/GameLists.css';

function InProgress() {
  const [games, setGames] = useState([]);
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchGames = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setGames(userSnap.data().inProgress || []);
        }
      }
    };

    fetchGames();
  }, [user, db]);

  const handleRemove = (gameId) => {
    setGames(prevGames => prevGames.filter(game => game.id !== gameId));
  };

  return (
    <div className="in-progress-container">
      <h2>In Progress</h2>
      {games.length === 0 ? (
        <p>No games in progress.</p>
      ) : (
        <div className="game-grid">
          {games.map(game => (
            <GameCard 
              key={game.id} 
              game={game} 
              listType="inProgress"
              onRemove={handleRemove} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default InProgress;
