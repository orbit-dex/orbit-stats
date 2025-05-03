'use client'
import React from 'react';

const TradingViewIframe: React.FC = () => (
  <iframe
    src="http://127.0.0.1:9090/"
    style={{
      width: '100%',
      height: '100%',
      border: 'none',
      borderRadius: '16px',
      background: '#111',
      minHeight: 300,
    }}
    title="TradingView Chart"
    allowFullScreen
  />
);

export default TradingViewIframe; 