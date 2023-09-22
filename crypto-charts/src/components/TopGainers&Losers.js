import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TopGainers&Losers.css';


const TopGainersLosers = () => {
    const [topGainers, setSelectedTopGainers] = useState([]);
    const [topLosers, setSelectedTopLosers] = useState([]);
    const [cryptoList, setCryptoList] = useState([]);

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

return (
    <div className="crypto-chartss">
    <div className="top-crypto-list">
        <div className="top-gainers">
          <h2>Top Gainers</h2>
          <ul>
            {topGainers.map(crypto => (
              <li key={crypto.id}>{crypto.name} ({crypto.price_change_percentage_24h.toFixed(2)}%)</li>
            ))}
          </ul>
        </div>
        <div className="top-losers">
          <h2>Top Losers</h2>
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
export default TopGainersLosers;