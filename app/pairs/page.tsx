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
  name: string;
  type: string;
  marketCap: string;
  returnToDate: number;
  description: string;
  tags: string[];
  portfolioManager: string;
  ranking?: string;
  votesNeeded: number;
  comments: number;
}

// Mock data for strategies/funds
const mockPairs: TradingPair[] = [
  {
    name: 'Arteris, Inc.',
    type: 'Hedge Fund',
    marketCap: '374.0M USD',
    returnToDate: 4.7,
    description: 'IP supplier to Artificial Intelligence and ADAS chips and trades at 1/10 the multiple of its closest competitor.',
    tags: [],
    portfolioManager: '$50M - $100M Hedge Fund',
    votesNeeded: 4,
    comments: 3
  },
  {
    name: 'Matas A/s',
    type: 'Family Office',
    marketCap: '782.0M USD',
    returnToDate: 91.8,
    description: 'Leading drug store retailer with 5% growth and trading at less than 10x earnings. Digitalisation journey will grow the company into more categories and higher profitability',
    tags: [],
    portfolioManager: '$50M - $100M Family Office',
    ranking: '',
    votesNeeded: 4,
    comments: 4
  },
  {
    name: 'Bakkafrost P/f',
    type: 'Family Office',
    marketCap: '2.6B USD',
    returnToDate: -17.4,
    description: 'Leading salmon farmer in Faroe Island known for its high quality salmons. Heading for higher growth. Based on share price targets its a 20% CAGR return profile',
    tags: [],
    portfolioManager: '$50M - $100M Family Office',
    ranking: '',
    votesNeeded: 4,
    comments: 0
  },
  {
    name: 'Echostar Corporation',
    type: 'Hedge Fund',
    marketCap: '3.9B USD',
    returnToDate: 10.2,
    description: 'Trades at <20% of FMV of its assets. Potential startup like returns, but with significant downside protection. Bankruptcy risk off the table.',
    tags: [],
    portfolioManager: '$1M - $10M Hedge Fund',
    ranking: '',
    votesNeeded: 4,
    comments: 2
  },
  {
    name: 'Kmd Brands Limited',
    type: 'Analyst',
    marketCap: '127.0M USD',
    returnToDate: -28.9,
    description: 'Disproportionate focus on an underperforming division creates attractive SOTP-driven risk-reward opportunity.',
    tags: [],
    portfolioManager: '',
    votesNeeded: 4,
    comments: 2
  }
];

const PairsPage = () => {
  const router = useRouter();

  const handlePairClick = (pair: TradingPair) => {
    // Navigate to strategy details page
    router.push(`/strategy/${pair.name.toLowerCase().replace(/\s+/g, '-')}`);
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
              Strategies
            </Text>
            <Text color="whiteAlpha.700" fontSize="lg">
              Discover and analyze different investment strategies across markets
            </Text>
          </Box>

          {/* Strategies Grid */}
          <Grid 
            templateColumns={{ 
              base: "1fr",
              lg: "1fr"
            }}
            gap={4}
          >
            {mockPairs.map((strategy) => (
              <Box
                key={strategy.name}
                bg="#111111"
                borderRadius="xl"
                p={6}
                cursor="pointer"
                onClick={() => handlePairClick(strategy)}
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
                {/* Strategy Header */}
                <Flex justify="space-between" align="start" mb={4}>
                  <Box>
                    <Text color="white" fontSize="xl" fontWeight="bold" mb={1}>
                      {strategy.name}
                    </Text>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {strategy.type}
                    </Text>
                  </Box>
                  <Box textAlign="right">
                    <Text color="white" fontSize="md" fontWeight="semibold">
                      {strategy.marketCap}
                </Text>
                <Text 
                  fontSize="sm"
                      color={strategy.returnToDate >= 0 ? '#00FFB3' : '#FF3B3B'}
                  fontWeight="medium"
                >
                      {strategy.returnToDate >= 0 ? '▲' : '▼'} {Math.abs(strategy.returnToDate)}%
                    </Text>
                  </Box>
                </Flex>

                {/* Description */}
                <Text color="whiteAlpha.900" fontSize="md" mb={4}>
                  {strategy.description}
                </Text>

                {/* Footer Info */}
                <Flex justify="space-between" align="center" mt={4}>
                  <Box>
                    <Text color="whiteAlpha.700" fontSize="sm">
                      {strategy.portfolioManager}
                    </Text>
                    {strategy.ranking && (
                      <Text color="whiteAlpha.700" fontSize="sm">
                        {strategy.ranking}
                    </Text>
                    )}
                  </Box>
                  </Flex>
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