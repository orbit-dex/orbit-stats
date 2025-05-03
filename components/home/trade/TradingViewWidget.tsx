'use client'
import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

declare global {
  interface Window {
    TradingView: any;
    Datafeeds: any;
  }
}

const TradingViewWidget: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load both scripts
    const script1 = document.createElement('script');
    script1.src = '/charting_library/charting_library.standalone.js';
    script1.async = true;

    const script2 = document.createElement('script');
    script2.src = '/charting_library/datafeeds/udf/dist/bundle.js';
    script2.async = true;

    document.head.appendChild(script1);
    document.head.appendChild(script2);

    script2.onload = () => {
      if (window.TradingView && window.Datafeeds && containerRef.current) {
        new window.TradingView.widget({
          container: containerRef.current.id,
          locale: 'en',
          library_path: '/charting_library/',
          datafeed: new window.Datafeeds.UDFCompatibleDatafeed('https://demo-feed-data.tradingview.com'),
          symbol: 'AAPL', // Change to your asset, e.g., 'ORBTUSDC'
          interval: '1D',
          fullscreen: false,
          autosize: true,
          debug: true,
        });
      }
    };

    return () => {
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      id="tv_chart_container"
      height="100%"
      width="100%"
      bg="#111"
      borderRadius="xl"
    />
  );
};

export default TradingViewWidget; 