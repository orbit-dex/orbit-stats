import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

declare global {
  interface Window {
    TradingView: any;
  }
}

export default function TradingViewChart() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: 'BINANCE:ETHUSDT',
          interval: '1',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          save_image: false,
          studies: ['RSI@tv-basicstudies'],
          show_popup_button: true,
          popup_width: '1000',
          popup_height: '650',
          width: '100%',
          height: '100%',
          hide_side_toolbar: false,
          withdateranges: true,
          hide_volume: false,
          hide_legend: false,
          hide_top_toolbar: false,
          details: true,
          hotlist: true,
          calendar: true,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <Box
      ref={containerRef}
      id="tradingview-widget-container"
      w="100%"
      h="600px"
      bg="#181A20"
      borderRadius="lg"
      overflow="hidden"
    />
  );
} 