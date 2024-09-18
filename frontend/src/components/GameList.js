import React, { useState, useEffect } from 'react';
import GameCard from './GameCard';

const RAWG_API_KEY = 'dd5f283bd123444c8d98d3346aad5756';

function GameList() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGamesWithDetails = async () => {
      try {
        // Fetch the initial list of games
        const listResponse = await fetch(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`);
        const listData = await listResponse.json();

        // Fetch detailed information for each game
        const gamesWithDetails = await Promise.all(listData.results.map(async (game) => {
          const detailResponse = await fetch(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
          const detailData = await detailResponse.json();
          return { ...game, developers: detailData.developers };
        }));

        setGames(gamesWithDetails);
      } catch (error) {
        console.error('Error fetching games:', error);
        setError(error.message);
      }
    };

    fetchGamesWithDetails();
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (games.length === 0) return <div>Loading...</div>;

  return (
    <div className="game-list">
      {games.map(game => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}

export default GameList;