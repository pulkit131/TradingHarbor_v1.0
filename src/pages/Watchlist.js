import React, { useEffect, useState } from "react";
import Button from "../compnents/Common/Button";
import Header from "../compnents/Common/Header";
import TabsComponent from "../compnents/Dashboard/Tabs";
import { get100Coins } from "../functions/get100coins";
import Footer from "../compnents/Common/Footer";

function Watchlist() {
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState([]);
  const [watchlist, setWatchlist] = useState([]);

  // Helper to get the user's watchlist from localStorage
  const getUserWatchlist = (savedUser) => {
    if (!savedUser) return [];
    const key = `watchlist_${savedUser.email}`;
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);

    if (!savedUser) {
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
      return;
    }

    // Initial fetch
    const wl = getUserWatchlist(savedUser);
    setWatchlist(wl);

    if (wl.length > 0) {
      getData(wl);
    }

    // Listen for localStorage changes (cross-tab)
    const onStorage = (e) => {
      if (e.key === `watchlist_${savedUser.email}`) {
        const updatedWl = getUserWatchlist(savedUser);
        setWatchlist(updatedWl);
        if (updatedWl.length > 0) {
          getData(updatedWl);
        } else {
          setCoins([]);
        }
      }
    };
    window.addEventListener('storage', onStorage);

    // Listen for custom event (same tab)
    const onCustomWatchlistUpdate = () => {
      const updatedWl = getUserWatchlist(savedUser);
      setWatchlist(updatedWl);
      if (updatedWl.length > 0) {
        getData(updatedWl);
      } else {
        setCoins([]);
      }
    };
    window.addEventListener('watchlistUpdated', onCustomWatchlistUpdate);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('watchlistUpdated', onCustomWatchlistUpdate);
    };
    // eslint-disable-next-line
  }, []);

  const getData = async (wl) => {
    const allCoins = await get100Coins();
    if (allCoins) {
      setCoins(allCoins.filter((coin) => wl.includes(coin.id)));
    }
  };

  if (!user) {
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

  return (
    <div>
      <Header />
      {watchlist.length > 0 ? (
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
      {/* <Footer /> */}
    </div>
  );
}

export default Watchlist;
