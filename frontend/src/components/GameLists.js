import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/GameLists.css';

// Directly use the backend server's URL
const API_URL = 'http://localhost:5001/api/games';

// Define platform priorities
const platformPriorities = {
  'PC': 1,
  'PS': 2,
  'PS2': 2,
  'PS3': 2,
  'PS4': 2,
  'PS5': 2,
  'Xbox': 3,
  'Xbox 360': 3,
  'Xbox One': 3,
  'XSX / XSS': 3,
  'Nintendo Switch': 4,
};

// Define platform name mapping
const platformNameMapping = {
  'PC (Microsoft Windows)': 'PC',
  'PlayStation': 'PS',
  'PlayStation 2': 'PS2',
  'PlayStation 3': 'PS3',
  'PlayStation 4': 'PS4',
  'PlayStation 5': 'PS5',
  'Xbox': 'Xbox',
  'Xbox 360': 'Xbox 360',
  'Xbox One': 'Xbox One',
  'Xbox Series S/X': 'XSX / XSS',
  'Nintendo Switch': 'Nintendo Switch',
};

const fetchGames = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Frontend API response:', response.data); // Add this line to log the response data
    const games = response.data.results.map(game => {
      // Sort and limit platforms based on priorities
      const sortedPlatforms = game.platforms
        .map(p => platformNameMapping[p.name] || p.name) // Map platform names
        .sort((a, b) => (platformPriorities[a] || 5) - (platformPriorities[b] || 5))
        .slice(0, 3);

      return {
        id: game.id,
        title: game.name,
        coverImage: game.background_image,
        released: game.released,
        platforms: sortedPlatforms,
      };
    });
    return games;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

function GameLists() {
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await fetchGames();
        setGames(games);
      } catch (error) {
        setError(error);
      }
    };

    loadGames();
  }, []);

  if (error) {
    return <div>Error fetching games: {error.message}</div>;
  }

  return (
    <div className="game-list">
      {games.map(game => (
        <div key={game.id} className="game-card">
          <img src={game.coverImage || '/placeholder.png'} alt={game.title} className="game-cover" />
          <div className="game-info">
            <h3 className="game-title">{game.title}</h3>
            <div className="game-details">
              <span className="game-release">
                {game.released ? new Date(game.released).getFullYear() : 'N/A'}
              </span>
              <div className="game-platforms">
                {game.platforms.map(platform => (
                  <span key={platform} className="platform-tag">{platform}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default GameLists;