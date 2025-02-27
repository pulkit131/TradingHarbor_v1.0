import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../compnents/Common/Header';
import TabsComponent from '../compnents/Dashboard/Tabs';
import Footer from '../compnents/Common/Footer';
import Loader from '../compnents/Common/Loader';
import { ToggleButton } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

function Trending() {
    const [topCoins, setTopCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
   

    useEffect(() => {
      const fetchTopCoins = async () => {
        try {
          const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 10,
              page: 1,
              sparkline: false
            }
          });
          setTopCoins(response.data || []);
          setLoading(false);
        } catch (error) {
          setError('Failed to fetch top coins');
          setLoading(false);
        }
      };
  
      fetchTopCoins();
    }, []);

    

    if (loading) return <Loader />;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <Header />
            <div className="trending-container">
                <h1 className='heading-trend'>Top 10 Cryptocurrencies<TrendingUpRoundedIcon/></h1>
        
                <TabsComponent coins={topCoins} />
            </div>
            <Footer />
        </div>
    );
}

export default Trending;