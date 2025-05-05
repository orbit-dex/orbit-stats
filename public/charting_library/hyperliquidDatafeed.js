class HyperliquidDatafeed {
  constructor(symbol = "ETH-USD") {
    this.symbol = symbol;
    this.ws = null;
    this.depthCallbacks = {};
    this.connect();
  }

  connect() {
    this.ws = new WebSocket("wss://api.hyperliquid.xyz/ws");
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        method: "subscribe",
        params: {
          channels: [
            {
              name: "l2Book",
              symbols: [this.symbol]
            }
          ]
        }
      }));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.channel === "l2Book" && data.data && data.data.symbol === this.symbol) {
        this.handleOrderBookUpdate(data.data);
      }
    };

    this.ws.onclose = () => {
      // Optionally implement reconnect logic
      setTimeout(() => this.connect(), 2000);
    };
  }

  // TradingView DOM (Order Book) subscription
  subscribeDepth(symbolInfo, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) {
    this.depthCallbacks[subscribeUID] = onRealtimeCallback;
  }

  unsubscribeDepth(subscribeUID) {
    delete this.depthCallbacks[subscribeUID];
  }

  handleOrderBookUpdate(orderBook) {
    // Convert Hyperliquid order book format to TradingView DOM format if needed
    // Example: { bids: [[price, size], ...], asks: [[price, size], ...] }
    Object.values(this.depthCallbacks).forEach(cb => {
      cb({
        bids: orderBook.bids,
        asks: orderBook.asks,
        // Add other fields if required by TradingView
      });
    });
  }

  // Implement other required TradingView Datafeed API methods as stubs
  onReady(cb) { setTimeout(() => cb({ supports_order_book: true }), 0); }
  resolveSymbol(symbolName, onSymbolResolvedCallback) {
    onSymbolResolvedCallback({
      name: symbolName,
      ticker: symbolName,
      type: "crypto",
      session: "24x7",
      exchange: "Hyperliquid",
      minmov: 1,
      pricescale: 100,
      has_intraday: true,
      has_no_volume: false,
      supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
    });
  }
  getBars() {}
  subscribeBars() {}
  unsubscribeBars() {}
}

window.HyperliquidDatafeed = HyperliquidDatafeed; 