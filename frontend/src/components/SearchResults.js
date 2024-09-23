import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import GameCard from './GameCard';
import { searchGames } from '../services/api';
import '../styles/GameLists.css';

function SearchResults() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');

    if (query) {
      setLoading(true);
      searchGames(query)
        .then(results => {
          setGames(results);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error searching games:', error);
          setLoading(false);
        });
    }
  }, [location.search]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="search-results">
      <h2>Search Results</h2>
      {games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div className="game-grid">
          {games.map(game => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchResults;
