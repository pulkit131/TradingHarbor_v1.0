import React from 'react';
import './styles.css'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

function Search({search,onSearchChange}) {


  return (
    <div className='search-flex'>
        <SearchRoundedIcon/>
      <input 
      placeholder='Search' 
      type='text' 
      valaue={search} 
      onChange={(e)=>onSearchChange(e)}
      />
    </div>
  )
}

export default Search;
