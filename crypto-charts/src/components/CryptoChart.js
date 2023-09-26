import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './CryptoChart.css';
import './MatchMobile.css';
import Chart from 'chart.js/auto';
import { FormControl, MenuItem, Select } from '@mui/material';
import { InputLabel } from '@mui/material';
import Box from '@mui/material/Box';
import DropDownCurrency from './SelectCurrency';

const CryptoChart = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD'); // Inițializează cu valoarea implicită
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('1d');
  const [chartData, setChartData] = useState({});
  const [showChart, setShowChart] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
      },
    })
    .then(response => { 
      setCryptoList(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  }, []);
  

  useEffect(() => {
    if (selectedCrypto && selectedInterval) {
      const { addMonths, differenceInDays } = require('date-fns');
      const currentDate = new Date();
      const lastMonth = addMonths(currentDate, -1);
      const daysInLastMonth = differenceInDays(currentDate, lastMonth);
      const last3Months = addMonths(currentDate, -3);
      const daysInLast3Months = differenceInDays(currentDate, last3Months);
      const last6Months = addMonths(currentDate, -6);
      const daysInLast6Months = differenceInDays(currentDate, last6Months);
      const last12Months = addMonths(currentDate, -12);
      const daysInLast12Months = differenceInDays(currentDate, last12Months);
      let days;
      if (selectedInterval === '1d') {
        days = 1; 
      } else if (selectedInterval === '1w') {
        days = 7;
      } else if (selectedInterval === '1m') {
        days = daysInLastMonth; 
      } else if (selectedInterval === '3m') {
        days = daysInLast3Months; 
      } else if (selectedInterval === '6m') {
        days = daysInLast6Months;
      } else if (selectedInterval === '1y') {
        days = daysInLast12Months;
      }
  
      axios
      .get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`, {
        params: {
          vs_currency: 'usd',
          days, 
        },
      })
      .then((response) => {
        const prices = response.data.prices.map((item) => item[1]);
        const labels = response.data.prices.map((item, index) => {
          const date = new Date(item[0]);
          const day = date.getDate();
          const month = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const hour = date.getHours();
          const minutes = date.getMinutes();
          const currentDay = new Date().getDate();
          const currentMonth = new Date().getMonth();
          const currentYear = new Date().getFullYear();
        
          if (selectedInterval === '1d' && date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
            return `Today, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
          } else if(selectedInterval === '1w') {
            if (date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              return `Today, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
            }
            if (year === currentYear) {
            return `${day} ${month}, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
          } else {
            return `${day} ${month} ${year}, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
        }
          } else if(selectedInterval === '1m') {
            if (date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
             return `Today, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
            }
            if (year === currentYear) {
              return `${day} ${month}, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
          } else {
              return `${day} ${month} ${year}, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
            }
          } else if (selectedInterval === '3m') {
            if (date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              return `Today, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
            }
            if (year === currentYear) {
              return `${day} ${month}`;
            } 
              return `${day} ${month} ${year}`;
          } else if(selectedInterval === '6m') {
            if (date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              return `Today`;
            }
            if (year === currentYear) {
              return `${day} ${month}`;
            } 
              return `${day} ${month} ${year}`;
          } else if (selectedInterval  === '1y') {
            if (date.getDate() === currentDay && date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
              return `Today`;
            }
              return `${day} ${month} ${year}`;
        }
            return `Yesterday, ${hour < 10 ? '0' : ''}${hour}:${minutes < 10 ? '0' : ''}${minutes}`;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price',
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1.2,
            },
          ],
        });
        setShowChart(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  }, [selectedCrypto, selectedInterval]);
  
  useEffect(() => {
    if (chartData.labels && chartData.datasets) {
      const ctx = document.getElementById('cryptoChart');
      if (window.myChart) {
        window.myChart.destroy();
      }
      window.myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
      });
    }
  }, [chartData]);

  const handleChange = (event) => {
    setSelectedCrypto(event.target.value);
  }
 useEffect(() => {
  if (chartData.labels && chartData.datasets) {
    if (window.myChart) {
      window.myChart.destroy();
    }
    
    const ctx = chartRef.current.getContext('2d');

    window.myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: {
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          tooltip: {
            mode: 'index',
          },
        },
        elements : {
          line: {
            tension: 0, 
            borderWidth: 5.3, 
            borderColor: 'rgba(138, 143, 150, 1)', 
          }
        }
      },
    });
    chartRef.current.addEventListener('mousemove', (e) => {
      const chartInstance = window.myChart;
      const activePoints = chartInstance.getElementsAtEventForMode(e, 'nearest', { intersect: false }, false);

      if (activePoints.length > 0) {
        const firstPoint = activePoints[0];
        const xValue = chartInstance.data.labels[firstPoint.index];
        const yValue = chartInstance.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
        ctx.beginPath();
        ctx.moveTo(chartInstance.scales['x'].getPixelForValue(xValue), 0);
        ctx.lineTo(chartInstance.scales['x'].getPixelForValue(xValue), chartInstance.height);
        ctx.strokeStyle = 'rgba(138, 143, 150, 1)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      }
    });
  }
}, [chartData]);
  
  return (
    <div className="crypto-chart">
       <Box sx={{ minWidth: 210 }}>
      <FormControl fullWidth>
      <div className="inputs">
        <InputLabel  sx={{ color: 'white' }}>Select cryptocurrency</InputLabel>
        <Select sx={{ color: 'white', width: '100%' }} className='my-custom-select' label = "" value={selectedCrypto} onChange={handleChange}>
          {cryptoList.map(crypto => (
            <MenuItem  key={crypto.id} value={crypto.id} onChange={handleChange} >
              {crypto.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      </FormControl>
      </Box>
      <canvas id="cryptoChart" ref={chartRef}></canvas>
      <div className="buttons">
          <button onClick={() => setSelectedInterval('1d')} style={{ backgroundColor: selectedInterval === '1d' ? '#474747' : '' }}>1 Day</button>
          <button onClick={() => setSelectedInterval('1w')} style={{ backgroundColor: selectedInterval === '1w' ? '#474747' : '' }}>1 Week</button>
          <button onClick={() => setSelectedInterval('1m')} style={{ backgroundColor: selectedInterval === '1m' ? '#474747' : '' }}>1 Month</button>
          <button onClick={() => setSelectedInterval('3m')} style={{ backgroundColor: selectedInterval === '3m' ? '#474747' : '' }}>3 Months</button>
          <button onClick={() => setSelectedInterval('6m')} style={{ backgroundColor: selectedInterval === '6m' ? '#474747' : '' }}>6 Months</button>
          <button onClick={() => setSelectedInterval('1y')} style={{ backgroundColor: selectedInterval === '1y' ? '#474747' : '' }}>1 Year</button>
        </div>
    </div>
  );
};

export default CryptoChart;