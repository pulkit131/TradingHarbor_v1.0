import React, { useState, useEffect } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SelectDays from '../../Coin/SelectDays';
import './styles.css';
function SelectCoins({allCoins,crypto1,crypto2,handleCoinChange,days,handleDaysChange,}) {
    
    

    const styles=
        {
            height: "2.5rem",
            color: "var(--white)",
            "& .MuiOutlinedInput-notchedOutline": {
               borderColor: "var(--white)",
            },
            "& .MuiSvgIcon-root": {
              color: "var(--white)",
            },
            "&:hover": {
              "&& fieldset": {
                borderColor: "#3a80e9",
              },
          },
      };

    
  return (
    <div className='coins-flex'>
    
        <p>Crypto1:  </p>
      <Select
         sx={styles}
          value={crypto1}
          label="Crypto1"
          onChange={(event)=>handleCoinChange(event,false)}
        >
            {allCoins.filter((item)=>item.id != crypto2).map((coin,i)=>(
                <MenuItem 
                key={i}
                value={coin.id}>{coin.name}</MenuItem>
            ))}
        </Select>  
        <p>Crypto2:  </p>
      <Select
         sx={styles}
          value={crypto2}
          label="Crypto2"
          onChange={(event)=>handleCoinChange(event,true)}
        >
            {allCoins.filter((item)=>item.id != crypto1).map((coin,i)=>(
                <MenuItem 
                key={i}
                value={coin.id}>{coin.name}</MenuItem>
            ))}
        </Select>  
        <SelectDays
          days={days}
          handleDaysChange={handleDaysChange}
          noPTag={true}
        />
        
        
    </div>
  )
}

export default SelectCoins
