import React, { useEffect, useState } from 'react';
import './styles.css';
import Button from '../../Common/Button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RWebShare } from "react-web-share";
import { toast } from "react-toastify";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function MainComponent() {
  const [cryptoData, setCryptoData] = useState({
    bitcoin: { price: 0, change: 0 },
    ethereum: { price: 0, change: 0 }
  });

  const [bitcoinHistory, setBitcoinHistory] = useState([]);

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
        );
        const priceData = await priceResponse.json();

        const historyResponse = await fetch(
          'https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1&interval=hourly'
        );
        const historyData = await historyResponse.json();

        setCryptoData({
          bitcoin: {
            price: priceData.bitcoin.usd,
            change: priceData.bitcoin.usd_24h_change.toFixed(2)
          },
          ethereum: {
            price: priceData.ethereum.usd,
            change: priceData.ethereum.usd_24h_change.toFixed(2)
          }
        });

        setBitcoinHistory(
          historyData.prices.map(([timestamp, price]) => ({
            time: new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            price
          }))
        );
      } catch (error) {
        console.error("Error fetching crypto data:", error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Refresh every 1 minute

    return () => clearInterval(interval);
  }, []);

  // Chart Data
  const chartData = {
    labels: bitcoinHistory.map(item => item.time),
    datasets: [
      {
        label: "Bitcoin Price (USD)",
        data: bitcoinHistory.map(item => item.price),
        borderColor: "#f7931a",
        backgroundColor: "rgba(247, 147, 26, 0.2)",
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Chart Options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: true },
      y: { display: true }
    }
  };

  return (
    <div className='flex-info'>
      <div className='left-component'>
        <motion.h1 
          className='crypto-heading'
          initial={{opacity:0,x:50}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5}}
        >
          Analyze Stocks,
        </motion.h1>      
        <motion.h1 className='real-time-heading'
          initial={{opacity:0,x:50}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5,delay:0.5}}
        >
          Trade Smarter.
        </motion.h1>
        <motion.p className='info-text'
          initial={{opacity:0,x:50}}
          animate={{opacity:1,x:0}}
          transition={{duration:0.5,delay:1}}
        >
          Leverage AI-powered news analysis to predict stock market trends with precision.
        </motion.p>
        <motion.div className='btn-flex'
          initial={{opacity:0,y:50}}
          animate={{opacity:1,y:0}}
          transition={{duration:0.5,delay:1.5}}
        >
          <Link to="/dashboard">
            <Button text={"Dashboard"} onClick={()=>console.log("btn Clicked")}/>
          </Link>
          <RWebShare
            data={{
              text: "Stock Market Analysis App",
              url: "",
              title: "TradingHarbor",
            }}
            onClick={() => toast.info("App Shared!")}
          >
            <Button text={"Share App"} outlined={true} />
          </RWebShare>
        </motion.div>
      </div>

      {/* Right section with Bitcoin Graph */}
      <div className='right-component'>
        <motion.div 
          className='large-box'
          initial={{opacity: 0, y: 50}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.5, delay: 0.5}}
        >
          <h2>Bitcoin Price (Last 24 Hours)</h2>
          <Line data={chartData} options={chartOptions} />
        </motion.div>
        
        <div className='bottom-boxes'>
          {/* Bitcoin Box */}
          <motion.div 
            className='small-box'
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.7}}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/46/Bitcoin.svg" 
              alt="Bitcoin" 
              className="crypto-logo"
            />
            <h2>Bitcoin</h2>
            <p>${cryptoData.bitcoin.price.toLocaleString()}</p>
            <span className={`crypto-change ${cryptoData.bitcoin.change >= 0 ? 'positive' : 'negative'}`}>
              {cryptoData.bitcoin.change}%
            </span>
          </motion.div>

          {/* Ethereum Box */}
          <motion.div 
            className='small-box'
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.5, delay: 0.9}}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/0/05/Ethereum_logo_2014.svg" 
              alt="Ethereum" 
              className="crypto-logo"
            />
            <h2>Ethereum</h2>
            <p>${cryptoData.ethereum.price.toLocaleString()}</p>
            <span className={`crypto-change ${cryptoData.ethereum.change >= 0 ? 'positive' : 'negative'}`}>
              {cryptoData.ethereum.change}%
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
