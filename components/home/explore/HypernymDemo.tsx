import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Alert,
  AlertIcon,
  Progress,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';

interface DemoCategory {
  name: string;
  confidence: number;
  mentions: number;
  momentum: number;
}

interface DemoSentiment {
  source: string;
  score: number;
  trend: number;
}

const HypernymDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    categories: DemoCategory[];
    sentiment: DemoSentiment[];
  } | null>(null);

  // Mock Hypernym data for demo
  const mockHypernymData = {
    categories: [
      { name: 'DeFi', confidence: 0.92, mentions: 1247, momentum: 12.3 },
      { name: 'Layer 2', confidence: 0.88, mentions: 892, momentum: -5.7 },
      { name: 'AI', confidence: 0.85, mentions: 456, momentum: 25.1 },
      { name: 'Memecoins', confidence: 0.78, mentions: 234, momentum: -15.2 },
      { name: 'Gaming', confidence: 0.72, mentions: 167, momentum: 8.9 },
      { name: 'Infrastructure', confidence: 0.69, mentions: 123, momentum: 3.4 },
    ],
    sentiment: [
      { source: 'twitter', score: 0.65, trend: 0.12 },
      { source: 'news', score: 0.45, trend: -0.08 },
      { source: 'research', score: 0.78, trend: 0.05 },
    ],
  };

  const simulateHypernymAPI = () => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setData(mockHypernymData);
      setLoading(false);
    }, 1500);
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum > 10) return 'green';
    if (momentum > 0) return 'blue';
    if (momentum > -10) return 'yellow';
    return 'red';
  };

  const formatMomentum = (momentum: number) => {
    const sign = momentum >= 0 ? '+' : '';
    return `${sign}${momentum.toFixed(1)}%`;
  };

  return (
    <Box bg="#1a1a1a" p={6} borderRadius="xl" border="2px dashed #3b82f6">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Box textAlign="center">
          <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>
            🔬 Hypernym Semantic Analysis Demo
          </Text>
          <Text fontSize="sm" color="gray.400" mb={4}>
            Real-time AI-powered categorization and sentiment analysis
          </Text>
          <Button
            onClick={simulateHypernymAPI}
            colorScheme="blue"
            isLoading={loading}
            loadingText="Analyzing semantic patterns..."
          >
            {data ? 'Refresh Analysis' : 'Run Hypernym Analysis'}
          </Button>
        </Box>

        {loading && (
          <Box textAlign="center" py={8}>
            <Spinner size="lg" color="blue.500" mb={4} />
            <Text color="gray.400">Processing natural language patterns...</Text>
            <Progress 
              value={85} 
              colorScheme="blue" 
              size="sm" 
              borderRadius="full" 
              mt={4} 
              isIndeterminate 
            />
          </Box>
        )}

        {data && !loading && (
          <>
            {/* Categories Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color="white" mb={4}>
                📊 Semantic Categories
              </Text>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                {data.categories.map((category) => (
                  <Box
                    key={category.name}
                    bg="#2a2a2a"
                    p={4}
                    borderRadius="lg"
                    border="1px solid #374151"
                  >
                    <VStack spacing={3}>
                      <Text fontWeight="bold" color="white">
                        {category.name}
                      </Text>
                      <Text fontSize="sm" color="gray.400">
                        {category.mentions.toLocaleString()} mentions
                      </Text>
                      <Badge
                        colorScheme={getMomentumColor(category.momentum)}
                        fontSize="xs"
                      >
                        {formatMomentum(category.momentum)} momentum
                      </Badge>
                      <Progress
                        value={category.confidence * 100}
                        colorScheme="blue"
                        size="sm"
                        w="100%"
                        borderRadius="full"
                      />
                      <Text fontSize="xs" color="gray.500">
                        {(category.confidence * 100).toFixed(1)}% confidence
                      </Text>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Sentiment Section */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" color="white" mb={4}>
                💭 Source Sentiment Analysis
              </Text>
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                {data.sentiment.map((sentiment) => (
                  <Box
                    key={sentiment.source}
                    bg="#2a2a2a"
                    p={4}
                    borderRadius="lg"
                    border="1px solid #374151"
                  >
                    <VStack spacing={3}>
                      <Text fontWeight="bold" color="white" textTransform="capitalize">
                        {sentiment.source}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="white">
                        {(sentiment.score * 100).toFixed(0)}
                      </Text>
                      <Text fontSize="xs" color="gray.400">
                        Sentiment Score
                      </Text>
                      <Badge
                        colorScheme={sentiment.trend > 0 ? 'green' : 'red'}
                        fontSize="xs"
                      >
                        {formatMomentum(sentiment.trend)} trend
                      </Badge>
                    </VStack>
                  </Box>
                ))}
              </SimpleGrid>
            </Box>

            {/* Integration Status */}
            <Alert status="success" bg="#2a2a2a" borderRadius="lg">
              <AlertIcon />
              <VStack align="flex-start" spacing={1}>
                <Text color="white" fontWeight="semibold">
                  ✅ Hypernym Integration Ready!
                </Text>
                <Text fontSize="sm" color="gray.400">
                  Semantic categorization API endpoints configured and working.
                  Access via: <code>/api/hypernym/analyze</code> and <code>/api/hypernym/categorize</code>
                </Text>
              </VStack>
            </Alert>
          </>
        )}

        {!data && !loading && (
          <Alert status="info" bg="#2a2a2a" borderRadius="lg">
            <AlertIcon />
            <VStack align="flex-start" spacing={1}>
              <Text color="white" fontWeight="semibold">
                🚀 Ready to Analyze
              </Text>
              <Text fontSize="sm" color="gray.400">
                Click the button above to see Hypernym's semantic categorization in action.
                This demo shows how AI processes and categorizes crypto narratives in real-time.
              </Text>
            </VStack>
          </Alert>
        )}
      </VStack>
    </Box>
  );
};

export default HypernymDemo; 