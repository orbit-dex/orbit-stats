import React from 'react';
import {
  Box,
  Text,
  Flex,
  Grid,
  Button,
  Select,
  VStack,
  HStack,
  Badge,
  Progress,
  Tooltip,
} from '@chakra-ui/react';
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip as RechartsTooltip, ComposedChart, BarChart, Bar, CartesianGrid } from 'recharts';

// Mock data for demonstration
const mockTokenMindshare = [
  { name: 'BTC', value: 35, change: '+2.5%' },
  { name: 'ETH', value: 25, change: '-1.2%' },
  { name: 'SOL', value: 15, change: '+5.3%' },
  { name: 'AVAX', value: 8, change: '+0.8%' },
  { name: 'DOT', value: 7, change: '-0.5%' },
  { name: 'ADA', value: 5, change: '-2.1%' },
  { name: 'Others', value: 5, change: '-4.8%' },
];

const mockSocialMindshare = [
  { date: 'Jan', mentions: 1200, engagement: 4500 },
  { date: 'Feb', mentions: 1500, engagement: 5200 },
  { date: 'Mar', mentions: 1800, engagement: 6000 },
  { date: 'Apr', mentions: 2200, engagement: 7500 },
  { date: 'May', mentions: 2500, engagement: 8500 },
  { date: 'Jun', mentions: 2800, engagement: 9500 },
];

const mockNarrativeMindshare = [
  { name: 'AI', value: 30, change: '+5.2%' },
  { name: 'DeFi', value: 25, change: '-2.1%' },
  { name: 'NFTs', value: 15, change: '-3.5%' },
  { name: 'Gaming', value: 12, change: '+1.8%' },
  { name: 'L2s', value: 10, change: '+3.2%' },
  { name: 'Others', value: 8, change: '-4.6%' },
];

const MindshareDashboard: React.FC = () => {
  return (
    <VStack spacing={8} align="stretch" p={4}>
      {/* Header */}
      <Flex justify="space-between" align="center">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          Market Mindshare Dashboard
        </Text>
        <Select
          w="150px"
          bg="transparent"
          border="1px solid"
          borderColor="gray.800"
          _hover={{ borderColor: '#A78BFA' }}
          _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
          size="sm"
          defaultValue="7d"
        >
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7d</option>
          <option value="30d">Last 30d</option>
          <option value="90d">Last 90d</option>
        </Select>
      </Flex>

      {/* Token Mindshare Section */}
      <Box>
        <Text fontSize="lg" fontWeight="medium" color="white" mb={4}>
          Token Mindshare Distribution
        </Text>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <Box>
            <VStack spacing={4} align="stretch">
              {mockTokenMindshare.map((token) => (
                <Box key={token.name}>
                  <Flex justify="space-between" mb={1}>
                    <Text color="white" fontSize="sm">{token.name}</Text>
                    <Text color={token.change.startsWith('+') ? 'green.400' : 'red.400'} fontSize="sm">
                      {token.change}
                    </Text>
                  </Flex>
                  <Progress
                    value={token.value}
                    size="sm"
                    colorScheme="purple"
                    bg="gray.800"
                    borderRadius="full"
                  />
                </Box>
              ))}
            </VStack>
          </Box>
          <Box>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockSocialMindshare}>
                <defs>
                  <linearGradient id="mindshareFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#1A202C',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mentions"
                  stroke="#8B5CF6"
                  fill="url(#mindshareFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Box>

      {/* Narrative Mindshare Section */}
      <Box>
        <Text fontSize="lg" fontWeight="medium" color="white" mb={4}>
          Narrative Mindshare
        </Text>
        <Grid templateColumns="repeat(3, 1fr)" gap={4}>
          {mockNarrativeMindshare.map((narrative) => (
            <Box
              key={narrative.name}
              p={4}
              bg="#1A1A1A"
              borderRadius="lg"
              borderWidth={1}
              borderColor="gray.800"
            >
              <Text color="white" fontSize="lg" fontWeight="medium" mb={2}>
                {narrative.name}
              </Text>
              <Text
                color={narrative.change.startsWith('+') ? 'green.400' : 'red.400'}
                fontSize="sm"
                mb={2}
              >
                {narrative.change}
              </Text>
              <Progress
                value={narrative.value}
                size="sm"
                colorScheme="purple"
                bg="gray.800"
                borderRadius="full"
              />
            </Box>
          ))}
        </Grid>
      </Box>

      {/* Social Engagement Section */}
      <Box>
        <Text fontSize="lg" fontWeight="medium" color="white" mb={4}>
          Social Engagement Trends
        </Text>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={mockSocialMindshare}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis dataKey="date" stroke="#A0AEC0" />
            <YAxis stroke="#A0AEC0" />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: '#1A202C',
                border: 'none',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="mentions" fill="#8B5CF6" />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </VStack>
  );
};

export default MindshareDashboard; 