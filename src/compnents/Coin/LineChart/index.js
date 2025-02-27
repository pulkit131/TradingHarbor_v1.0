import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto"; //Dont get rid of this
import { convertNumber } from "../../../functions/convertNumbers";

function LineChart({ chartData,priceType, multiAxis }) {
  const options = {
    plugins: {
      legend: {
        display: multiAxis ? true : false,
      },
    },
    responsive: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales:{
      crypto1:{
        type:"linear",
        display:true,
        position:"left",
        ticks:{
          callback: function(value, index, ticks){
            if(priceType=="prices"){
            return "$" + value.toLocaleString();
            }else{
              return "$"+ convertNumber(value);
            }
          }
        }
      },
      crypto2:{
        type:"linear",
        display:true,
        position:"right",
        ticks:{
          callback: function(value, index, ticks){
            if(priceType=="prices"){
            return "$" + value.toLocaleString();
            }else{
              return "$"+ convertNumber(value);
            }
          }
        }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default LineChart;