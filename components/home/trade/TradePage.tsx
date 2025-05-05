import TradingViewWidget from './TradingViewWidget';
import Orderbook from '../../orderbook/Orderbook';
import TradesTable from '../../orderbook/TradesTable';

export default function TradePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%' }}>
      {/* TradingView Chart */}
      <div style={{ flex: 2, minWidth: 0 }}>
        <TradingViewWidget />
      </div>
      {/* Order Book and Trades */}
      <div style={{ flex: 1, minWidth: 350, display: 'flex', flexDirection: 'column' }}>
        <Orderbook />
        <TradesTable />
      </div>
    </div>
  );
} 