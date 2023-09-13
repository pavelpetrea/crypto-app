import './App.css';
import CryptoChart from './components/CryptoChart';

function App() {
  return (
      <div className="App">
        <h1 id="title">Crypto charts today</h1>
          <CryptoChart />
        </div>
  );
}
export default App;