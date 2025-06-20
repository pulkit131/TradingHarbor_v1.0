import axios from 'axios';

const API_URL = 'http://localhost:3001/watchlist';

export async function getWatchlist(email, token) {
  const res = await axios.get(`${API_URL}/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function addToWatchlist(email, coinId, token) {
  const res = await axios.post(`${API_URL}/${email}/${coinId}`, null, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}

export async function removeFromWatchlist(email, coinId, token) {
  const res = await axios.delete(`${API_URL}/${email}/${coinId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
}


