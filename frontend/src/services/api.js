const API_BASE_URL = 'https://api.rawg.io/api';
const API_KEY = 'dd5f283bd123444c8d98d3346aad5756'; // Replace with your actual RAWG API key

export const searchGames = async (query) => {
  const response = await fetch(`${API_BASE_URL}/games?key=${API_KEY}&search=${query}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  return data.results;
};

// You can add other API functions here in the future
