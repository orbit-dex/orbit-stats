'use client';

import React from 'react';
import {
  Box,
  Container,
  Text,
  Flex,
  Grid,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

interface TradingPair {
  symbol: string;
  name: string;
  price: number;
  priceChange?: number;
  volume: string;
  status?: string;
  fundingLong?: number;
  fundingShort?: number;
}

// Mock data for pairs
const mockPairs: TradingPair[] = [
  {
    symbol: 'ORBT/USDC',
    name: 'Orbit',
    price: 1.247,
    priceChange: 2.34,
    volume: '892.5M',
    fundingLong: 0.0012,
    fundingShort: -0.0008,
  },
  {
    symbol: 'BTC/USD',
    name: 'Bitcoin',
    price: 94627,
    priceChange: -0.22,
    volume: '1.4B',
    fundingLong: -0.0042,
    fundingShort: 0.0059,
  },
  {
    symbol: 'ETH/USD',
    name: 'Ethereum',
    price: 1797.71,
    priceChange: -0.25,
    volume: '666.3M',
    fundingLong: -0.0045,
    fundingShort: 0.007,
  },
  {
    symbol: 'SOL/USD',
    name: 'Solana',
    price: 147.214,
    priceChange: -0.52,
    volume: '534.7M',
    fundingLong: 0.0008,
    fundingShort: -0.0007,
  },
  {
    symbol: 'SPX/USD',
    name: 'S&P 500',
    price: 5558.5,
    volume: '456.0M',
    status: 'CLOSED',
  },
  {
    symbol: 'DJI/USD',
    name: 'Dow Jones',
    price: 40594.6,
    volume: '6.3M',
    status: 'CLOSED',
  },
  {
    symbol: 'NDX/USD',
    name: 'Nasdaq',
    price: 19516.5,
    volume: '125.1M',
    status: 'CLOSED',
  },
];

const PairsPage = () => {
  const router = useRouter();

  const handlePairClick = (pair: TradingPair) => {
    // Extract the base symbol from the pair (e.g., "BTC" from "BTC/USD")
    const baseSymbol = pair.symbol.split('/')[0];
    router.push(`/trade?symbol=${baseSymbol}`);
  };

  return (
    <>
      <Header />
      <Box as="main" bg="#0A0A0A" minH="100vh" pt="80px">
        <Container maxW="container.xl" py={8}>
          {/* Header Section */}
          <Box textAlign="center" mb={12}>
            <Text 
              fontSize="5xl" 
              fontWeight="bold" 
              color="white" 
              mb={3}
            >
              Pairs
            </Text>
            <Text color="whiteAlpha.700" fontSize="lg">
              Discover and trade the most liquid pairs across all markets
            </Text>
          </Box>

          {/* Pairs Grid */}
          <Grid 
            templateColumns={{ 
              base: "1fr",
              md: "repeat(2, 1fr)", 
              lg: "repeat(3, 1fr)",
              xl: "repeat(5, 1fr)" 
            }}
            gap={4}
          >
            {mockPairs.map((pair) => (
              <Box
                key={pair.symbol}
                bg="#111111"
                borderRadius="xl"
                p={4}
                cursor="pointer"
                onClick={() => handlePairClick(pair)}
                _hover={{ 
                  bg: '#1A1A1A',
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                  boxShadow: '0 4px 12px rgba(153, 69, 255, 0.1)'
                }}
                position="relative"
                overflow="hidden"
                transition="all 0.2s ease-in-out"
              >
                {/* Purple Gradient Overlay */}
                <Box
                  position="absolute"
                  top={0}
                  right={0}
                  width="30%"
                  height="100%"
                  bgGradient="linear(to-l, rgba(153, 69, 255, 0.03), transparent)"
                />

                {/* Top Section */}
                <Flex direction="column" mb={3}>
                  <Text color="white" fontSize="sm" mb={0.5} fontWeight="medium">{pair.symbol}</Text>
                  <Text color="whiteAlpha.700" fontSize="xs">{pair.name}</Text>
                </Flex>

                {/* Price Section */}
                <Text fontSize="2xl" fontWeight="semibold" color="white" mb={1}>
                  {pair.price.toLocaleString()}
                </Text>
                <Text 
                  fontSize="sm"
                  color={pair.status === 'CLOSED' ? '#FF3B3B' : 
                         (pair.priceChange ?? 0) >= 0 ? '#00FFB3' : '#FF3B3B'}
                  mb={3}
                  fontWeight="medium"
                >
                  {pair.status || `${(pair.priceChange ?? 0) >= 0 ? '+' : ''}${pair.priceChange}%`}
                </Text>

                {/* Stats Section */}
                <Box fontSize="xs" position="relative" zIndex={1}>
                  <Flex justify="space-between" mb={1}>
                    <Text color="whiteAlpha.700">Cumulative Volume</Text>
                    <Text color="white">{pair.volume}</Text>
                  </Flex>
                  {pair.fundingLong !== undefined && (
                    <>
                      <Flex justify="space-between" mb={1}>
                        <Text color="whiteAlpha.700">Est 1h Funding Long</Text>
                        <Text color={pair.fundingLong >= 0 ? '#00FFB3' : '#FF3B3B'}>
                          {pair.fundingLong}%
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color="whiteAlpha.700">Est 1h Funding Short</Text>
                        <Text color={(pair.fundingShort ?? 0) >= 0 ? '#00FFB3' : '#FF3B3B'}>
                          {(pair.fundingShort ?? 0).toFixed(4)}%
                        </Text>
                      </Flex>
                    </>
                  )}
                </Box>

                {/* Chart Indicator */}
                <Box
                  position="absolute"
                  right={0}
                  top={0}
                  bottom={0}
                  width="3px"
                  bg="white"
                  opacity={0.2}
                />
              </Box>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default PairsPage; 