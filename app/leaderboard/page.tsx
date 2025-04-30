'use client'

import React from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  Avatar,
  Container,
} from '@chakra-ui/react';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

const mockTraders = [
  { id: '0xc6...c142', gainVsLoss: '41 - 48', volume: '667.9M', trades: 90, liquidations: 0, realisedPnl: 229859.50, avatarColor: 'orange.500' },
  { id: '0x22...c215', gainVsLoss: '66 - 48', volume: '768.3M', trades: 114, liquidations: 5, realisedPnl: 174585.53, avatarColor: 'green.500' },
  { id: '0x1d...65b3', gainVsLoss: '16 - 15', volume: '25.7M', trades: 33, liquidations: 0, realisedPnl: 111481.18, avatarColor: 'green.500' },
  { id: '0x3f...a7d4', gainVsLoss: '52 - 31', volume: '892.1M', trades: 83, liquidations: 2, realisedPnl: 98567.92, avatarColor: 'purple.500' },
  { id: '0x8a...b3e5', gainVsLoss: '38 - 42', volume: '445.6M', trades: 80, liquidations: 3, realisedPnl: 87654.21, avatarColor: 'blue.500' },
  { id: '0x4d...9f12', gainVsLoss: '29 - 25', volume: '334.8M', trades: 54, liquidations: 1, realisedPnl: 76543.87, avatarColor: 'yellow.500' },
  { id: '0x7b...e2c8', gainVsLoss: '45 - 38', volume: '556.2M', trades: 83, liquidations: 4, realisedPnl: 65432.19, avatarColor: 'red.500' },
  { id: '0x5e...d4f9', gainVsLoss: '31 - 29', volume: '223.5M', trades: 60, liquidations: 2, realisedPnl: 54321.76, avatarColor: 'teal.500' },
  { id: '0x2c...a8b7', gainVsLoss: '27 - 33', volume: '178.9M', trades: 60, liquidations: 1, realisedPnl: 43210.54, avatarColor: 'cyan.500' },
  { id: '0x9f...c6d5', gainVsLoss: '35 - 28', volume: '445.3M', trades: 63, liquidations: 3, realisedPnl: 32109.87, avatarColor: 'pink.500' },
  { id: '0x1a...e4f3', gainVsLoss: '22 - 25', volume: '156.7M', trades: 47, liquidations: 2, realisedPnl: 28765.43, avatarColor: 'orange.500' },
  { id: '0x6d...b2c1', gainVsLoss: '33 - 29', volume: '289.4M', trades: 62, liquidations: 1, realisedPnl: 25432.18, avatarColor: 'green.500' },
  { id: '0x8c...a7b6', gainVsLoss: '28 - 31', volume: '198.6M', trades: 59, liquidations: 0, realisedPnl: 21098.76, avatarColor: 'purple.500' },
  { id: '0x4e...f5d4', gainVsLoss: '19 - 22', volume: '145.2M', trades: 41, liquidations: 2, realisedPnl: 18765.32, avatarColor: 'blue.500' },
  { id: '0x3b...c2e1', gainVsLoss: '25 - 21', volume: '234.8M', trades: 46, liquidations: 1, realisedPnl: 15432.98, avatarColor: 'yellow.500' },
  { id: '0x7d...a4b3', gainVsLoss: '31 - 28', volume: '312.5M', trades: 59, liquidations: 3, realisedPnl: 12345.67, avatarColor: 'red.500' },
  { id: '0x5a...e3f2', gainVsLoss: '20 - 24', volume: '167.3M', trades: 44, liquidations: 1, realisedPnl: 9876.54, avatarColor: 'teal.500' },
  { id: '0x2e...b1c0', gainVsLoss: '24 - 19', volume: '189.7M', trades: 43, liquidations: 0, realisedPnl: 7654.32, avatarColor: 'cyan.500' },
  { id: '0x9c...d2e1', gainVsLoss: '18 - 21', volume: '134.6M', trades: 39, liquidations: 2, realisedPnl: 5432.10, avatarColor: 'pink.500' },
  { id: '0x1e...f4d3', gainVsLoss: '21 - 23', volume: '156.8M', trades: 44, liquidations: 1, realisedPnl: 3210.98, avatarColor: 'orange.500' },
];

const LeaderboardPage = () => {
  return (
    <>
      <Header />
      <Box as="main" bg="black" minH="100vh" pt="80px" pb={8}>
        <Container maxW="container.xl">
          {/* Leaderboard Section */}
          <Box mb={8}>
            <Text fontSize="4xl" fontWeight="bold" color="white" letterSpacing="-0.02em">
              Leaderboard
            </Text>
          </Box>

          <Box bg="#9945FF" display="inline-block" px={6} py={2} borderRadius="full" mb={6}>
            <Text color="white" fontWeight="medium" letterSpacing="-0.01em">
              Best Trader
            </Text>
          </Box>

          <Box bg="#111" borderRadius="xl" overflow="hidden">
            <Table variant="unstyled">
              <Thead>
                <Tr>
                  <Th color="whiteAlpha.700" pl={6} letterSpacing="0.02em">RANK</Th>
                  <Th color="whiteAlpha.700" letterSpacing="0.02em">TRADER</Th>
                  <Th color="whiteAlpha.700" letterSpacing="0.02em">GAIN VS LOSS</Th>
                  <Th color="whiteAlpha.700" letterSpacing="0.02em">VOLUME</Th>
                  <Th color="whiteAlpha.700" isNumeric letterSpacing="0.02em">TRADES</Th>
                  <Th color="whiteAlpha.700" isNumeric letterSpacing="0.02em">LIQUIDATIONS</Th>
                  <Th color="whiteAlpha.700" isNumeric letterSpacing="0.02em">REALISED PNL</Th>
                </Tr>
              </Thead>
              <Tbody>
                {mockTraders.map((trader, index) => (
                  <Tr key={trader.id} _hover={{ bg: '#1A1A1A' }}>
                    <Td color="whiteAlpha.700" pl={6}>#{index + 1}</Td>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="xs" bg={trader.avatarColor} />
                        <Text color="white" letterSpacing="-0.01em">{trader.id}</Text>
                      </HStack>
                    </Td>
                    <Td color="white" letterSpacing="-0.01em">{trader.gainVsLoss}</Td>
                    <Td color="white" letterSpacing="-0.01em">{trader.volume}</Td>
                    <Td color="white" isNumeric letterSpacing="-0.01em">{trader.trades}</Td>
                    <Td color="white" isNumeric letterSpacing="-0.01em">{trader.liquidations}</Td>
                    <Td color="#9945FF" isNumeric letterSpacing="-0.01em">${trader.realisedPnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>

          <Box position="absolute" top={8} right={8}>
            <Button
              bg="#9945FF"
              color="white"
              _hover={{ bg: '#8134EB' }}
              size="md"
              letterSpacing="-0.01em"
            >
              Contest 🏆
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default LeaderboardPage; 