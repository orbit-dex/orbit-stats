import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
// TODO: Replace these imports with Orbit-specific data hooks/utilities
// import { useMarket, useRaydiumTrades } from '../utils/markets';
// import { getDecimalCount } from '../utils/utils';
// import FloatingElement from './layout/FloatingElement';
// import { TradeLayout } from '../utils/types';

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;
const SizeTitle = styled(Row)`
  padding: 20px 0 14px;
  color: #434a59;
`;

// --- STUB DATA ---
const MOCK_TRADES = [
  { price: 19.17, size: 0.5, side: 'buy', time: Date.now() },
  { price: 19.16, size: 1.2, side: 'sell', time: Date.now() - 10000 },
  { price: 19.15, size: 0.8, side: 'buy', time: Date.now() - 20000 },
];
const BASE_CURRENCY = 'SOL';
const QUOTE_CURRENCY = 'USD';

export default function TradesTable(props) {
  const trades = MOCK_TRADES;
  const loaded = true;
  const baseCurrency = BASE_CURRENCY;
  const quoteCurrency = QUOTE_CURRENCY;

  return (
    <div style={{ background: '#181A20', borderRadius: 8, margin: 8, padding: 8 }}>
      <Title
        style={{
          color: 'rgba(241, 241, 242, 0.75)',
          fontSize: 14,
          borderBottom: '1px solid #1C274F',
          padding: '12px 0 12px 16px',
        }}
      >Recent Market trades</Title>
      <SizeTitle>
        <Col span={8} style={{ textAlign: 'left', paddingRight: 20, color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>Price ({quoteCurrency}) </Col>
        <Col span={8} style={{ textAlign: 'right', paddingRight: 20, color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Size ({baseCurrency})
        </Col>
        <Col span={8} style={{ textAlign: 'right', paddingRight: 20, color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Time
        </Col>
      </SizeTitle>
      {!!trades && loaded && (
        <div
          style={{
            marginRight: '-10px',
            paddingRight: '5px',
            overflowY: 'scroll',
            height: 200
          }}
        >
          {trades.map((trade, i) => (
            <Row key={i} style={{ marginBottom: 4 }}>
              <Col
                span={8}
                style={{
                  color: trade.side === 'buy' ? '#41C77A' : '#F23B69',
                  fontSize: 12,
                }}
              >
                {trade.price}
              </Col>
              <Col span={8} style={{ textAlign: 'right', fontSize: 12 }}>
                {trade.size}
              </Col>
              <Col span={8} style={{ textAlign: 'right', color: '#434a59', fontSize: 12 }}>
                {new Date(trade.time).toLocaleTimeString()}
              </Col>
            </Row>
          ))}
        </div>
      )}
    </div>
  );
} 