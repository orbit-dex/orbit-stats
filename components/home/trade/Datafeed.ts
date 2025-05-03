export class Datafeed {
  private _configuration: any;
  private _symbol: string;

  constructor(symbol: string) {
    this._symbol = symbol;
    this._configuration = {
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
      exchanges: [
        {
          value: 'Orbit',
          name: 'Orbit',
          desc: 'Orbit Exchange',
        },
      ],
      symbols_types: [
        {
          name: 'crypto',
          value: 'crypto',
        },
      ],
    };
  }

  onReady(callback: (configuration: any) => void) {
    setTimeout(() => callback(this._configuration), 0);
  }

  searchSymbols(
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: (result: any[]) => void
  ) {
    // Implement symbol search logic here
    onResult([]);
  }

  resolveSymbol(
    symbolName: string,
    onResolve: (symbolInfo: any) => void,
    onError: (error: string) => void
  ) {
    const symbolInfo = {
      name: symbolName,
      full_name: symbolName,
      description: symbolName,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      ticker: symbolName,
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '15', '30', '60'],
      supported_resolutions: ['1', '5', '15', '30', '60', '1D', '1W', '1M'],
      volume_precision: 8,
      data_status: 'streaming',
    };

    setTimeout(() => onResolve(symbolInfo), 0);
  }

  async getBars(
    symbolInfo: any,
    resolution: string,
    periodParams: any,
    onResult: (bars: any[], meta: any) => void,
    onError: (error: string) => void
  ) {
    try {
      // Map TradingView resolution to your backend's expected format
      const resMap: Record<string, string> = {
        '1': '1m', '5': '5m', '15': '15m', '30': '30m', '60': '1h', '1D': '1d', '1W': '1w', '1M': '1mth'
      };
      const resolutionStr = resMap[resolution] || '1m';
      const from = periodParams.from;
      const to = periodParams.to;
      const url = `/v1/ohlcv?asset=${this._symbol.replace(/USDC$/, '')}&resolution=${resolutionStr}&from=${from}&to=${to}`;
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('Failed to fetch OHLCV');
      const data = await resp.json();
      // Assume data.bars is an array of {time, open, high, low, close, volume}
      const bars = (data.bars || []).map((bar: any) => ({
        time: bar.time * 1000, // TradingView expects ms
        open: bar.open,
        high: bar.high,
        low: bar.low,
        close: bar.close,
        volume: bar.volume,
      }));
      onResult(bars, { noData: bars.length === 0 });
    } catch (err) {
      // Fallback: generate demo data
      const bars = this._generateDemoBars(periodParams.from, periodParams.to, resolution);
      onResult(bars, { noData: bars.length === 0 });
    }
  }

  subscribeBars(
    symbolInfo: any,
    resolution: string,
    onTick: (bar: any) => void,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ) {
    // For demo: no real-time updates, but you could use websockets here
    // Optionally, poll for new bars every X seconds
  }

  unsubscribeBars(listenerGuid: string) {
    // No-op for now
  }

  _generateDemoBars(from: number, to: number, resolution: string) {
    // Generate fake OHLCV bars for demo
    const bars = [];
    const interval = this._resolutionToSeconds(resolution);
    let t = from;
    let price = 19.0;
    while (t < to) {
      const open = price;
      const close = open + (Math.random() - 0.5) * 0.2;
      const high = Math.max(open, close) + Math.random() * 0.1;
      const low = Math.min(open, close) - Math.random() * 0.1;
      const volume = Math.random() * 1000 + 100;
      bars.push({
        time: t * 1000,
        open,
        high,
        low,
        close,
        volume,
      });
      price = close;
      t += interval;
    }
    return bars;
  }

  _resolutionToSeconds(res: string) {
    if (res.endsWith('D')) return 86400;
    if (res.endsWith('W')) return 604800;
    if (res.endsWith('M')) return 2592000;
    return parseInt(res) * 60;
  }
} 