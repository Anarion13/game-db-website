import React from 'react';
import '../styles/GameCard.css';

function GameCard({ game }) {
  return (
    <div className="game-card">
      <img
        src={game.coverImage || '/placeholder.png'}
        alt={game.title}
        className="game-cover"
      />
      <div className="game-info">
        <h3 className="game-title">{game.title}</h3>
        <div className="game-details">
          <span className="game-release">
            {game.released ? new Date(game.released * 1000).getFullYear() : 'N/A'}
          </span>
          <span className="game-popularity">
            {game.popularity ? `Popularity: ${Math.round(game.popularity)}` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
