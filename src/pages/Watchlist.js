import React, { useEffect, useState } from "react";
import Button from "../compnents/Common/Button";
import Header from "../compnents/Common/Header";
import TabsComponent from "../compnents/Dashboard/Tabs";
import { get100Coins } from "../functions/get100coins";
import Footer from "../compnents/Common/Footer";
import { getWatchlist } from "../api/api";

function Watchlist() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get user and token from localStorage
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const savedToken = localStorage.getItem("googleIdToken");
    
    setUser(savedUser);
    setToken(savedToken);

    if (!savedUser || !savedToken) {
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }

    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Use your existing API function
        const wl = await getWatchlist(savedUser.email, savedToken);
        setWatchlist(wl);

        if (wl && wl.length > 0) {
          // Fetch coin details from CoinGecko
          const allCoins = await get100Coins();
          if (allCoins) {
            setCoins(allCoins.filter((coin) => wl.includes(coin.id)));
          }
        } else {
          setCoins([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch watchlist:', err);
        setError("Failed to load watchlist. Please try again.");
        setLoading(false);
      }
    };

    fetchWatchlist();

    // Listen for watchlist updates from other components
    const onWatchlistUpdate = () => {
      fetchWatchlist();
    };

    window.addEventListener('watchlistUpdated', onWatchlistUpdate);

    return () => {
      window.removeEventListener('watchlistUpdated', onWatchlistUpdate);
    };
  }, []);

  if (!user || !token) {
    return (
      <div>
        <Header />
        <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
          Please sign in to view your watchlist.<br />
          Redirecting to home...
        </h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <Header />
        <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
          Loading your watchlist...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Header />
        <h1 style={{ textAlign: "center", marginTop: "2rem" }}>
          {error}
        </h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem",
          }}
        >
          <a href="/dashboard">
            <Button text="Try Again" onClick={() => window.location.reload()} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      {watchlist && watchlist.length > 0 ? (
        <TabsComponent coins={coins} />
      ) : (
        <div>
          <h1 style={{ textAlign: "center" }}>
            Sorry, No Items In The Watchlist.
          </h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "2rem",
            }}
          >
            <a href="/dashboard">
              <Button text="Dashboard" onClick={() => {}} />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist;
