'use client'
import React, { useEffect, useState } from 'react';
import { Box, Text, Flex, Grid, Input, InputGroup, Button, Table, Thead, Tbody, Tr, Th, Td, Select, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { ChevronDownIcon, StarIcon } from '@chakra-ui/icons';
import HyperliquidOrderBook from './HyperliquidOrderBook';
import HyperliquidRecentTrades from './HyperliquidRecentTrades';

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

// Add a mapping for pair icons (placeholder: colored circle with initials)
const pairIcons: Record<string, JSX.Element> = {
  'BTC/USD': <Box as="span" bg="#F7931A" color="white" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">BTC</Box>,
  'ETH/USD': <Box as="span" bg="#627EEA" color="white" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">ETH</Box>,
  'SOL/USD': <Box as="span" bg="#00FFA3" color="black" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">SOL</Box>,
  'SPX/USD': <Box as="span" bg="#A78BFA" color="black" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">SPX</Box>,
  'DJI/USD': <Box as="span" bg="#4A5568" color="white" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">DJI</Box>,
  'NDX/USD': <Box as="span" bg="#16C784" color="black" borderRadius="full" px={2} py={1} fontWeight="bold" fontSize="sm" mr={2} display="inline-block">NDX</Box>,
};

const TradingViewWidget = dynamic(() => import('./TradingViewWidget'), { ssr: false });

const Trade: React.FC = () => {
  const [trades, setTrades] = useState<TradeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add state for balances
  const [balances, setBalances] = useState<BalanceType[]>([]);
  const [balancesLoading, setBalancesLoading] = useState(false);
  const [balancesError, setBalancesError] = useState<string | null>(null);

  const [isBuy, setIsBuy] = useState(true);
  const [orderTab, setOrderTab] = useState<'Market' | 'Limit' | 'Pro'>('Limit');
  const [leverageTab, setLeverageTab] = useState<'Cross' | '5x' | 'One-Way'>('Cross');
  const [showTPSL, setShowTPSL] = useState(false);
  const [selectedPair, setSelectedPair] = useState('ETH-USD');
  const [pairDropdownOpen, setPairDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [starredPairs, setStarredPairs] = useState<string[]>([]);
  const pairsData = [
    { symbol: 'ETH-USD', lastPrice: '1,826.2', change: '+10.8 / +0.59%', funding: '-0.0120%', volume: '$598,432,687', openInterest: '$512,487,646' },
  ];
  const filteredPairs = pairsData.filter(pair => pair.symbol.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    fetch('/v1/trades?asset=ORBIT&limit=20')
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

  return (
    <Grid templateColumns="8fr 2fr 2fr" gap={0} height="100vh" minHeight="100vh">
      {/* Chart + Tabs Area */}
      <Box bg="black" p={0} borderTopLeftRadius="xl" borderBottomLeftRadius="xl" height="100%" display="flex" flexDirection="column">
        <Flex direction="column" mb={0} bg="#111" p={4} borderTopLeftRadius="xl" borderTopRightRadius="xl">
          <Flex align="center" gap={8} position="relative" direction="row">
            {/* Pair dropdown, now inline with stats */}
            <Box position="relative" mr={8} minW="180px">
              <Flex
                align="center"
                cursor="pointer"
                onClick={() => setPairDropdownOpen((open) => !open)}
                bg="transparent"
                borderRadius="md"
                px={2}
                py={1}
                _hover={{ bg: '#222' }}
              >
                {pairIcons[selectedPair]}
                <Text fontSize="3xl" fontWeight="bold" color="white" mr={1}>{selectedPair}</Text>
                <ChevronDownIcon color="#A78BFA" boxSize={7} />
              </Flex>
              {pairDropdownOpen && (
                <Box
                  position="absolute"
                  top="110%"
                  left={0}
                  bg="#181818"
                  borderRadius="lg"
                  boxShadow="2xl"
                  zIndex={20}
                  minW="600px"
                  border="1px solid #222"
                  p={4}
                >
                  {/* Search Bar */}
                  <Input
                    placeholder="Search coins..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    mb={4}
                    bg="#111"
                    color="white"
                    border="1px solid #222"
                    _placeholder={{ color: '#4A5568' }}
                  />
                  {/* Table */}
                  <Box overflowY="auto" maxH="320px">
                    <Table variant="unstyled" size="sm">
                      <Thead>
                        <Tr>
                          <Th color="#4A5568">Symbol</Th>
                          <Th color="#4A5568">Last Price</Th>
                          <Th color="#4A5568">24hr Change</Th>
                          <Th color="#4A5568">8hr Funding</Th>
                          <Th color="#4A5568">Volume</Th>
                          <Th color="#4A5568">Open Interest</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {filteredPairs.map(pair => (
                          <Tr
                            key={pair.symbol}
                            cursor="pointer"
                            _hover={{ bg: '#222' }}
                            bg={selectedPair === pair.symbol ? '#222' : 'transparent'}
                            onClick={() => {
                              setSelectedPair(pair.symbol);
                              setPairDropdownOpen(false);
                            }}
                          >
                            <Td
                              color="white"
                              width="1%"
                              pr={0}
                              onClick={e => {
                                e.stopPropagation();
                                setStarredPairs(prev => prev.includes(pair.symbol)
                                  ? prev.filter(s => s !== pair.symbol)
                                  : [...prev, pair.symbol]);
                              }}
                            >
                              <StarIcon
                                boxSize={4}
                                color={starredPairs.includes(pair.symbol) ? 'yellow.400' : '#4A5568'}
                                mr={2}
                                cursor="pointer"
                              />
                            </Td>
                            <Td color="white" fontWeight="bold">
                              <Flex align="center">
                                {pairIcons[pair.symbol]}
                                {pair.symbol}
                              </Flex>
                            </Td>
                            <Td color="white">{pair.lastPrice}</Td>
                            <Td color={pair.change.includes('-') ? '#FF3B3B' : '#16C784'}>{pair.change}</Td>
                            <Td color="white">{pair.funding}</Td>
                            <Td color="white">{pair.volume}</Td>
                            <Td color="white">{pair.openInterest}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </Box>
              )}
            </Box>
            {/* Stats */}
            <Flex gap={10} align="center">
              <Box>
                <Text color="#4A5568" fontSize="lg">Mark</Text>
                <Text color="white" fontSize="2xl">$19.167</Text>
              </Box>
              <Box>
                <Text color="#4A5568" fontSize="lg">Oracle</Text>
                <Text color="white" fontSize="2xl">$19.170</Text>
              </Box>
              <Box>
                <Text color="#4A5568" fontSize="lg">24h Change</Text>
                <Text color="#FF3B3B" fontWeight="extrabold" fontSize="2xl">+4.12%</Text>
              </Box>
              <Box>
                <Text color="#4A5568" fontSize="lg">Open Interest</Text>
                <Text color="white" fontSize="2xl">$5,421,124</Text>
              </Box>
              <Box>
                <Text color="#4A5568" fontSize="lg">Funding / Countdown</Text>
                <Text color="white" fontSize="2xl">0.010% / 00:12:34</Text>
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Box flex="1" bg="#111" borderRadius={0} p={4} display="flex" flexDirection="column">
          <Box flex="1">
            <TradingViewWidget />
          </Box>
          <Box bg="#111" borderBottomLeftRadius="xl" borderBottomRightRadius="xl" p={4}>
            {/* Trading Tabs (Balances, Positions, etc.) */}
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
                  <Table variant="simple" size="sm" sx={{ 'th, td': { borderColor: '#2D2D2D' }, 'tr': { borderBottom: '2px solid #2D2D2D' } }}>
                    <Thead>
                      <Tr>
                        <Th color="#4A5568">STOCK</Th>
                        <Th color="#4A5568">Total Balance</Th>
                        <Th color="#4A5568">Available Balance</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td color="white">ORBIT</Td>
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
      </Box>
      {/* Order Book & Trades */}
      <Box
        bg="#111"
        height="100%"
        display="flex"
        flexDirection="column"
        borderLeft="1px solid #222"
        borderRight="1px solid #222"
        p={0}
        borderRadius={0}
      >
        <Box p={4} height="100%">
          <Tabs variant="unstyled" height="100%">
            <TabList borderBottom="1px solid #222" px={4}>
              <Tab color="#4A5568" _selected={{ color: 'white', borderBottom: '2px solid #A78BFA' }} _hover={{ color: 'white' }} fontSize="sm" py={3} px={4}>Order Book</Tab>
              <Tab color="#4A5568" _selected={{ color: 'white', borderBottom: '2px solid #A78BFA' }} _hover={{ color: 'white' }} fontSize="sm" py={3} px={4}>Trades</Tab>
            </TabList>
            <TabPanels height="calc(100% - 25px)" overflowY="auto">
              <TabPanel p={0} height="100%">
                <HyperliquidOrderBook />
              </TabPanel>
              <TabPanel p={0} height="100%">
                <HyperliquidRecentTrades />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
      {/* Order Form (Buy/Sell) */}
      <Box
        bg="#111"
        height="100%"
        borderTopRightRadius="xl"
        borderBottomRightRadius="xl"
        borderLeft="none"
        p={0}
        display="flex"
        flexDirection="column"
      >
        <Box p={4} height="100%" display="flex" flexDirection="column" justifyContent="space-between">
          {/* Top row: Cross, 5x, One-Way as sliding tabs */}
          <Flex mb={4} width="100%" gap={2} position="relative">
            {['Cross', '5x', 'One-Way'].map((tab) => (
              <Box
                as="button"
                key={tab}
                flex={1}
                px={0}
                py={2}
                borderRadius="xl"
                bg={leverageTab === tab ? '#A78BFA' : 'transparent'}
                color={leverageTab === tab ? 'black' : 'white'}
                fontWeight="normal"
                fontSize="md"
                transition="all 0.2s"
                onClick={() => setLeverageTab(tab as 'Cross' | '5x' | 'One-Way')}
                _focus={{ outline: 'none' }}
                position="relative"
                zIndex={1}
              >
                {tab}
              </Box>
            ))}
            {/* Sliding indicator for leverage tabs */}
            <Box
              position="absolute"
              left={`calc(${['Cross', '5x', 'One-Way'].indexOf(leverageTab)} * 33.333%)`}
              top={0}
              height="100%"
              width="33.333%"
              bg="#A78BFA"
              borderRadius="xl"
              zIndex={0}
              transition="left 0.2s"
              pointerEvents="none"
              opacity={0.15}
            />
          </Flex>
          {/* Order type sliding tabs: Market, Limit, Pro */}
          <Flex gap={2} mb={4} width="100%" position="relative">
            {['Market', 'Limit', 'Pro'].map((tab) => (
              <Box
                as="button"
                key={tab}
                flex={1}
                px={0}
                py={2}
                borderRadius="xl"
                bg={orderTab === tab ? '#A78BFA' : 'transparent'}
                color={orderTab === tab ? 'black' : 'white'}
                fontWeight="normal"
                fontSize="md"
                transition="all 0.2s"
                onClick={() => setOrderTab(tab as 'Market' | 'Limit' | 'Pro')}
                _focus={{ outline: 'none' }}
                position="relative"
                zIndex={1}
              >
                {tab}
              </Box>
            ))}
            {/* Sliding indicator (optional, for extra polish) */}
            <Box
              position="absolute"
              left={`calc(${['Market', 'Limit', 'Pro'].indexOf(orderTab)} * 33.333%)`}
              top={0}
              height="100%"
              width="33.333%"
              bg="#A78BFA"
              borderRadius="xl"
              zIndex={0}
              transition="left 0.2s"
              pointerEvents="none"
              opacity={0.15}
            />
          </Flex>
          {/* Buy/Sell slider toggle */}
          <Flex mb={4} justify="center">
            <Box
              display="flex"
              alignItems="center"
              bg="#181818"
              borderRadius="xl"
              p={1}
              width="100%"
              maxW="340px"
              boxShadow="sm"
            >
              <Box
                as="button"
                flex={1}
                px={0}
                py={2}
                borderRadius="xl"
                bg={isBuy ? '#16C784' : 'transparent'}
                color={isBuy ? 'black' : 'white'}
                fontWeight="normal"
                fontSize="md"
                transition="all 0.2s"
                onClick={() => setIsBuy(true)}
                _focus={{ outline: 'none' }}
              >
                Buy / Long
              </Box>
              <Box
                as="button"
                flex={1}
                px={0}
                py={2}
                borderRadius="xl"
                bg={!isBuy ? '#FF3B3B' : 'transparent'}
                color="white"
                fontWeight="normal"
                fontSize="md"
                transition="all 0.2s"
                onClick={() => setIsBuy(false)}
                _focus={{ outline: 'none' }}
              >
                Sell / Short
              </Box>
            </Box>
          </Flex>
          {/* Available Balance + Est. Fee (above Price) */}
          <Box bg="#0A0A0A" p={3} borderRadius="xl" mb={4}>
            <Flex justify="space-between">
              <Text color="#4A5568">Available Balance + Est. Fee</Text>
              <Text color="white">0.00</Text>
            </Flex>
          </Box>
          {/* Order info */}
          <Flex mb={2} justify="space-between">
            <Text color="#4A5568" fontSize="sm">Available to Trade</Text>
            <Text color="white" fontSize="sm">0.00</Text>
          </Flex>
          <Flex mb={4} justify="space-between">
            <Text color="#4A5568" fontSize="sm">Current Position</Text>
            <Text color="white" fontSize="sm">0.00 ETH</Text>
          </Flex>
          {/* Price input */}
          <Box mb={4}>
            <Text color="#4A5568" mb={2}>Price</Text>
            <InputGroup>
              <Input placeholder="0.00" bg="#0A0A0A" border="1px solid #222" _hover={{ borderColor: '#A78BFA' }} _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }} color="white" borderRadius="xl" />
            </InputGroup>
          </Box>
          {/* Size input and slider */}
          <Box mb={4}>
            <Text color="#4A5568" mb={2}>Size (ETH)</Text>
            <InputGroup mb={2}>
              <Input placeholder="0.00" bg="#0A0A0A" border="1px solid #222" _hover={{ borderColor: '#A78BFA' }} _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }} color="white" borderRadius="xl" />
            </InputGroup>
            <Box px={2}>
              <input type="range" min="0" max="100" defaultValue="0" style={{ width: '100%' }} />
              <Flex justify="space-between" fontSize="xs" color="#4A5568" mt={1}>
                <Text>0%</Text>
                <Text>100%</Text>
              </Flex>
            </Box>
          </Box>
          {/* Reduce Only / TP/SL checkboxes */}
          <Flex gap={4} mb={showTPSL ? 2 : 4} align="center">
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" style={{ accentColor: '#A78BFA' }} />
              <Text color="#4A5568" fontSize="sm">Reduce Only</Text>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" style={{ accentColor: '#A78BFA' }} checked={showTPSL} onChange={e => setShowTPSL(e.target.checked)} />
              <Text color="#4A5568" fontSize="sm">Take Profit / Stop Loss</Text>
            </label>
          </Flex>
          {/* Take Profit / Stop Loss section */}
          {showTPSL && (
            <Box mb={4}>
              <Flex gap={2} mb={2}>
                <InputGroup>
                  <Input placeholder="TP Price" bg="#0A0A0A" border="1px solid #222" _hover={{ borderColor: '#A78BFA' }} _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }} color="white" borderRadius="xl" />
                </InputGroup>
                <Select bg="#0A0A0A" border="1px solid #222" color="#A78BFA" borderRadius="xl" width="90px">
                  <option value="gain">Gain</option>
                </Select>
              </Flex>
              <Flex gap={2}>
                <InputGroup>
                  <Input placeholder="SL Price" bg="#0A0A0A" border="1px solid #222" _hover={{ borderColor: '#A78BFA' }} _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }} color="white" borderRadius="xl" />
                </InputGroup>
                <Select bg="#0A0A0A" border="1px solid #222" color="#A78BFA" borderRadius="xl" width="90px">
                  <option value="loss">Loss</option>
                </Select>
              </Flex>
            </Box>
          )}
          {/* Order summary */}
          <Box bg="#0A0A0A" p={3} borderRadius="xl" mb={4} fontSize="xs">
            <Flex justify="space-between" mb={1}>
              <Text color="#4A5568">Liquidation Price</Text>
              <Text color="white">N/A</Text>
            </Flex>
            <Flex justify="space-between" mb={1}>
              <Text color="#4A5568">Order Value</Text>
              <Text color="white">N/A</Text>
            </Flex>
            <Flex justify="space-between" mb={1}>
              <Text color="#4A5568">Margin Required</Text>
              <Text color="white">N/A</Text>
            </Flex>
            <Flex justify="space-between" mb={1}>
              <Text color="#4A5568">Slippage</Text>
              <Text color="#00FFD1">Est: 0% / Max: 8.00%</Text>
            </Flex>
            <Flex justify="space-between">
              <Text color="#4A5568">Fees</Text>
              <Text color="#A78BFA">0.0350% / 0.0100%</Text>
            </Flex>
          </Box>
          <Button width="100%" bg="#A78BFA" color="black" _hover={{ bg: '#8B5CF6' }} borderRadius="xl" isDisabled mb={0}>
            Connect Wallet to Trade
          </Button>
        </Box>
      </Box>
    </Grid>
  );
};

export default Trade;
