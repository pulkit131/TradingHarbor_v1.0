import React from 'react';
import './styles.css';
import Button from '../../Common/Button';
import iphone from '../../../assets/iphone.png';
import gradient from '../../../assets/gradient.png';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { RWebShare } from "react-web-share";
import { toast } from "react-toastify";
function MainComponent() {
  return (
    <div className='flex-info'>
      <div className='left-component'>
        <motion.h1 
        className='crypto-heading'
        initial={{opacity:0,x:50}}
        animate={{opacity:1,x:0}}
        transition={{duration:0.5}}
        >
          Analyze Stocks,</motion.h1>      
        <motion.h1 className='real-time-heading'
        initial={{opacity:0,x:50}}
        animate={{opacity:1,x:0}}
        transition={{duration:0.5,delay:0.5}}
        >Trade Smarter.</motion.h1>
        <motion.p className='info-text'
        initial={{opacity:0,x:50}}
        animate={{opacity:1,x:0}}
        transition={{duration:0.5,delay:1}}
        >Leverage AI-powered news analysis to predict stock market trends with precision.</motion.p>
        <motion.div className='btn-flex'
        initial={{opacity:0,y:50}}
        animate={{opacity:1,y:0}}
        transition={{duration:0.5,delay:1.5}}
        
        >
          <Link to="/dashboard"><Button text={"Dashboard"} onClick={()=>console.log("btn Clicked")}/></Link>
          <RWebShare
            data={{
              text: "Stock Market Analysis App",
              url: "",
              title: "TradingHarbor",
            }}
            onClick={() => toast.info("App Shared!")}
          >
            <Button text={"Share App"} outlined={true} />
          </RWebShare>

        </motion.div>
        </div>
      <div className='phone-container'>
        <motion.img src={iphone} className='iphone'
          initial={{y:-10}}
          animate={{y:10}}
          transition={{
            type:"smooth",
            repeatType:"mirror",
            duration:2,
            repeat:Infinity}}
        
        />
        <img src={gradient} alt='' className='gradient'/>
      </div>
    </div>
  )
}

export default MainComponent
