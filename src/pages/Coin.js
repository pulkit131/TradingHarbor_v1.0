import React, { useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import Header from '../compnents/Common/Header';
import Loader from '../compnents/Common/Loader';
import {coinObject} from '../functions/convertObjects';
import List from '../compnents/Dashboard/List';
import CoinInfo from '../compnents/Coin/CoinInfo';
import { getCoinData } from '../functions/getCoinData';
import { getCoinPrices } from '../functions/getCoinPrices';
import LineChart from '../compnents/Coin/LineChart';
import SelectDays from '../compnents/Coin/SelectDays';
import { settingChartData } from '../functions/settingChartData';
import TogglePriceType from '../compnents/Coin/PriceType';
function Coin() {
    const {id}=useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [coinData, setCoinData] = useState(null);
    const [days, setDays] = useState(30);
    const [chartData, setChartData] = useState({});
    const [priceType, setPriceType] = useState("prices");
    const[error,setError]=useState(false);
    
    useEffect(() => {
      if(id)  {
        getData();
      }
    }, [id]);

    async function getData(){
      setIsLoading(true);
      const data=await getCoinData(id,setError);
      if(data){
        coinObject(setCoinData,data);
        const prices=await getCoinPrices(id,days,priceType,setError);
        if(prices){
          settingChartData(setChartData, prices);
          setIsLoading(false);
        }
        
      }
    }

    const handleDaysChange=async (event)=>{
      setIsLoading(true);
      setDays(event.target.value);
      const prices=await getCoinPrices(id,event.target.value,priceType,setError);
        if(prices){
          settingChartData(setChartData,prices);
          setIsLoading(false);
        }
        
    };
    

  const handlePriceTypeChange =async (event, newType) => {
    setIsLoading(true);
    setPriceType(newType);
    const prices=await getCoinPrices(id,days,newType,setError);
        if(prices){
          settingChartData(setChartData,prices);
          setIsLoading(false);
        }
        
  };
  return (
    <div>
      <Header/>
      {isLoading ? <Loader/> :
       <>
       <div className='grey-wrapper' style={{padding:"0rem 1rem"}}>
       <List coin={coinData}/>
       </div>
       <div className='grey-wrapper'>
        <SelectDays days={days} handleDaysChange={handleDaysChange}/>
        <TogglePriceType priceType={priceType} handlePriceTypeChange={handlePriceTypeChange}/>
        <LineChart chartData={chartData}/>
       </div>
       <CoinInfo heading={coinData.name} desc={coinData.desc} />
        
      </>}
    </div>
  )
}

export default Coin
