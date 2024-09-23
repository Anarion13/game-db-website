const express = require('express');
const axios = require('axios');
const cors = require('cors');
// const rateLimit = require('express-rate-limit'); // Comment out this line
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors());

// Rate limiting
// const limiter = rateLimit({
//   windowMs: 1 * 60 * 1000, // 1 minute
//   max: 4 // limit each IP to 4 requests per windowMs
// });
// app.use(limiter); // Comment out this line

// IGDB credentials
const CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;

let accessToken = null;
let tokenExpiry = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry > Date.now()) {
    return accessToken;
  }

  try {
    const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials'
      }
    });
    accessToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error getting access token:', error.message);
    throw error;
  }
}

// Root route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Ensure this endpoint is a GET request
app.get('/api/games', async (req, res) => {
  try {
    const token = await getAccessToken();

    const response = await axios({
      url: "https://api.igdb.com/v4/games",
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': CLIENT_ID,
        'Authorization': `Bearer ${token}`,
      },
      data: 'fields name,summary,cover.url,genres.name,platforms.name,first_release_date,rating,involved_companies.company.name,screenshots.url; limit 20; where rating > 75 & cover != null; sort rating desc;'
    });

    console.log('IGDB API response:', response.data); // Add this line to log the response data

    const games = response.data.map(game => ({
      id: game.id,
      name: game.name,
      background_image: game.screenshots && game.screenshots.length > 0 ? `https:${game.screenshots[0].url.replace('t_thumb', 't_screenshot_big')}` : null,
      rating: game.rating ? Math.round(game.rating) : null,
      metacritic: game.rating ? Math.round(game.rating) : null, // Using IGDB rating as a substitute for Metacritic
      released: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString().split('T')[0] : null,
      genres: game.genres ? game.genres.map(g => ({ name: g.name })) : [],
      platforms: game.platforms ? game.platforms.map(p => p.name ? { name: p.name } : { name: 'Unknown' }) : [],
      developers: game.involved_companies ? game.involved_companies.map(ic => ({ name: ic.company.name })) : [],
      short_screenshots: [{ image: game.screenshots && game.screenshots.length > 0 ? `https:${game.screenshots[0].url.replace('t_thumb', 't_screenshot_big')}` : null }],
    }));

    res.json({ results: games });
  } catch (error) {
    console.error('Error fetching games from IGDB:', error.message);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch games', details: error.message, additionalInfo: error.response ? error.response.data : null });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));