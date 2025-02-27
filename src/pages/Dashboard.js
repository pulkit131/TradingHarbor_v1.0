import React, { useState, useEffect} from 'react'
import Header from '../compnents/Common/Header'
import TabsComponent from '../compnents/Dashboard/Tabs'
import Search from '../compnents/Dashboard/Search';
import PaginationComponent from '../compnents/Dashboard/Pagination';
import Loader from '../compnents/Common/Loader';
import BackToTop from '../compnents/Common/BackToTop';
import { get100Coins } from '../functions/get100coins';
import Footer from '../compnents/Common/Footer';


function Dashboard() {
const [coins,setCoins]=useState([]);
const [paginatedCoins, setPaginatedCoins] = useState([]);
const [search,setSearch]=useState("");
const [page,setPage]=useState(1);
const [isLoading, setIsLoading] = useState(true);


const handlePageChange=(event,value)=>{
  setPage(value);
  var previousIndex=(value-1)*10;
  setPaginatedCoins(coins.slice(previousIndex,previousIndex+10));
}

const onSearchChange=(e)=>{
  console.log(e.target.value)
  setSearch(e.target.value);
};

var filterCoins=coins.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase())|| item.symbol.toLowerCase().includes(search.toLowerCase()));
useEffect(() => {
  getData();
}, []);

  const getData=async() =>{
    const myCoins=await get100Coins();
    if(myCoins){
    setCoins(myCoins);
    setPaginatedCoins(myCoins.slice(0,10));
    setIsLoading(false);
    }
  };

  return (
    
    <>
    <Header/>
    <BackToTop/>
    {isLoading ? (<Loader/>):(
    <div>
      
      <Search search={search} onSearchChange={onSearchChange}/>
      <TabsComponent coins={search? filterCoins : paginatedCoins}/>
      {!search && (<PaginationComponent page={page} handlePageChange={handlePageChange}/>)}
    </div>
    )}
    <Footer/>
    </>
  )
}

export default Dashboard
