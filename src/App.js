import './App.css';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import HomePage from './pages/Home';
import Dashboard from './pages/Dashboard';
import Coin from './pages/Coin';
import ComparePage from './pages/ComparePage';
import Watchlist from './pages/Watchlist';
import { createTheme,ThemeProvider } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import Trending from './pages/Trending';
function App() {
  
  return (
    <div className='App'>
      
       
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/coin/:id' element={<Coin/>}/>
        <Route path='/trending' element={<Trending/>}/>
        <Route path='/watchlist' element={<Watchlist/>}/>
        
      </Routes>
      </BrowserRouter>
      
      
    </div>
  );
}

export default App;
