import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { doc, getFirestore, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import './GameCard.css';

const RAWG_API_KEY = 'dd5f283bd123444c8d98d3346aad5756'; // Replace with your RAWG API key

const platformPriority = ['PC', 'PlayStation', 'Switch', 'Xbox'];

function GameCard({ game, listType = null, onRemove = null }) {
  console.log('Game name:', game.name);
  console.log('Developers:', game.developers);
  const { user } = useAuth();
  const { addNotification } = useNotification();
  const [showMenu, setShowMenu] = useState(false);
  const [developerLogo, setDeveloperLogo] = useState(null);

  useEffect(() => {
    const fetchDeveloperLogo = async () => {
      if (game.developers && game.developers.length > 0) {
        const developerName = game.developers[0].name;
        try {
          const response = await axios.get(`https://api.rawg.io/api/developers?key=${RAWG_API_KEY}&search=${developerName}`);
          if (response.data.results && response.data.results.length > 0) {
            setDeveloperLogo(response.data.results[0].image_background);
          }
        } catch (error) {
          console.error('Error fetching developer logo:', error);
        }
      }
    };

    fetchDeveloperLogo();
  }, [game.developers]);

  const addGame = async (list) => {
    if (!user) {
      addNotification('Please log in to add games to your lists.');
      return;
    }

    try {
      const userRef = doc(getFirestore(), 'users', user.uid);
      await updateDoc(userRef, {
        [list]: arrayUnion({
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          released: game.released,
          developers: game.developers,
          platforms: game.platforms
        })
      });
      addNotification(`${game.name} added to ${list}.`);
    } catch (error) {
      console.error('Error adding game:', error);
      addNotification(`Failed to add ${game.name}. Please try again.`);
    }

    setShowMenu(false);
  };

  const removeGame = async () => {
    if (!user) {
      addNotification('You must be logged in to remove games.');
      return;
    }

    try {
      const userRef = doc(getFirestore(), 'users', user.uid);
      await updateDoc(userRef, {
        [listType]: arrayRemove({
          id: game.id,
          name: game.name,
          background_image: game.background_image,
          developers: game.developers,
          platforms: game.platforms
        })
      });

      if (onRemove) {
        onRemove(game.id);
      }
      addNotification(`${game.name} removed from the list.`);
    } catch (error) {
      console.error('Error removing game:', error);
      addNotification(`Failed to remove ${game.name}. Please try again.`);
    }
  };

  const getPrioritizedPlatforms = (platforms) => {
    const sortedPlatforms = platforms.sort((a, b) => {
      const aIndex = platformPriority.findIndex(p => a.platform.name.includes(p));
      const bIndex = platformPriority.findIndex(p => b.platform.name.includes(p));
      return (aIndex === -1 ? platformPriority.length : aIndex) - (bIndex === -1 ? platformPriority.length : bIndex);
    });
    return sortedPlatforms.slice(0, 2);
  };

  const getPlatformClass = (platformName) => {
    if (platformName.includes('PC')) return 'platform-pc';
    if (platformName.includes('PlayStation')) return 'platform-playstation';
    if (platformName.includes('Xbox')) return 'platform-xbox';
    if (platformName.includes('Nintendo')) return 'platform-nintendo';
    return '';
  };

  const getShorthandPlatformName = (platformName) => {
    if (platformName.includes('PlayStation')) {
      return platformName.replace('PlayStation ', 'PS');
    }
    if (platformName.includes('Xbox')) {
      return platformName.replace('Xbox One', 'XOne').replace('Xbox Series S/X', 'XSX');
    }
    return platformName;
  };

  return (
    <div className={`game-card ${showMenu ? 'show-menu' : ''}`}>
      <img src={game.background_image} alt={game.name} className="game-cover" />
      <div className="game-info">
        {game.platforms && (
          <div className="platform-tags">
            {getPrioritizedPlatforms(game.platforms).map(platform => (
              <span 
                key={platform.platform.id} 
                className={`platform-tag ${getPlatformClass(platform.platform.name)}`}
              >
                {getShorthandPlatformName(platform.platform.name)}
              </span>
            ))}
          </div>
        )}
        <h3>{game.name}</h3>
        {game.developers && game.developers.length > 0 ? (
          <p className="developer-name">
            {game.developers[0].name}
          </p>
        ) : (
          <p className="developer-name">Developer info not available</p>
        )}
        {listType ? (
          <button onClick={removeGame} className="remove-button">Remove</button>
        ) : (
          <>
            <button onClick={() => setShowMenu(!showMenu)} className="add-button">Add</button>
            {showMenu && (
              <div className="add-menu">
                <button onClick={() => addGame('backlog')}>Backlog</button>
                <button onClick={() => addGame('inProgress')}>In Progress</button>
                <button onClick={() => addGame('finished')}>Finished</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default GameCard;
