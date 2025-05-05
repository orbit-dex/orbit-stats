import { Col, Row } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const Title = styled.div`
  color: rgba(255, 255, 255, 1);
`;
const SizeTitle = styled(Row)`
  padding: 16px 0 12px;
  color: #434a59;
`;
const MarkPriceTitle = styled(Row)`
  padding: 15px 0 12px;
  font-weight: 700;
`;
const Line = styled.div`
  text-align: right;
  float: right;
  height: 100%;
  ${(props) =>
    props['data-width'] &&
    css`
      width: ${props['data-width']};
    `}
  ${(props) =>
    props['data-bgcolor'] &&
    css`
      background-color: ${props['data-bgcolor']};
    `}
`;
const Price = styled.div`
  position: absolute;
  right: 5px;
  color: white;
`;

// --- STUB DATA ---
const MOCK_BIDS = [
  [19.16, 2.5],
  [19.15, 1.2],
  [19.14, 0.8],
];
const MOCK_ASKS = [
  [19.17, 1.1],
  [19.18, 2.0],
  [19.19, 0.5],
];
const MOCK_MARK_PRICE = 19.165;
const BASE_CURRENCY = 'SOL';
const QUOTE_CURRENCY = 'USD';

export default function Orderbook(props) {
  // Stubbed data instead of hooks
  const markPrice = MOCK_MARK_PRICE;
  const orderbook = { bids: MOCK_BIDS, asks: MOCK_ASKS };
  const baseCurrency = BASE_CURRENCY;
  const quoteCurrency = QUOTE_CURRENCY;

  const currentOrderbookData = useRef(null);
  const lastOrderbookData = useRef(null);
  const [orderbookData, setOrderbookData] = useState({ bids: [], asks: [] });

  useEffect(() => {
    let bids = orderbook?.bids || [];
    let asks = orderbook?.asks || [];
    let sum = (total, [, size], index) => (index < depth ? total + size : total);
    let totalSize = bids.reduce(sum, 0) + asks.reduce(sum, 0);
    let bidsToDisplay = getCumulativeOrderbookSide(bids, totalSize, false);
    let asksToDisplay = getCumulativeOrderbookSide(asks, totalSize, true);
    setOrderbookData({ bids: bidsToDisplay, asks: asksToDisplay });
  }, [orderbook, depth]);

  function getCumulativeOrderbookSide(orders, totalSize, backwards = false) {
    let cumulative = orders
      .slice(0, depth)
      .reduce((cumulative, [price, size], i) => {
        const cumulativeSize = (cumulative[i - 1]?.cumulativeSize || 0) + size;
        cumulative.push({
          price,
          size,
          cumulativeSize,
          sizePercent: Math.round((cumulativeSize / (totalSize || 1)) * 100),
        });
        return cumulative;
      }, []);
    if (backwards) {
      cumulative = cumulative.reverse();
    }
    return cumulative;
  }

  return (
    <div style={{ background: '#181A20', borderRadius: 8, margin: 8, padding: 8 }}>
      <Title
        style={{
          borderTop: '1px solid #1C274F',
          borderBottom: '1px solid #1C274F',
          padding: '12px 0 12px 16px',
          color: 'rgba(241, 241, 242, 0.75)',
          fontSize: 14,
        }}
      >
        Order book
      </Title>
      <SizeTitle>
        <Col span={12} style={{ textAlign: 'right', color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Size ({baseCurrency})
        </Col>
        <Col span={12} style={{ textAlign: 'right', paddingRight: 20, color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Price ({quoteCurrency})
        </Col>
      </SizeTitle>
      <div style={{ paddingBottom: 16 }}>
        {orderbookData.asks.map(({ price, size, sizePercent }) => (
          <OrderbookRow
            key={price + ''}
            price={price}
            size={size}
            side={'sell'}
            sizePercent={sizePercent}
            onPriceClick={() => onPrice(price)}
            onSizeClick={() => onSize(size)}
          />
        ))}
      </div>
      <MarkPriceComponent markPrice={markPrice} />
      <SizeTitle>
        <Col span={12} style={{ textAlign: 'right', color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Size ({baseCurrency})
        </Col>
        <Col span={12} style={{ textAlign: 'right', paddingRight: 20, color: 'rgba(241, 241, 242, 0.5)', fontSize: 12 }}>
          Price ({quoteCurrency})
        </Col>
      </SizeTitle>
      {orderbookData.bids.map(({ price, size, sizePercent }) => (
        <OrderbookRow
          key={price + ''}
          price={price}
          size={size}
          side={'buy'}
          sizePercent={sizePercent}
          onPriceClick={() => onPrice(price)}
          onSizeClick={() => onSize(size)}
        />
      ))}
    </div>
  );
}

const OrderbookRow = React.memo(
  ({ side, price, size, sizePercent, onSizeClick, onPriceClick }) => {
    return (
      <Row style={{ marginBottom: 3, fontSize: 12 }} onClick={onSizeClick}>
        <Col span={12} style={{ textAlign: 'right' }}>{size}</Col>
        <Col span={12} style={{ textAlign: 'right', position: 'relative' }}>
          <Line
            data-width={sizePercent + '%'}
            data-bgcolor={
              side === 'buy'
                ? 'rgba(65, 199, 122, 0.6)'
                : 'rgba(242, 60, 105, 0.6)'
            }
          />
          <Price onClick={onPriceClick}>{price}</Price>
        </Col>
      </Row>
    );
  }
);

const MarkPriceComponent = React.memo(({ markPrice }) => {
  return (
    <MarkPriceTitle
      justify="center"
      style={{
        borderTop: '1px solid #1C274F',
        borderBottom: '1px solid #1C274F',
        fontSize: 16,
      }}
    >
      <Col style={{ color: 'white' }}>{markPrice}</Col>
    </MarkPriceTitle>
  );
}); 