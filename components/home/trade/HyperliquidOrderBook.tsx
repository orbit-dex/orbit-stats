import React, { useEffect, useState, useMemo } from 'react';
import { Box, Flex, Text, Table, Thead, Tbody, Tr, Th, Td } from '@chakra-ui/react';

function formatNumber(num: number, decimals = 2) {
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

const COIN = 'ETH';
const API_URL = 'https://api.hyperliquid.xyz/info';

const COLORS = {
  askBar: 'rgba(248,113,113,0.15)',
  bidBar: 'rgba(52,211,153,0.15)',
  askText: '#f87171',
  bidText: '#34d399',
  spread: '#a3a3a3',
  spreadBg: '#23272f',
};

export default function HyperliquidOrderBook() {
  const [bids, setBids] = useState<Array<[number, number]>>([]);
  const [asks, setAsks] = useState<Array<[number, number]>>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchOrderBook() {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'l2Book', coin: COIN }),
          signal: controller.signal,
        });
        const data = await res.json();
        console.log('OrderBook API response:', data);
        console.log('OrderBook levels:', data.levels);
        if (data.levels) {
          console.log('Bids:', data.levels[0]);
          console.log('Asks:', data.levels[1]);
        }
        if (isMounted && data && data.levels && Array.isArray(data.levels[0]) && Array.isArray(data.levels[1])) {
          setBids(data.levels[0].slice(0, 15).map(entry => [parseFloat(entry.px), parseFloat(entry.sz)]));
          setAsks(data.levels[1].slice(0, 15).map(entry => [parseFloat(entry.px), parseFloat(entry.sz)]));
        } else if (isMounted) {
          setBids([]);
          setAsks([]);
        }
      } catch (e) {
        if (isMounted) {
          setBids([]);
          setAsks([]);
        }
      }
    }
    fetchOrderBook();
    const interval = setInterval(fetchOrderBook, 2000);
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  // Calculate cumulative totals for depth shading
  const asksWithTotal = useMemo(() => {
    let total = 0;
    return asks
      .filter((entry): entry is [number, number] => Array.isArray(entry) && entry.length === 2)
      .map(([price, size]) => {
        total += size;
        return { price, size, total };
      });
  }, [asks]);
  const bidsWithTotal = useMemo(() => {
    let total = 0;
    return bids
      .filter((entry): entry is [number, number] => Array.isArray(entry) && entry.length === 2)
      .map(([price, size]) => {
        total += size;
        return { price, size, total };
      });
  }, [bids]);
  const maxTotal = useMemo(() => {
    const maxAsk = asksWithTotal.length ? asksWithTotal[asksWithTotal.length - 1].total : 1;
    const maxBid = bidsWithTotal.length ? bidsWithTotal[bidsWithTotal.length - 1].total : 1;
    return Math.max(maxAsk, maxBid, 1);
  }, [asksWithTotal, bidsWithTotal]);

  // Calculate spread
  const bestBid = bids[0]?.[0] || 0;
  const bestAsk = asks[0]?.[0] || 0;
  const spread = bestAsk && bestBid ? bestAsk - bestBid : 0;
  const spreadPct = bestAsk && bestBid ? (spread / bestAsk) * 100 : 0;

  return (
    <Box bg="#181A20" borderRadius="lg" p={2} minW="340px" maxW="380px" mx={2}>
      <Flex align="center" justify="space-between" mb={2}>
        <Text color="white" fontWeight="bold" fontSize="lg">Order Book</Text>
      </Flex>
      <Table variant="unstyled" size="sm" width="100%">
        <Thead>
          <Tr>
            <Th color="#a3a3a3" fontSize="xs" textAlign="right">Price</Th>
            <Th color="#a3a3a3" fontSize="xs" textAlign="right">Size (ETH)</Th>
            <Th color="#a3a3a3" fontSize="xs" textAlign="right">Total (ETH)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {asksWithTotal.length === 0 && bidsWithTotal.length === 0 && (
            <Tr><Td colSpan={3} textAlign="center" color="#a3a3a3">No order book data</Td></Tr>
          )}
          {/* Asks (reverse order for display) */}
          {asksWithTotal.slice().reverse().map(({ price, size, total }, i) => (
            <Tr key={`ask-${i}`}>
              <Td
                color={COLORS.askText}
                textAlign="right"
                position="relative"
                style={{ background: `linear-gradient(to left, ${COLORS.askBar} ${(total / maxTotal) * 100}%, transparent 0%)` }}
              >
                {formatNumber(price, 3)}
              </Td>
              <Td color="white" textAlign="right">{formatNumber(size, 2)}</Td>
              <Td color="white" textAlign="right">{formatNumber(total, 2)}</Td>
            </Tr>
          ))}
          {/* Spread row */}
          <Tr>
            <Td colSpan={3} textAlign="center" color={COLORS.spread} fontWeight="bold" bg={COLORS.spreadBg} fontSize="sm">
              Spread {formatNumber(spread, 3)} ({formatNumber(spreadPct, 3)}%)
            </Td>
          </Tr>
          {/* Bids */}
          {bidsWithTotal.map(({ price, size, total }, i) => (
            <Tr key={`bid-${i}`}>
              <Td
                color={COLORS.bidText}
                textAlign="right"
                position="relative"
                style={{ background: `linear-gradient(to left, ${COLORS.bidBar} ${(total / maxTotal) * 100}%, transparent 0%)` }}
              >
                {formatNumber(price, 3)}
              </Td>
              <Td color="white" textAlign="right">{formatNumber(size, 2)}</Td>
              <Td color="white" textAlign="right">{formatNumber(total, 2)}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
} 