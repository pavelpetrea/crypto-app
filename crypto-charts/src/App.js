import './App.css';
import CryptoChart from './components/CryptoChart';
import TopGainersLosers from './components/TopGainers&Losers';
import BasicSelect from './components/SelectCurrency';

function App() {
  return (
      <div className="App">
        <BasicSelect />
          <CryptoChart />   
          <TopGainersLosers />
        </div>
  );
}

export default App;