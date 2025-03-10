import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import Switch from '@mui/material/Switch';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';

export default function AnchorTemporaryDrawer() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') !== 'light' // Default to dark mode
  );

  useEffect(() => {
    setDark(); // Set dark mode as default
  }, []);

  const changeMode = () => {
    if (localStorage.getItem('theme') === 'dark') {
      setLight();
    } else {
      setDark();
    }
    setDarkMode((prevMode) => !prevMode);
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

  return (
    <div>
      <IconButton onClick={() => setOpen(true)}>
        <MenuRoundedIcon className="link" />
      </IconButton>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <div className="drawer-div">
          <Link to='/'><p className='link'>Home</p></Link>
          <Link to='/trending'><p className='link'>Trending<TrendingUpRoundedIcon/></p></Link>
          <Link to='/watchlist'><p className='link'>Watchlist</p></Link>
          <Link to='/dashboard'><p className='link'>Dashboard</p></Link>
          <Switch checked={darkMode} onChange={changeMode} />
        </div>
      </Drawer>
      <ToastContainer />
    </div>
  );
}
