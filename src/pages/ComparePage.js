import React, { useState, useEffect } from 'react';
import Header from '../compnents/Common/Header';
import SelectCoins from '../compnents/Compare/SelectCoins';
import SelectDays from '../compnents/Coin/SelectDays';
import { getCoinData } from '../functions/getCoinData';
import Loader from '../compnents/Common/Loader';
import { getCoinPrices } from '../functions/getCoinPrices';
import { coinObject } from '../functions/convertObjects';
import List from '../compnents/Dashboard/List';
import CoinInfo from '../compnents/Coin/CoinInfo';
import LineChart from '../compnents/Coin/LineChart';
import { settingChartData } from '../functions/settingChartData';
import TogglePriceType from '../compnents/Coin/PriceType';
import { get100Coins } from '../functions/get100coins';

function ComparePage() {
    const [allCoins, setAllCoins] = useState([]);
    const [crypto1, setCrypto1] = useState("bitcoin");
    const [crypto2, setCrypto2] = useState("ethereum");
    const [days, setDays] = useState(30);
    const [crypto1Data, setCrypto1Data] = useState({});
    const [crypto2Data, setCrypto2Data] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [priceType, setPriceType] = useState("prices");
    const [chartData, setChartData] = useState({});
    const[error,setError]=useState(false);

    useEffect(() => {
        
        getData();
        
    }, []);

    async function getData() {
        setIsLoading(true);
        const coins = await get100Coins();
        if (coins) {
            setAllCoins(coins);
            const data1 = await getCoinData(crypto1,setError);
            const data2 = await getCoinData(crypto2,setError);
            coinObject(setCrypto1Data, data1);
            coinObject(setCrypto2Data, data2);
            if (data1 && data2) {
                const prices1 = await getCoinPrices(crypto1, days, priceType,setError);
                const prices2 = await getCoinPrices(crypto2, days, priceType,setError);
                settingChartData(setChartData, prices1, prices2);
                setIsLoading(false);
            }
        }
    }

    async function handleDaysChange(event) {
        setIsLoading(true);
        const newDays = event.target.value;
        setDays(newDays);
        const prices1 = await getCoinPrices(crypto1, newDays, priceType,setError);
        const prices2 = await getCoinPrices(crypto2, newDays, priceType,setError);
        if(prices1 && prices2){
        settingChartData(setChartData, prices1, prices2);
        setIsLoading(false);
        }
    };

    async function handlePriceTypeChange(event) {
        const newType = event.target.value;
        setIsLoading(true);
        setPriceType(newType);
        const prices1 = await getCoinPrices(crypto1, days, newType,setError);
        const prices2 = await getCoinPrices(crypto2, days, newType,setError);
        settingChartData(setChartData, prices1, prices2);
        setIsLoading(false);
    }

    async function handleCoinChange(event, isCoin2) {
        setIsLoading(true);
        try {
            if (isCoin2) {
                setCrypto2(event.target.value);
                const data = await getCoinData(event.target.value);
                 // Add this line
                if (data) {
                    coinObject(setCrypto2Data, data);
                    const prices1 = await getCoinPrices(crypto1, days, priceType);
                    const prices2 = await getCoinPrices(crypto2, days, priceType);
                    settingChartData(setChartData, prices1, prices2);
                } else {
                    console.error("Data for crypto2 is undefined");
                }
            } else {
                setCrypto1(event.target.value);
                const data = await getCoinData(event.target.value);
                 // Add this line
                if (data) {
                    coinObject(setCrypto1Data, data);
                    const prices1 = await getCoinPrices(crypto1, days, priceType);
                    const prices2 = await getCoinPrices(crypto2, days, priceType);
                    settingChartData(setChartData, prices1, prices2);
                } else {
                    console.error("Data for crypto1 is undefined");
                }
            }
        } catch (error) {
            console.error("Error in handleCoinChange:", error);
        } finally {
            setIsLoading(false);
        }
    }
    
    

    return (
        <div>
            <Header />
            {isLoading ? <Loader /> :
                <>
                    <div className='coins-days-flex'>
                        <SelectCoins
                            allCoins={allCoins}
                            crypto1={crypto1}
                            crypto2={crypto2}
                            handleCoinChange={handleCoinChange}
                            days={days}
                            handleDaysChange={handleDaysChange}
                        />
                       
                    </div>
                    <div className='grey-wrapper' style={{ padding: "0rem 1rem" }}>
                        <List coin={crypto1Data} />
                    </div>
                    <div className='grey-wrapper' style={{ padding: "0rem 1rem" }}>
                        <List coin={crypto2Data} />
                    </div>
                    <div className='grey-wrapper'>
                        <TogglePriceType
                            priceType={priceType}
                            handlePriceTypeChange={handlePriceTypeChange}
                        />
                        <LineChart
                            chartData={chartData}
                            priceType={priceType}
                            multiAxis={true}
                        />
                    </div>
                    <CoinInfo heading={crypto1Data.name} desc={crypto1Data.desc} />
                    <CoinInfo heading={crypto2Data.name} desc={crypto2Data.desc} />
                </>
            }
        </div>
    );
}

export default ComparePage;
