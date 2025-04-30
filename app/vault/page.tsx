'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Text,
  Flex,
  Grid,
  Button,
  HStack,
  Icon,
  Input,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Tooltip,
  VStack,
  Divider,
} from '@chakra-ui/react';
import { FiInfo, FiClock, FiTrendingUp, FiLock } from 'react-icons/fi';
import Header from '@/components/common/header';
import Footer from '@/components/common/footer';

const VaultPage = () => {
  type LockPeriod = 'None' | '7 days' | '30 days' | '180 days' | '365 days';
  
  const [selectedTab, setSelectedTab] = useState('Deposit');
  const [lockPeriod, setLockPeriod] = useState<LockPeriod>('None');
  const [depositAmount, setDepositAmount] = useState('0');

  const lockBoosts: Record<LockPeriod, string> = {
    'None': '0%',
    '7 days': '5%',
    '30 days': '10%',
    '180 days': '20%',
    '365 days': '30%',
  };

  const periods: LockPeriod[] = ['None', '7 days', '30 days', '180 days', '365 days'];

  return (
    <>
      <Header />
      <Box as="main" bg="black" minH="100vh" pt="80px">
        <Container maxW="container.xl" py={8}>
          {/* Header Section with Gradient */}
          <Box 
            position="relative" 
            mb={12}
            p={8}
            bg="#111"
            borderRadius="2xl"
            overflow="hidden"
          >
            {/* Purple Gradient Overlay */}
            <Box
              position="absolute"
              top={0}
              right={0}
              width="50%"
              height="100%"
              bgGradient="linear(to-l, rgba(153, 69, 255, 0.1), transparent)"
              zIndex={0}
            />

            <Box position="relative" zIndex={1}>
              <Text fontSize="4xl" fontWeight="bold" color="white" mb={4}>
                Liquidity Pool Vault
              </Text>

              <HStack spacing={4} mb={4}>
                <Box bg="rgba(153, 69, 255, 0.1)" px={4} py={2} borderRadius="full">
                  <Text color="#9945FF">Epoch #80</Text>
                </Box>
                <Text color="whiteAlpha.700">29 April 2025 at 05:36 to 2 May 2025 at 05:36</Text>
              </HStack>

              <Text color="whiteAlpha.700" fontSize="lg">
                Earn fractional trading and liquidation fees with <Text as="span" color="#9945FF">$OLP</Text> by providing liquidity with staked USDC. This pool acts as the ultimate backstop for trade settlement.
              </Text>
            </Box>
          </Box>

          {/* Stats Cards */}
          <Grid templateColumns="repeat(3, 1fr)" gap={6} mb={12}>
            {[
              {
                label: 'Total Value Locked',
                value: '57,909,366 USDC',
                icon: FiLock,
                tooltip: 'Total value locked in the vault',
                progress: 85,
              },
              {
                label: 'OLP Price',
                value: '1.055998 USDC',
                icon: FiTrendingUp,
                tooltip: 'Current price of OLP token',
                progress: 65,
              },
              {
                label: 'Annual Percentage Rate',
                value: '19.59%',
                icon: FiClock,
                tooltip: 'Current APR for staking',
                progress: 45,
              },
            ].map((stat, index) => (
              <Box
                key={index}
                bg="#111"
                p={6}
                borderRadius="xl"
                position="relative"
                overflow="hidden"
                _hover={{
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  height="2px"
                  bgGradient="linear(to-r, #9945FF, transparent)"
                />
                <Flex justify="space-between" mb={4}>
                  <HStack spacing={2}>
                    <Icon as={stat.icon} color="#9945FF" boxSize={5} />
                    <Text color="whiteAlpha.700">{stat.label}</Text>
                  </HStack>
                  <Tooltip label={stat.tooltip}>
                    <Icon as={FiInfo} color="whiteAlpha.400" />
                  </Tooltip>
                </Flex>
                <Text color="white" fontSize="2xl" fontWeight="semibold" mb={4}>
                  {stat.value}
                </Text>
                <Progress
                  value={stat.progress}
                  size="xs"
                  colorScheme="purple"
                  bg="whiteAlpha.100"
                  borderRadius="full"
                />
              </Box>
            ))}
          </Grid>

          {/* Main Content Grid */}
          <Grid templateColumns="2fr 1fr" gap={8}>
            {/* Left Side - Action Panel */}
            <Box>
              <HStack spacing={0} mb={6} bg="#111" p={1} borderRadius="full" width="fit-content">
                {['Deposit', 'Withdraw', 'Unlock'].map((tab) => (
                  <Button
                    key={tab}
                    onClick={() => setSelectedTab(tab)}
                    bg={selectedTab === tab ? '#9945FF' : 'transparent'}
                    color={selectedTab === tab ? 'white' : 'whiteAlpha.700'}
                    _hover={{ bg: selectedTab === tab ? '#8134EB' : 'whiteAlpha.100' }}
                    borderRadius="full"
                    size="sm"
                    px={6}
                  >
                    {tab}
                  </Button>
                ))}
              </HStack>

              <Box bg="#111" borderRadius="xl" overflow="hidden">
                <Box p={6}>
                  <Text color="whiteAlpha.700" mb={4}>1 USDC = 0.946971 OLP</Text>
                  
                  <VStack spacing={6} align="stretch">
                    {/* Amount Input */}
                    <Box>
                      <Input
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount"
                        size="lg"
                        bg="#0A0A0A"
                        border="1px solid"
                        borderColor="whiteAlpha.100"
                        color="white"
                        _hover={{ borderColor: '#9945FF' }}
                        _focus={{ borderColor: '#9945FF', boxShadow: 'none' }}
                      />
                      <HStack justify="space-between" mt={2}>
                        {['25%', '50%', '75%', '100%'].map((percent) => (
                          <Button
                            key={percent}
                            variant="ghost"
                            size="sm"
                            color="whiteAlpha.700"
                            _hover={{ color: '#9945FF' }}
                          >
                            {percent}
                          </Button>
                        ))}
                      </HStack>
                    </Box>

                    <Divider borderColor="whiteAlpha.100" />

                    {/* Lock Period Selection */}
                    <Box>
                      <Text color="whiteAlpha.700" mb={4}>Select Locking Period</Text>
                      <Grid templateColumns="repeat(5, 1fr)" gap={2}>
                        {periods.map((period) => (
                          <Box
                            key={period}
                            p={4}
                            bg={lockPeriod === period ? 'whiteAlpha.100' : 'transparent'}
                            borderRadius="lg"
                            cursor="pointer"
                            onClick={() => setLockPeriod(period)}
                            border="1px solid"
                            borderColor={lockPeriod === period ? '#9945FF' : 'transparent'}
                            _hover={{ bg: 'whiteAlpha.50' }}
                          >
                            <Text fontSize="sm" color="whiteAlpha.900">
                              {period}
                            </Text>
                            <Text fontSize="sm" color="#9945FF" mt={1}>
                              {lockBoosts[period]}
                            </Text>
                          </Box>
                        ))}
                      </Grid>
                    </Box>

                    <Divider borderColor="whiteAlpha.100" />

                    {/* Summary */}
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text color="whiteAlpha.700">You will receive</Text>
                        <Text color="white">0 OLP</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color="whiteAlpha.700">Lock Boost</Text>
                        <Text color="#9945FF">{lockBoosts[lockPeriod]}</Text>
                      </Flex>
                    </Box>
                  </VStack>
                </Box>

                <Box p={6} bg="#0A0A0A">
                  <Button
                    width="100%"
                    bg="#9945FF"
                    color="white"
                    _hover={{ bg: '#8134EB' }}
                    size="lg"
                  >
                    Connect Wallet
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Right Side - History */}
            <Box>
              <Text color="white" fontSize="xl" fontWeight="semibold" mb={4}>
                LP History
              </Text>
              <Box bg="#111" borderRadius="xl" overflow="hidden">
                <Box p={6}>
                  <Table variant="unstyled">
                    <Thead>
                      <Tr>
                        <Th color="whiteAlpha.700" px={2}>TIME</Th>
                        <Th color="whiteAlpha.700" px={2}>OPERATION</Th>
                        <Th color="whiteAlpha.700" px={2}>SHARES</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <Tr>
                        <Td colSpan={3} textAlign="center" py={8}>
                          <VStack spacing={2}>
                            <Icon as={FiLock} color="whiteAlpha.400" boxSize={6} />
                            <Text color="whiteAlpha.700">Connect wallet to view history</Text>
                          </VStack>
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default VaultPage; 