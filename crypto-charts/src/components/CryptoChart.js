import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CryptoChart.css';

import Chart from 'chart.js/auto';

const CryptoChart = () => {
  const [topGainers, setSelectedTopGainers] = useState([]);
  const [topLosers, setSelectedTopLosers] = useState([]);
  const [cryptoList, setCryptoList] = useState([]);
  const [selectedCrypto, setSelectedCrypto] = useState('');
  const [selectedInterval, setSelectedInterval] = useState('1w');
  const [chartData, setChartData] = useState({});
  
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
    if (cryptoList.length > 0) {
      const sortedCryptoList = [...cryptoList];
      sortedCryptoList.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
      setSelectedTopGainers(sortedCryptoList.slice(0, 5));
      sortedCryptoList.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h);
      setSelectedTopLosers(sortedCryptoList.slice(0, 5));
    }
  }, [cryptoList]);
  
  useEffect(() => {
    axios
      .get('https://api.coingecko.com/api/v3/coins/markets', {
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
  
        const sortedCryptoList = [...response.data];
        sortedCryptoList.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  
        const topGainers = sortedCryptoList.slice(0, 5);
        const topLosers = sortedCryptoList.slice(-5).reverse();
  
        setSelectedTopGainers(topGainers);
        setSelectedTopLosers(topLosers);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);
  
  
  const sortedCryptoListByPriceChange = [...cryptoList];
  const sortedCryptoListByPriceChangeInverse = [...cryptoList];
  useEffect(() => {
    if (selectedCrypto) {
      axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCrypto}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: selectedInterval,
          },
        }
      )
      .then(response => {
        const prices = response.data.prices.map((item) => item[1]);
        const labels = response.data.prices.map((item) => new Date(item[0]).toLocaleDateString());

        setChartData({
          labels,
          datasets: [
            {
              label: 'Price',
              data: prices,
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 2,
            },
          ],
        });
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

  return (
    <div className="crypto-chart">
      <div className="inputs">
        <select value={selectedCrypto} onChange={e => setSelectedCrypto(e.target.value)}>
          <option value="">Select a Cryptocurrency</option>
          {cryptoList.map(crypto => (
            <option key={crypto.id} value={crypto.id}>
              {crypto.name}
            </option>
          ))}
        </select>
        <div className="buttons">
          <button onClick={() => setSelectedInterval('1w')}>1 Week</button>
          <button onClick={() => setSelectedInterval('1m')}>1 Month</button>
          <button onClick={() => setSelectedInterval('3m')}>3 Months</button>
        </div>
      </div>
      <canvas id="cryptoChart" width={800} height={400}></canvas>
      <div className="top-crypto-list">
        <div className="top-gainers">
          <h2>Top 5 Gainers</h2>
          <ul>
            {topGainers.map(crypto => (
              <li key={crypto.id}>{crypto.name} ({crypto.price_change_percentage_24h.toFixed(2)}%)</li>
            ))}
          </ul>
        </div>
        <div className="top-losers">
          <h2>Top 5 Losers</h2>
          <ul>
            {topLosers.map(crypto => (
              <li key={crypto.id}>{crypto.name} ({crypto.price_change_percentage_24h.toFixed(2)}%)</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CryptoChart;