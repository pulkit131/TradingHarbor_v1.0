import React, { useEffect, useState } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';
import AnchorTemporaryDrawer from './drawer';
import Button from '../Button';
import Switch from '@mui/material/Switch';
import { toast } from 'react-toastify';

import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import './styles.css';

function Header() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      setDark();
    } else {
      setLight();
    }
  }, []);

  const changeMode = () => {
    if (localStorage.getItem('theme') !== 'dark') {
      setDark();
    } else {
      setLight();
    }
    setDarkMode(!darkMode);
    toast.success('Theme Changed!');
  };

  const setDark = () => {
    localStorage.setItem('theme', 'dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  };

  const setLight = () => {
    localStorage.setItem('theme', 'light');
    document.documentElement.setAttribute('data-theme', 'light');
  };

  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = Boolean(localStorage.getItem('user'));

  const loginOrLogOut = () => {
    if (isLoggedIn) {
      localStorage.removeItem('user');
      localStorage.removeItem('googleIdToken');
      toast.info('Logged out successfully!');
      if(location.pathname === '/'){
        window.location.reload();
      }
      navigate('/');
    } else {
       if(location.pathname === '/'){
        window.location.reload();
      }
      navigate('/'); 
    }
  };

  const logText = isLoggedIn ? 'Log Out' : 'Log In';

  return (
    <div className='navbar'>
      <h1 className='logo'>
        TradingHarbor<span style={{ color: 'var(--blue)' }}>!</span>
      </h1>
      <div className='links'>
        <Switch checked={darkMode} onClick={changeMode} />
        <Link to='/'><p className='link'>Home</p></Link>
        <Link to='/watchlist'><p className='link'>Watchlist</p></Link>
        <Link to='/trending'><p className='link'>Trending</p></Link>
        <Link to='/dashboard'>
          <Button
            text={"Search"}
            outlined={false}
            onClick={() => console.log("btn Clicked")}
          />
        </Link>
        <Link to='/'><Button text = {logText} outlined= {false}  onClick={loginOrLogOut}></Button></Link>
      </div>
      <div className='mobile-drawer'>
        <AnchorTemporaryDrawer />
      </div>
    </div>
  );
}

export default Header;
