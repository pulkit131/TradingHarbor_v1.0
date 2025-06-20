import React from 'react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import Tooltip from '@mui/material/Tooltip';
import { convertNumber } from '../../../functions/convertNumbers';
import { motion } from 'framer-motion';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { addToWatchlist, removeFromWatchlist, getWatchlist } from '../../../api/api';

function List({ coin }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isCoinAdded, setIsCoinAdded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get user and token from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("googleIdToken");
    
    setUser(savedUser);
    setToken(savedToken);

    // Check if coin is already in watchlist
    const checkWatchlistStatus = async () => {
      if (savedUser && savedToken) {
        try {
          const watchlist = await getWatchlist(savedUser.email, savedToken);
          setIsCoinAdded(watchlist && watchlist.includes(coin.id));
        } catch (error) {
          console.error("Error checking watchlist status:", error);
          setIsCoinAdded(false);
        }
      }
    };

    checkWatchlistStatus();

    // Listen for watchlist updates
    const handleWatchlistUpdate = () => {
      checkWatchlistStatus();
    };

    window.addEventListener('watchlistUpdated', handleWatchlistUpdate);

    return () => {
      window.removeEventListener('watchlistUpdated', handleWatchlistUpdate);
    };
  }, [coin.id]);

  const handleWatchlistClick = async (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!user || !token) {
      alert("Please sign in to manage your watchlist");
      return;
    }

    if (isLoading) return; // Prevent multiple clicks

    setIsLoading(true);

    try {
      if (isCoinAdded) {
        await removeFromWatchlist(user.email, coin.id, token);
        setIsCoinAdded(false);
      } else {
        await addToWatchlist(user.email, coin.id, token);
        setIsCoinAdded(true);
      }
      
      // Dispatch event to update other components
      window.dispatchEvent(new Event('watchlistUpdated'));
    } catch (error) {
      console.error("Error updating watchlist:", error);
      alert("Failed to update watchlist. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Link to={`/coin/${coin.id}`}>
      <motion.tr className='list-row'
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Tooltip title="Coin logo">
          <td className='td-image'>
            <img src={coin.image} alt='' className='coin-logo'/>
          </td>
        </Tooltip>
        <Tooltip title="Coin Name">
          <td>
            <div className='name-col td-name'>
              <p className='coin-symbol'>{coin.symbol}</p>
              <p className='coin-name'>{coin.name}</p>
            </div>
          </td>
        </Tooltip>
        <Tooltip title="Price change in 24hrs" placement='bottom-start'>
          {coin.price_change_percentage_24h >= 0 ? (
            <td className='chip-flex'>
              <div className='price-chip'>{coin.price_change_percentage_24h.toFixed(2)}%</div>
              <div className='icon-chip td-icon'><TrendingUpRoundedIcon/></div>
            </td>
          ) : (
            <td className='chip-flex'>
              <div className='price-chip chip-red'>{coin.price_change_percentage_24h.toFixed(2)}%</div>
              <div className='icon-chip chip-red td-icon'><TrendingDownRoundedIcon/></div>
            </td>
          )}
        </Tooltip>
        <Tooltip title="Current Price">
          <td>
            <h3 className='coin-price td-center-align' 
              style={{
                color: coin.price_change_percentage_24h < 0 ? "var(--red)" : "var(--green)"
              }}>
              ${coin.current_price.toLocaleString()}
            </h3>
          </td>
        </Tooltip>
        <Tooltip title="Current Volume">
          <td>
            <p className='td-total-vol td-right-align'>${coin.total_volume.toLocaleString()}</p>
          </td>
        </Tooltip>
        <Tooltip title="Market Cap">
          <td className='desktop-td-mkt'>
            <p className='market-cap td-right-align'>${coin.market_cap.toLocaleString()}</p>
          </td>
        </Tooltip>
        <Tooltip title="Market Cap">
          <td className='mobile-td-mkt'>
            <p className='market-cap td-right-align'>${convertNumber(coin.market_cap)}</p>
          </td>
        </Tooltip>
        <td
          className={`watchlist-icon-list ${
            coin.price_change_percentage_24h < 0 && "watchlist-icon-list-red"
          }`}
          onClick={handleWatchlistClick}
          style={{ 
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.6 : 1 
          }}
        >
          {isLoading ? (
            <div style={{ fontSize: '16px' }}>⏳</div>
          ) : (
            isCoinAdded ? <StarIcon /> : <StarOutlineIcon />
          )}
        </td>
      </motion.tr>
    </Link>
  );
}

export default List;
