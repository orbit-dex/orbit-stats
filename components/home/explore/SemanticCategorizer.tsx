'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  Button,
  VStack,
  HStack,
  SimpleGrid,
  Progress,
  Tooltip,
  Icon,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FiTrendingUp, FiTrendingDown, FiInfo, FiRefreshCw, FiTag, FiActivity } from 'react-icons/fi';
import { motion } from 'framer-motion';
import useHypernym from '@/hooks/useHypernym';

const MotionBox = motion(Box);

interface SemanticCategorizerProps {
  selectedSources?: string[];
  timeframe?: string;
  onCategorySelect?: (category: string) => void;
  onNarrativeSelect?: (narrative: string) => void;
}

const SemanticCategorizer: React.FC<SemanticCategorizerProps> = ({
  selectedSources = ['twitter', 'news', 'research'],
  timeframe = '24h',
  onCategorySelect,
  onNarrativeSelect,
}) => {
  const {
    data,
    loading,
    error,
    refresh,
    getNarrativeMomentum,
    getCategoryMentions,
    getSourceSentiment,
  } = useHypernym({
    autoFetch: true,
    sources: selectedSources,
    timeframe,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedNarrative, setSelectedNarrative] = useState<string | null>(null);

  // Use fixed values instead of useColorModeValue to prevent hydration issues
  const bgColor = '#1a1a1a';
  const cardBg = '#2a2a2a';
  const textColor = 'white';
  const mutedColor = '#a0a0a0';

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    onCategorySelect?.(categoryName);
  };

  const handleNarrativeClick = (narrativeName: string) => {
    setSelectedNarrative(narrativeName);
    onNarrativeSelect?.(narrativeName);
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum > 1) return '#22c55e'; // Green
    if (momentum > 0) return '#3b82f6'; // Blue
    if (momentum > -1) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getMomentumIcon = (momentum: number) => {
    return momentum > 0 ? FiTrendingUp : FiTrendingDown;
  };

  const formatMomentum = (momentum: number) => {
    const absValue = Math.abs(momentum);
    const sign = momentum >= 0 ? '+' : '-';
    return `${sign}${absValue.toFixed(1)}%`;
  };

  if (loading && !data) {
    return (
      <Box bg={bgColor} p={6} borderRadius="xl">
        <Flex align="center" justify="center" minH="200px">
          <VStack spacing={4}>
            <Spinner size="xl" color="#3b82f6" />
            <Text color={textColor}>Analyzing semantic patterns...</Text>
          </VStack>
        </Flex>
      </Box>
    );
  }

  if (error) {
    return (
      <Box bg={bgColor} p={6} borderRadius="xl">
        <Alert status="error" bg={cardBg} borderRadius="lg">
          <AlertIcon />
          <VStack align="flex-start" spacing={2}>
            <Text color={textColor}>Failed to load semantic analysis</Text>
            <Button size="sm" onClick={refresh} leftIcon={<FiRefreshCw />}>
              Retry
            </Button>
          </VStack>
        </Alert>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} p={6} borderRadius="xl">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6}>
        <VStack align="flex-start" spacing={1}>
          <Flex align="center" gap={2}>
            <Icon as={FiActivity} color="#3b82f6" />
            <Text fontSize="xl" fontWeight="bold" color={textColor}>
              Semantic Analysis
            </Text>
            <Tooltip label="Real-time narrative and category analysis powered by Hypernym">
              <Icon as={FiInfo} color={mutedColor} cursor="help" />
            </Tooltip>
          </Flex>
          <Text fontSize="sm" color={mutedColor}>
            Live categorization across {selectedSources.join(', ')} • {timeframe} timeframe
          </Text>
        </VStack>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<FiRefreshCw />}
          onClick={refresh}
          isLoading={loading}
          color={textColor}
          borderColor="#3b82f6"
          _hover={{ bg: '#3b82f6', color: 'white' }}
        >
          Refresh
        </Button>
      </Flex>

      {/* Narratives Section */}
      <VStack spacing={6} align="stretch">
        <Box>
          <Flex align="center" gap={2} mb={4}>
            <Icon as={FiTag} color="#22c55e" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Trending Narratives
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {data?.narratives?.map((narrative, index) => (
              <MotionBox
                key={narrative.name}
                bg={cardBg}
                p={4}
                borderRadius="lg"
                border="1px solid"
                borderColor={selectedNarrative === narrative.name ? '#3b82f6' : 'transparent'}
                cursor="pointer"
                onClick={() => handleNarrativeClick(narrative.name)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Flex justify="space-between" align="flex-start" mb={2}>
                  <Text fontWeight="bold" color={textColor} fontSize="md">
                    {narrative.name}
                  </Text>
                  <Icon
                    as={getMomentumIcon(narrative.momentum)}
                    color={getMomentumColor(narrative.momentum)}
                  />
                </Flex>
                <VStack spacing={2} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color={mutedColor}>Mindshare</Text>
                    <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                      {narrative.mindshare.toFixed(1)}%
                    </Text>
                  </Flex>
                  <Progress
                    value={narrative.mindshare}
                    max={20}
                    colorScheme="blue"
                    size="sm"
                    borderRadius="full"
                  />
                  <Flex justify="space-between" align="center">
                    <Text fontSize="xs" color={mutedColor}>Momentum</Text>
                    <Badge
                      colorScheme={narrative.momentum > 0 ? 'green' : 'red'}
                      fontSize="xs"
                    >
                      {formatMomentum(narrative.momentum)}
                    </Badge>
                  </Flex>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>

        {/* Categories Section */}
        <Box>
          <Flex align="center" gap={2} mb={4}>
            <Icon as={FiActivity} color="#f59e0b" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Active Categories
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} spacing={3}>
            {data?.categories?.map((category, index) => (
              <MotionBox
                key={category.name}
                bg={cardBg}
                p={3}
                borderRadius="lg"
                border="1px solid"
                borderColor={selectedCategory === category.name ? '#3b82f6' : 'transparent'}
                cursor="pointer"
                onClick={() => handleCategoryClick(category.name)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <VStack spacing={2}>
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    color={textColor}
                    textAlign="center"
                    noOfLines={1}
                  >
                    {category.name}
                  </Text>
                  <Text fontSize="xs" color={mutedColor} textAlign="center">
                    {category.mentions.toLocaleString()} mentions
                  </Text>
                  <Badge
                    colorScheme={category.change > 0 ? 'green' : 'red'}
                    fontSize="xs"
                  >
                    {category.change > 0 ? '+' : ''}{category.change.toFixed(1)}%
                  </Badge>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>

        {/* Sentiment Overview */}
        <Box>
          <Flex align="center" gap={2} mb={4}>
            <Icon as={FiTrendingUp} color="#a855f7" />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>
              Sentiment Overview
            </Text>
          </Flex>
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
            {data?.sentiment?.map((sentiment, index) => (
              <MotionBox
                key={sentiment.source}
                bg={cardBg}
                p={4}
                borderRadius="lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VStack spacing={3}>
                  <Text fontSize="md" fontWeight="semibold" color={textColor} textTransform="capitalize">
                    {sentiment.source}
                  </Text>
                  <VStack spacing={1}>
                    <Text fontSize="2xl" fontWeight="bold" color={textColor}>
                      {(sentiment.score * 100).toFixed(0)}
                    </Text>
                    <Text fontSize="xs" color={mutedColor}>Sentiment Score</Text>
                  </VStack>
                  <Flex align="center" gap={2}>
                    <Icon
                      as={sentiment.trend > 0 ? FiTrendingUp : FiTrendingDown}
                      color={sentiment.trend > 0 ? '#22c55e' : '#ef4444'}
                    />
                    <Text
                      fontSize="sm"
                      color={sentiment.trend > 0 ? '#22c55e' : '#ef4444'}
                      fontWeight="semibold"
                    >
                      {formatMomentum(sentiment.trend)}
                    </Text>
                  </Flex>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default SemanticCategorizer; 