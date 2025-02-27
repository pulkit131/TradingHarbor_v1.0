import React, { useEffect } from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import './styles.css';

function BackToTop() {
  useEffect(() => {
    // Get the button and attach the scroll event listener after the component mounts
    const mybutton = document.getElementById("myBtn");

    function scrollFunction() {
      if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
        mybutton.style.display = "flex";
      } else {
        mybutton.style.display = "none";
      }
    }

    // Attach the event listener
    window.onscroll = scrollFunction;

    // Clean up the event listener when the component unmounts
    return () => {
      window.onscroll = null;
    };
  }, []);

  // When the user clicks on the button, scroll to the top of the document
  function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  return (
    <div className='back-to-top-btn' id='myBtn' onClick={topFunction}>
      <ArrowUpwardRoundedIcon style={{ color: "var(--blue)" }}/>
    </div>
  );
}

export default BackToTop;
