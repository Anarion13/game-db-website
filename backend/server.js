const express = require('express');
const cors = require('cors');
const axios = require('axios');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./config/game-db-website-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Middleware to verify Firebase ID token
const authenticateUser = async (req, res, next) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.post('/api/add-game', authenticateUser, async (req, res) => {
  const { gameId, gameName, list } = req.body;
  const userId = req.user.uid;

  // Validate the list name
  if (!['backlog', 'inProgress', 'finished'].includes(list)) {
    return res.status(400).json({ error: 'Invalid list name' });
  }

  try {
    const userRef = admin.firestore().collection('users').doc(userId);
    await userRef.set({
      [list]: admin.firestore.FieldValue.arrayUnion({ id: gameId, name: gameName })
    }, { merge: true });

    res.status(200).json({ message: 'Game added successfully' });
  } catch (error) {
    console.error('Error adding game:', error);
    res.status(500).json({ error: 'Failed to add game' });
  }
});

const PORT = process.env.PORT || 5001;
const RAWG_API_KEY = process.env.RAWG_API_KEY;

app.get('/api/games', async (req, res) => {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games?key=${RAWG_API_KEY}`);
    const games = response.data.results;

    // Fetch detailed information for each game
    const detailedGames = await Promise.all(
      games.map(async (game) => {
        const detailResponse = await axios.get(`https://api.rawg.io/api/games/${game.id}?key=${RAWG_API_KEY}`);
        return { ...game, ...detailResponse.data };
      })
    );

    res.json({ results: detailedGames });
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Error fetching games' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});