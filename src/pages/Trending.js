import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../compnents/Common/Header";
import TabsComponent from "../compnents/Dashboard/Tabs";
import Footer from "../compnents/Common/Footer";
import Loader from "../compnents/Common/Loader";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

function Trending() {
  const [topStocks, setTopStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTopStocks = async () => {
      try {
        const response = await axios.get("https://www.alphavantage.co/query", {
          params: {
            function: "TIME_SERIES_DAILY", // ✅ Use DAILY data instead of 5min
            symbol: "BSE:TCS", // ✅ Correct Indian stock format
            apikey: "0UC8S9SL0OEDB9D9",
          },
        });

        console.log("Full API Response:", response.data); // Debugging

        if (response.data.Note) {
          throw new Error("API limit reached. Try again later.");
        }

        const data = response.data["Time Series (Daily)"];
        if (!data) {
          throw new Error("Invalid API response format.");
        }

        const formattedData = Object.keys(data).map((key) => ({
          date: key,
          open: data[key]["1. open"],
          high: data[key]["2. high"],
          low: data[key]["3. low"],
          close: data[key]["4. close"],
          volume: data[key]["5. volume"],
        }));

        setTopStocks(formattedData.slice(0, 5)); // Show last 5 days
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTopStocks();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div>
      <Header />
      <div className="trending-container">
        <h1 className="heading-trend">
          Top Indian Stocks <TrendingUpRoundedIcon />
        </h1>
        <TabsComponent stocks={topStocks} />
      </div>
      <Footer />
    </div>
  );
}

export default Trending;
