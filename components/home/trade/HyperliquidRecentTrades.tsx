import React, { useEffect, useState } from 'react';
import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from '@chakra-ui/react';

const COIN = 'ETH';
const API_URL = 'https://api.hyperliquid.xyz/info';

function formatNumber(num: number | undefined, decimals = 2) {
  if (typeof num !== 'number' || isNaN(num)) return '--';
  return num.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

export default function HyperliquidRecentTrades() {
  const [trades, setTrades] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    async function fetchTrades() {
      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'recentTrades', coin: COIN }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (isMounted && Array.isArray(data)) {
          setTrades(data.slice(0, 18));
        }
      } catch (e) {
        if (isMounted) setTrades([]);
      }
    }
    fetchTrades();
    const interval = setInterval(fetchTrades, 2000);
    return () => {
      isMounted = false;
      controller.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <Box bg="#181A20" borderRadius="lg" p={2} minW="340px" maxW="380px" mx={2} display="flex" flexDirection="column" minHeight="500px" height="100%">
      <Text color="white" fontWeight="bold" fontSize="lg" mb={2}>Recent Trades</Text>
      <Box flex="1 1 0" overflowY="auto">
        <Table variant="unstyled" size="sm" width="100%">
          <Thead>
            <Tr>
              <Th color="#a3a3a3" fontSize="xs" textAlign="right">Time</Th>
              <Th color="#a3a3a3" fontSize="xs" textAlign="right">Price</Th>
              <Th color="#a3a3a3" fontSize="xs" textAlign="right">Size (ETH)</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trades.length === 0 && (
              <Tr><Td colSpan={3} textAlign="center" color="#a3a3a3">No recent trades</Td></Tr>
            )}
            {trades.map((trade, i) => (
              <Tr key={i}>
                <Td color="#a3a3a3" textAlign="right">{new Date(trade.time).toLocaleTimeString()}</Td>
                <Td color={trade.side === 'B' ? '#34d399' : '#f87171'} textAlign="right">{formatNumber(parseFloat(trade.px), 3)}</Td>
                <Td color="white" textAlign="right">{formatNumber(parseFloat(trade.sz), 3)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
} 