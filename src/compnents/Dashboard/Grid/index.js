import React, { useState, useEffect } from 'react';
import './styles.css';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import {
  addToWatchlist,
  removeFromWatchlist,
  getWatchlist
} from '../../../api/api';

function Grid({ coin }) {
  const [isAdded, setIsAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('googleIdToken');

  // Initialize watchlist status
  useEffect(() => {
    async function checkStatus() {
      if (!user || !token) return;
      try {
        const wl = await getWatchlist(user.email, token);
        setIsAdded(wl.includes(coin.id));
      } catch (err) {
        console.error('Error loading watchlist status', err);
      }
    }
    checkStatus();
  }, [coin.id, user, token]);

  // Handle add/remove
  const toggleWatchlist = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (!user || !token) {
      navigate('/'); 
      return;
    }
    setLoading(true);
    try {
      if (isAdded) {
        await removeFromWatchlist(user.email, coin.id, token);
      } else {
        await addToWatchlist(user.email, coin.id, token);
      }
      setIsAdded(!isAdded);
      window.dispatchEvent(new Event('watchlistUpdated'));
    } catch {
      console.error('Failed to update watchlist');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/coin/${coin.id}`} className="grid-link">
      <motion.div
        className={`grid-container ${
          coin.price_change_percentage_24h < 0 ? 'grid-container-red' : ''
        }`}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="info-flex">
          <img src={coin.image} alt="" className="coin-logo" />
          <div className="name-col">
            <p className="coin-symbol">{coin.symbol}</p>
            <p className="coin-name">{coin.name}</p>
          </div>
          <div
            className={`watchlist-icon ${
              coin.price_change_percentage_24h < 0 ? 'watchlist-icon-red' : ''
            }`}
            onClick={toggleWatchlist}
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
          >
            {loading ? '⏳' : isAdded ? <StarIcon /> : <StarOutlineIcon />}
          </div>
        </div>

        <div className="chip-flex">
          <div
            className={`price-chip ${
              coin.price_change_percentage_24h < 0 ? 'chip-red' : ''
            }`}
          >
            {coin.price_change_percentage_24h.toFixed(2)}%
          </div>
          <div className={`icon-chip ${coin.price_change_percentage_24h < 0 ? 'chip-red' : ''}`}>
            {coin.price_change_percentage_24h < 0 ? (
              <TrendingDownRoundedIcon />
            ) : (
              <TrendingUpRoundedIcon />
            )}
          </div>
        </div>

        <div className="info-container">
          <h3
            className="coin-price"
            style={{
              color: coin.price_change_percentage_24h < 0 ? 'var(--red)' : 'var(--green)'
            }}
          >
            ${coin.current_price.toLocaleString()}
          </h3>
          <p className="total-vol">Total Volume: {coin.total_volume.toLocaleString()}</p>
          <p className="market-cap">Market Cap: ${coin.market_cap.toLocaleString()}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default Grid;
