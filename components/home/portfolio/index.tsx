'use client'
import React from 'react';
import { Box, Text, Flex, Grid, Button, Select, Spinner } from '@chakra-ui/react';

interface PortfolioStats {
  pnl: number;
  volume: number;
  maxDrawdown: number;
  totalEquity: number;
  perpsAccountEquity: number;
  spotAccountEquity: number;
  vaultEquity: number;
}

const Portfolio: React.FC = () => {
  const [timeframe, setTimeframe] = React.useState<string>('30D');
  const [accountType, setAccountType] = React.useState<string>('PNL');

  // Mock data - replace with actual API calls
  const stats: PortfolioStats = {
    pnl: 0.00,
    volume: 0.00,
    maxDrawdown: 0.00,
    totalEquity: 0.00,
    perpsAccountEquity: 0.00,
    spotAccountEquity: 0.00,
    vaultEquity: 0.00
  };

  return (
    <Box width="100%" bg="black" borderRadius="xl" overflow="hidden">
      <Box p={8}>
        <Text fontSize="3xl" fontWeight="bold" color="white" mb={8}>
          Portfolio
        </Text>
        
        <Grid 
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} 
          gap={8} 
          mb={8}
        >
          <Box bg="#111" p={6} borderRadius="lg">
            <Text color="#4A5568" mb={2}>14 Day Volume</Text>
            <Text fontSize="3xl" fontWeight="bold" color="white" mb={1}>$0</Text>
            <Text color="#A78BFA" fontSize="sm" cursor="pointer" _hover={{ color: "#8B5CF6" }}>
              View volume
            </Text>
          </Box>
          
          <Box bg="#111" p={6} borderRadius="lg">
            <Text color="#4A5568" mb={2}>Fees (Taker / Maker)</Text>
            <Text fontSize="3xl" fontWeight="bold" color="white" mb={1}>0.0350% / 0.0100%</Text>
            <Text color="#A78BFA" fontSize="sm" cursor="pointer" _hover={{ color: "#8B5CF6" }}>
              View fee schedule
            </Text>
          </Box>
        </Grid>

        <Flex 
          gap={4} 
          mb={8} 
          overflowX={{ base: "auto", md: "visible" }}
          pb={{ base: 4, md: 0 }}
        >
          {['Deposit', 'Withdraw', 'Send', 'Transfer', 'Performance'].map((action) => (
            <Button
              key={action}
              variant={timeframe === action ? 'solid' : 'ghost'}
              onClick={() => setTimeframe(action)}
              color="white"
              _hover={{ bg: '#222' }}
              minW="100px"
            >
              {action}
            </Button>
          ))}
        </Flex>

        <Grid 
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }} 
          gap={8}
        >
          <Box bg="#111" p={6} borderRadius="lg">
            <Grid templateColumns="1fr auto" gap={4} rowGap={4}>
              <Text color="#4A5568">PNL</Text>
              <Text color="white" fontWeight="medium">${stats.pnl.toFixed(2)}</Text>
              
              <Text color="#4A5568">Volume</Text>
              <Text color="white" fontWeight="medium">${stats.volume.toFixed(2)}</Text>
              
              <Text color="#4A5568">Max Drawdown</Text>
              <Text color="white" fontWeight="medium">{stats.maxDrawdown.toFixed(2)}%</Text>
              
              <Text color="#4A5568">Total Equity</Text>
              <Text color="white" fontWeight="medium">${stats.totalEquity.toFixed(2)}</Text>
              
              <Text color="#4A5568">Perps Account Equity</Text>
              <Text color="white" fontWeight="medium">${stats.perpsAccountEquity.toFixed(2)}</Text>
              
              <Text color="#4A5568">Spot Account Equity</Text>
              <Text color="white" fontWeight="medium">${stats.spotAccountEquity.toFixed(2)}</Text>
              
              <Text color="#4A5568">Vault Equity</Text>
              <Text color="white" fontWeight="medium">${stats.vaultEquity.toFixed(2)}</Text>
            </Grid>
          </Box>
          
          <Box bg="#111" p={6} borderRadius="lg">
            <Flex justifyContent="space-between" alignItems="center" mb={6}>
              <Text color="white" fontSize="lg" fontWeight="medium">Account Value</Text>
              <Select 
                value={accountType} 
                onChange={(e) => setAccountType(e.target.value)} 
                w="120px" 
                bg="#222"
                border="none"
                color="white"
                _hover={{ bg: '#333', borderColor: '#A78BFA' }}
                _focus={{ borderColor: '#A78BFA', boxShadow: 'none' }}
              >
                <option value="PNL">PNL</option>
                <option value="Perps">Perps</option>
                <option value="Spot">Spot</option>
                <option value="Vault">Vault</option>
              </Select>
            </Flex>
            
            <Box 
              h="300px" 
              bg="#0A0A0A" 
              borderRadius="md" 
              position="relative"
              border="1px solid #222"
              _hover={{ borderColor: '#A78BFA' }}
            >
              {/* Chart component would go here */}
              <Flex
                position="absolute"
                left={0}
                bottom={0}
                right={0}
                h="1px"
                bg="gray.700"
              />
              <Flex
                position="absolute"
                left={0}
                top={0}
                bottom={0}
                w="1px"
                bg="gray.700"
              />
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default Portfolio;
