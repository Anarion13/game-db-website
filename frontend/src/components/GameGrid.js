import React from 'react';
import './GameLists.css'; // Assuming this is where your grid styles are

function GameGrid({ children }) {
  return <div className="game-list">{children}</div>;
}

export default GameGrid;