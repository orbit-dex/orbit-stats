'use client'
import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Grid, Input, InputGroup, Button, Table, Thead, Tbody, Tr, Th, Td, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';

type TradeType = {
  id: string;
  price: number;
  size: number;
  timestamp: number;
  // add other fields as needed
};

// Types for balances and order book

type BalanceType = {
  asset: string;
  available: number;
  total: number;
};

type OrderBookEntry = {
  price: number;
  size: number;
};

type OrderBookType = {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
};

const Trade: React.FC = () => {
  const [trades, setTrades] = useState<TradeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for balances
  const [balances, setBalances] = useState<BalanceType[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState<string | null>(null);

  // Add state for order book
  const [orderBook, setOrderBook] = useState<OrderBookType>({ bids: [], asks: [] });
  const [orderBookLoading, setOrderBookLoading] = useState(false);
  const [orderBookError, setOrderBookError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/v1/trades?asset=ORBT&limit=20')
      .then(res => res.json())
      .then(data => {
        setTrades(data.trades || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch trades');
        setLoading(false);
      });
  }, []);

  // Fetch balances
  useEffect(() => {
    setBalancesLoading(true);
    setBalancesError(null);
    fetch('/v1/balances?user_id=demo')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch balances');
        return res.json();
      })
      .then((data) => {
        // Assume data.balances is an array
        setBalances(data.balances || []);
        setBalancesLoading(false);
      })
      .catch((err) => {
        setBalancesError(err.message);
        setBalancesLoading(false);
      });
  }, []);

  // Fetch order book
  useEffect(() => {
    setOrderBookLoading(true);
    setOrderBookError(null);
    fetch('/v1/orderbook?asset=ORBT')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch order book');
        return res.json();
      })
      .then((data) => {
        // Assume data.bids and data.asks are arrays
        setOrderBook({
          bids: data.bids || [],
          asks: data.asks || [],
        });
        setOrderBookLoading(false);
      })
      .catch((err) => {
        setOrderBookError(err.message);
        setOrderBookLoading(false);
      });
  }, []);

  return (
    <Grid templateColumns="1fr 500px" gap={0} height="calc(100vh - 80px)">
      {/* Main Trading Area */}
      <Box bg="black" p={4}>
        {/* Token Info Bar */}
        <Flex justify="space-between" align="center" mb={4} bg="#111" p={4} borderRadius="xl">
          <Flex align="center" gap={4}>
            <Text fontSize="2xl" fontWeight="bold" color="white">ORBT/USDC</Text>
            <Text color="#4A5568">$19.167</Text>
            <Text color="#A78BFA">+4.12%</Text>
          </Flex>
          <Flex gap={4} align="center">
            <Box>
              <Text color="#4A5568" fontSize="sm">24h Volume</Text>
              <Text color="white" fontWeight="medium">$5,421,124</Text>
            </Box>
            <Box>
              <Text color="#4A5568" fontSize="sm">Market Cap</Text>
              <Text color="white" fontWeight="medium">$92.92M</Text>
            </Box>
          </Flex>
        </Flex>

        {/* Main Content Grid */}
        <Grid templateColumns="1fr 500px" gap={4}>
          <Box>
            {/* Chart Area Placeholder */}
            <Box 
              height="calc(100vh - 440px)" 
              minHeight="300px"
              bg="#111" 
              borderRadius="xl"
              p={4}
              mb={4}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="#4A5568" fontSize="lg">
                TradingView Chart Integration Coming Soon
              </Text>
            </Box>

            {/* Trading Tabs */}
            <Box bg="#111" borderRadius="xl">
              <Tabs variant="unstyled">
                <TabList borderBottom="1px solid #222" px={4}>
                  {[
                    'Balances',
                    'Positions',
                    'Open Orders',
                    'TWAP',
                    'Trade History',
                    'Funding History',
                    'Order History'
                  ].map((tab) => (
                    <Tab
                      key={tab}
                      color="#4A5568"
                      _selected={{ color: 'white' }}
                      _hover={{ color: 'white' }}
                      fontSize="sm"
                      py={3}
                      px={4}
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>
                <TabPanels p={4}>
                  <TabPanel>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color="#4A5568">Coin</Th>
                          <Th color="#4A5568">Total Balance</Th>
                          <Th color="#4A5568">Available Balance</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        <Tr>
                          <Td color="white">ORBT</Td>
                          <Td color="white">0.00</Td>
                          <Td color="white">0.00</Td>
                        </Tr>
                        <Tr>
                          <Td color="white">USDC</Td>
                          <Td color="white">0.00</Td>
                          <Td color="white">0.00</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No open positions</Text>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No open orders</Text>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No TWAP orders</Text>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No trade history</Text>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No funding history</Text>
                  </TabPanel>
                  <TabPanel>
                    <Text color="#4A5568">No order history</Text>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Box>

          {/* Order Book and Recent Trades Tabs */}
          <Box bg="#111" borderRadius="xl" height="calc(100vh - 140px)" maxHeight="1000px">
            <Tabs variant="unstyled" height="100%">
              <TabList borderBottom="1px solid #222" px={4}>
                <Tab
                  color="#4A5568"
                  _selected={{ color: 'white', borderBottom: '2px solid #A78BFA' }}
                  _hover={{ color: 'white' }}
                  fontSize="sm"
                  py={3}
                  px={4}
                >
                  Balances
                </Tab>
                <Tab
                  color="#4A5568"
                  _selected={{ color: 'white', borderBottom: '2px solid #A78BFA' }}
                  _hover={{ color: 'white' }}
                  fontSize="sm"
                  py={3}
                  px={4}
                >
                  Order Book
                </Tab>
                <Tab
                  color="#4A5568"
                  _selected={{ color: 'white', borderBottom: '2px solid #A78BFA' }}
                  _hover={{ color: 'white' }}
                  fontSize="sm"
                  py={3}
                  px={4}
                >
                  Recent Trades
                </Tab>
              </TabList>
              <TabPanels height="calc(100% - 45px)" overflowY="auto">
                <TabPanel p={4} height="100%">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg="#111" zIndex={1}>
                      <Tr>
                        <Th color="#4A5568">Asset</Th>
                        <Th color="#4A5568">Available</Th>
                        <Th color="#4A5568">Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {balancesLoading ? (
                        <Tr><Td colSpan={3} color="#A78BFA" textAlign="center">Loading...</Td></Tr>
                      ) : balancesError ? (
                        <Tr><Td colSpan={3} color="red.400" textAlign="center">{balancesError}</Td></Tr>
                      ) : balances.length === 0 ? (
                        <Tr><Td colSpan={3} color="#A78BFA" textAlign="center">No balances found</Td></Tr>
                      ) : (
                        balances.map((bal, i) => (
                          <Tr key={i}>
                            <Td color="white">{bal.asset}</Td>
                            <Td color="#00FFD1">{bal.available}</Td>
                            <Td color="#A78BFA">{bal.total}</Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </TabPanel>
                <TabPanel p={4} height="100%">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg="#111" zIndex={1}>
                      <Tr>
                        <Th color="#4A5568" width="33%">Price</Th>
                        <Th color="#4A5568" width="33%">Size</Th>
                        <Th color="#4A5568" width="33%">Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {orderBookLoading ? (
                        <Tr><Td colSpan={3} color="#A78BFA" textAlign="center">Loading...</Td></Tr>
                      ) : orderBookError ? (
                        <Tr><Td colSpan={3} color="red.400" textAlign="center">{orderBookError}</Td></Tr>
                      ) : (orderBook.asks.length === 0 && orderBook.bids.length === 0) ? (
                        <Tr><Td colSpan={3} color="#A78BFA" textAlign="center">No order book data</Td></Tr>
                      ) : (
                        <>
                          {/* Asks (sell orders, usually shown on top, red) */}
                          {orderBook.asks.map((ask, i) => (
                            <Tr key={`ask-${i}`}>
                              <Td color="#FF3B3B">{ask.price}</Td>
                              <Td color="white">{ask.size}</Td>
                              <Td color="#4A5568">{(ask.price * ask.size).toFixed(2)}</Td>
                            </Tr>
                          ))}
                          {/* Mid price separator (optional) */}
                          <Tr>
                            <Td colSpan={3} textAlign="center" py={2}>
                              <Text color="#A78BFA" fontSize="sm" fontWeight="bold">
                                {orderBook.asks.length > 0 && orderBook.bids.length > 0 ? ((orderBook.asks[0].price + orderBook.bids[0].price) / 2).toFixed(3) : '--'}
                              </Text>
                            </Td>
                          </Tr>
                          {/* Bids (buy orders, usually shown below, green) */}
                          {orderBook.bids.map((bid, i) => (
                            <Tr key={`bid-${i}`}>
                              <Td color="#00FFD1">{bid.price}</Td>
                              <Td color="white">{bid.size}</Td>
                              <Td color="#4A5568">{(bid.price * bid.size).toFixed(2)}</Td>
                            </Tr>
                          ))}
                        </>
                      )}
                    </Tbody>
                  </Table>
                </TabPanel>
                <TabPanel p={4} height="100%">
                  <Table variant="simple" size="sm">
                    <Thead position="sticky" top={0} bg="#111" zIndex={1}>
                      <Tr>
                        <Th color="#4A5568" width="33%">Price</Th>
                        <Th color="#4A5568" width="33%">Size</Th>
                        <Th color="#4A5568" width="33%">Time</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {loading ? (
                        <Tr>
                          <Td colSpan={3} color="#A78BFA" textAlign="center">Loading...</Td>
                        </Tr>
                      ) : error ? (
                        <Tr>
                          <Td colSpan={3} color="red.400" textAlign="center">{error}</Td>
                        </Tr>
                      ) : trades.length === 0 ? (
                        <Tr>
                          <Td colSpan={3} color="#A78BFA" textAlign="center">No trades found</Td>
                        </Tr>
                      ) : (
                        trades.map((trade) => (
                          <Tr key={trade.id}>
                            <Td color="#00FFD1">{trade.price}</Td>
                            <Td color="white">{trade.size}</Td>
                            <Td color="#4A5568">{
                              new Date(
                                (typeof trade.timestamp === 'string'
                                  ? parseInt(trade.timestamp)
                                  : trade.timestamp) * 1000
                              ).toLocaleTimeString()
                            }</Td>
                          </Tr>
                        ))
                      )}
                    </Tbody>
                  </Table>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Grid>
      </Box>

      {/* Trading Panel */}
      <Box bg="#111" p={4} borderRight="1px solid #222">
        <Flex gap={2} mb={4}>
          <Button
            flex={1}
            bg="#A78BFA"
            color="black"
            _hover={{ bg: '#8B5CF6' }}
            borderRadius="xl"
          >
            Buy
          </Button>
          <Button
            flex={1}
            bg="#FF3B3B"
            color="white"
            _hover={{ opacity: 0.8 }}
            borderRadius="xl"
          >
            Sell
          </Button>
        </Flex>

        <Box mb={6}>
          <Text color="#4A5568" mb={2}>Price</Text>
          <InputGroup>
            <Input
              placeholder="0.00"
              bg="#0A0A0A"
              border="1px solid #222"
              _hover={{ borderColor: '#A78BFA' }}
              _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }}
              color="white"
              borderRadius="xl"
            />
          </InputGroup>
        </Box>

        <Box mb={6}>
          <Text color="#4A5568" mb={2}>Size (ORBT)</Text>
          <InputGroup>
            <Input
              placeholder="0.00"
              bg="#0A0A0A"
              border="1px solid #222"
              _hover={{ borderColor: '#A78BFA' }}
              _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }}
              color="white"
              borderRadius="xl"
            />
          </InputGroup>
        </Box>

        <Box mb={6}>
          <Text color="#4A5568" mb={2}>Order Type</Text>
          <Select
            bg="#0A0A0A"
            border="1px solid #222"
            color="white"
            _hover={{ borderColor: '#A78BFA' }}
            _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }}
            borderRadius="xl"
          >
            <option value="limit">Limit</option>
            <option value="market">Market</option>
          </Select>
        </Box>

        <Box bg="#0A0A0A" p={4} borderRadius="xl" mb={4}>
          <Flex justify="space-between" mb={2}>
            <Text color="#4A5568">Available Balance</Text>
            <Text color="white">0.00 USDC</Text>
          </Flex>
          <Flex justify="space-between">
            <Text color="#4A5568">Est. Fee</Text>
            <Text color="white">0.00 USDC</Text>
          </Flex>
        </Box>

        <Button
          width="100%"
          bg="#A78BFA"
          color="black"
          _hover={{ bg: '#8B5CF6' }}
          borderRadius="xl"
          isDisabled
        >
          Connect Wallet to Trade
        </Button>
      </Box>
    </Grid>
  );
};

export default Trade;
