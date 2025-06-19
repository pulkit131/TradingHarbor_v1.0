import React, { useEffect, useState, useRef } from 'react';
import './styles.css';
import { motion } from 'framer-motion';
import { toast } from "react-toastify";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

function LandingPage() {
  const [user, setUser] = useState(null);
  const [cryptoData, setCryptoData] = useState({
    bitcoin: { price: 0, change: 0 },
    ethereum: { price: 0, change: 0 }
  });
  const [bitcoinHistory, setBitcoinHistory] = useState([]);
  const [error, setError] = useState(null);
  const chartRef = useRef(null);
  const navigate = useNavigate();

  // On mount, check for saved user
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('user'));
    if (savedUser) setUser(savedUser);
  }, []);

  // Save user info to localStorage on login
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [user]);

  // Handle Google login success
  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser(decoded);
    toast.success('Google login successful!');
  };

  // Chart options (theme-aware)
  const getChartOptions = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark' ||
      (!document.documentElement.getAttribute('data-theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    const textColor = isDark ? '#ffffff' : '#1a202c';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    const tooltipBg = isDark ? 'rgba(30, 33, 36, 0.95)' : 'rgba(255, 255, 255, 0.95)';
    const tooltipText = isDark ? '#ffffff' : '#1a202c';
    const tooltipBody = isDark ? '#a0a3a7' : '#4a5568';
    const tooltipBorder = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'center',
          labels: {
            color: textColor,
            font: { size: 14, weight: '600' },
            padding: 20,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        tooltip: {
          enabled: true,
          backgroundColor: tooltipBg,
          titleColor: tooltipText,
          bodyColor: tooltipBody,
          borderColor: tooltipBorder,
          borderWidth: 1,
          cornerRadius: 12,
          displayColors: true,
          padding: 12,
          callbacks: {
            title: function (context) {
              return 'Time: ' + context[0].label;
            },
            label: function (context) {
              return 'Price: $' + context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              });
            }
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: { color: gridColor, drawBorder: false },
          ticks: { color: textColor, font: { size: 12, weight: '500' }, maxTicksLimit: 12 },
          title: { display: true, text: 'Time', color: textColor, font: { size: 14, weight: '600' } }
        },
        y: {
          display: true,
          grid: { color: gridColor, drawBorder: false },
          ticks: {
            color: textColor,
            font: { size: 12, weight: '500' },
            callback: function (value) {
              return '$' + value.toLocaleString();
            }
          },
          title: { display: true, text: 'Price (USD)', color: textColor, font: { size: 14, weight: '600' } }
        }
      },
      elements: {
        point: {
          radius: 2,
          hoverRadius: 6,
          backgroundColor: '#f7931a',
          borderColor: '#ffffff',
          borderWidth: 1,
          pointStyle: 'circle'
        },
        line: {
          tension: 0.4,
          borderWidth: 3
        }
      }
    };
  };

  useEffect(() => {
    const handleThemeChange = () => {
      if (chartRef.current) chartRef.current.update();
    };
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addListener(handleThemeChange);
    return () => {
      observer.disconnect();
      mediaQuery.removeListener(handleThemeChange);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchCryptoData = async () => {
      try {
        setError(null);
        const priceResponse = await fetch(
          'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true'
        );
        if (!priceResponse.ok) throw new Error("CoinGecko price fetch failed");
        const priceData = await priceResponse.json();
        const binanceResponse = await fetch(
          'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1h&limit=24'
        );
        if (!binanceResponse.ok) throw new Error("Binance history fetch failed");
        const binanceData = await binanceResponse.json();
        if (!isMounted) return;
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
          Array.isArray(binanceData)
            ? binanceData.map(item => ({
                time: new Date(item[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
                price: parseFloat(item[4])
              }))
            : []
        );
      } catch (err) {
        setError("Failed to fetch data (network issue or API error). Retrying...");
        toast.error("API Error: " + err.message, { autoClose: 5000, hideProgressBar: true });
      }
    };
    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 120000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const chartData = {
    labels: bitcoinHistory.map(item => item.time),
    datasets: [
      {
        label: "Bitcoin Price (USD)",
        data: bitcoinHistory.map(item => item.price),
        borderColor: "#f7931a",
        backgroundColor: "rgba(247, 147, 26, 0.2)",
        fill: true,
        tension: 0.4,
        pointRadius: 2,
        pointHoverRadius: 6,
        pointBackgroundColor: "#f7931a",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 1,
        pointHoverBackgroundColor: "#f7931a",
        pointHoverBorderColor: "#ffffff",
        pointHoverBorderWidth: 2
      }
    ]
  };

  // Share handler (native share if available, fallback to copy link)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Trading Harbor",
        text: "Check out Trading Harbor!",
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info("Link copied to clipboard!");
    }
  };

  const handleLogout = () => {
  localStorage.removeItem('user');
  setUser(null);
  toast.info('Logged out!');
};


  return (
    <div className='flex-info'>
      <motion.div
        className="left-component"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="left-content-inner">
          <div className="login-headings">
            <h1 className="login-title">Analyze Stocks,</h1>
            <h1 className="login-subtitle">Trade Smarter.</h1>
            <p className="login-desc">
              Leverage AI-powered news analysis to predict stock market trends with precision.
            </p>
          </div>
          {!user ? (
            <div style={{ marginTop: "2.5rem" }}>
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => {
                  toast.error('Google login failed. Please try again.');
                }}
                width="350"
                theme="outline"
                size="large"
                shape="pill"
                text="continue_with"
              />
            </div>
          ) : (
            <div className="btn-flex" style={{ marginTop: "2.5rem", gap: "1.5rem" }}>
  <button className="dashboard-btn" onClick={() => navigate('/dashboard')}>Dashboard</button>
  <button className="share-btn" onClick={handleShare}>Share</button>
  <button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

          )}
        </div>
      </motion.div>
      <div className='right-component'>
        <motion.div
          className='large-box'
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2>Bitcoin Price (Last 24 Hours)</h2>
          {error && (
            <div className="error-banner" style={{ color: 'red', marginBottom: '1em' }}>
              {error}
            </div>
          )}
          <div className="chart-container">
            {bitcoinHistory.length > 0 ? (
              <Line
                ref={chartRef}
                data={chartData}
                options={getChartOptions()}
              />
            ) : (
              !error && <p>Loading chart...</p>
            )}
          </div>
        </motion.div>

        <div className='bottom-boxes'>
          {/* Bitcoin Box */}
          <motion.div
            className='small-box'
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
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
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
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

export default LandingPage;
