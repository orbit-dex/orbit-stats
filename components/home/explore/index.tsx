'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Text,
  Flex,
  Grid,
  Button,
  Select,
  Input,
  IconButton,
  Tab,
  Tabs,
  TabList,
  InputGroup,
  InputRightElement,
  VStack,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  MenuDivider,
  Icon,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Wrap,
  WrapItem
} from '@chakra-ui/react';
import { FiSearch, FiClock, FiBookmark, FiStar, FiBell, FiGlobe, FiBook, FiChevronLeft, FiChevronRight, FiHeadphones, FiInfo, FiArrowLeft, FiChevronDown, FiGrid, FiTrendingUp } from 'react-icons/fi';
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, ComposedChart, BarChart, Bar, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';

interface ExploreStats {
  conference: number;
  medium: number;
  research: number;
  mirror: number;
}

interface TokenMindshare {
  name: string;
  value: number;
  change: number;
}

interface MindshareData {
  tokens: TokenMindshare[];
  social: {
    date: string;
    mentions: number;
    engagement: number;
  }[];
  narrative: {
    category: string;
    value: number;
    change: number;
  }[];
}

const sourceOptions = [
  { id: 'all', label: 'All Sources' },
  { id: 'twitter', label: 'Twitter' },
  { id: 'vote', label: 'Vote' },
  { id: 'news', label: 'News' },
  { id: 'twitter-space', label: 'Twitter Space' },
  { id: 'podcast', label: 'Podcast' },
  { id: 'conference', label: 'Conference' },
  { id: 'medium', label: 'Medium' },
  { id: 'research', label: 'Research' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'discord', label: 'Discord' },
  { id: 'telegram', label: 'Telegram' },
];

const tabData = [
  { id: 'twitter', label: 'Twitter' },
  { id: 'news', label: 'News' },
  { id: 'research', label: 'Research' },
  { id: 'mirror', label: 'Mirror' },
  { id: 'conference', label: 'Conference' },
  { id: 'medium', label: 'Medium' },
  { id: 'podcast', label: 'Podcast' },
];

interface PodcastEpisode {
  id: string;
  showName: string;
  title: string;
  date: string;
  views: number;
}

const mockPodcastEpisodes: PodcastEpisode[] = [
  {
    id: '1',
    showName: 'Bell Curve',
    title: 'How Jito is Unlocking Restaking for Solana | S8 Finale | Lucas Bruder',
    date: 'Jul 22, 2024',
    views: 50
  },
  {
    id: '2',
    showName: 'The Rollup',
    title: 'Eigenlayer Token Unlock: Everything You Need to Know',
    date: 'Oct 2, 2024',
    views: 21
  },
  {
    id: '3',
    showName: '0xResearch',
    title: 'Memecoins, the Eigenlayer Debacle, and Bootstrapping | Analyst Round Table',
    date: 'Oct 9, 2024',
    views: 17
  },
  {
    id: '4',
    showName: 'DeFi By Design',
    title: 'The Role of Operators, Slashing, and Liquid Restaking with EigenExplorer',
    date: 'Oct 16, 2024',
    views: 19
  },
  {
    id: '5',
    showName: 'Infinite Jungle',
    title: 'Wake Me Up When September Ends and Restaking Begins',
    date: 'Jul 31, 2024',
    views: 18
  }
];

interface TwitterPost {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  retweets: number;
}

interface TwitterSpace {
  id: string;
  host: string;
  title: string;
  date: string;
  duration: string;
  listeners: number;
  status: 'Live' | 'Scheduled' | 'Ended';
  speakers: string[];
}

interface MirrorPost {
  id: string;
  author: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  collects: number;
  mirrors: number;
}

interface DiscordMessage {
  id: string;
  author: string;
  server: string;
  channel: string;
  content: string;
  date: string;
  reactions: number;
  replies: number;
}

interface VoteProposal {
  id: string;
  title: string;
  description: string;
  status: 'Active' | 'Passed' | 'Failed' | 'Pending';
  votes: {
    for: number;
    against: number;
    abstain: number;
  };
  date: string;
  endDate: string;
  proposer: string;
}

interface NewsArticle {
  id: string;
  source: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
}

interface ResearchReport {
  id: string;
  firm: string;
  title: string;
  type: string;
  date: string;
  pages: number;
}

interface Conference {
  id: string;
  name: string;
  location: string;
  date: string;
  type: 'Virtual' | 'In-Person' | 'Hybrid';
  speakers: string[];
  attendees: number;
  description: string;
}

interface MediumArticle {
  id: string;
  author: string;
  publication: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
  claps: number;
  responses: number;
}

// Mock data for different sources
const mockTwitterSpaces: TwitterSpace[] = [
  {
    id: '1',
    host: 'EigenLayer',
    title: 'EigenLayer Community Call: Mainnet Launch Updates',
    date: 'Oct 16, 2024',
    duration: '1h 30m',
    listeners: 2450,
    status: 'Ended',
    speakers: ['Sreeram', 'Paul V', 'Chris D']
  },
  {
    id: '2',
    host: 'DeFi_Weekly',
    title: 'The Future of Restaking: EigenLayer Deep Dive',
    date: 'Oct 18, 2024',
    duration: '45m',
    listeners: 1200,
    status: 'Scheduled',
    speakers: ['Alex B', 'Sarah K']
  },
  {
    id: '3',
    host: 'CryptoResearch',
    title: 'EigenLayer Technical Workshop: Operator Setup Guide',
    date: 'Oct 15, 2024',
    duration: '2h',
    listeners: 3100,
    status: 'Live',
    speakers: ['Mike R', 'Jenny L', 'Tom W']
  }
];

const mockMirrorPosts: MirrorPost[] = [
  {
    id: '1',
    author: 'eigen.mirror.xyz',
    title: 'EigenLayer: The Path to Decentralized Security',
    summary: 'An in-depth analysis of how EigenLayer is revolutionizing blockchain security through restaking mechanisms.',
    date: 'Oct 15, 2024',
    readTime: '12 min',
    collects: 456,
    mirrors: 234
  },
  {
    id: '2',
    author: 'defi.mirror.xyz',
    title: 'Restaking Economics: A New Paradigm',
    summary: 'Exploring the economic implications of restaking and its impact on validator incentives.',
    date: 'Oct 14, 2024',
    readTime: '8 min',
    collects: 325,
    mirrors: 178
  },
  {
    id: '3',
    author: 'crypto.mirror.xyz',
    title: 'Building on EigenLayer: Developer Guide',
    summary: 'Technical guide for developers looking to build applications leveraging EigenLayer\'s restaking protocol.',
    date: 'Oct 13, 2024',
    readTime: '15 min',
    collects: 567,
    mirrors: 289
  }
];

const mockDiscordMessages: DiscordMessage[] = [
  {
    id: '1',
    author: 'EigenDev',
    server: 'EigenLayer Official',
    channel: 'technical-discussion',
    content: 'We\'re excited to announce the release of our new operator dashboard! Check out the latest features for managing your staked assets.',
    date: 'Oct 16, 2024',
    reactions: 89,
    replies: 45
  },
  {
    id: '2',
    author: 'ValidatorPro',
    server: 'EigenLayer Official',
    channel: 'node-operators',
    content: 'Has anyone encountered issues with the latest testnet deployment? Getting some unusual metrics on validator performance.',
    date: 'Oct 15, 2024',
    reactions: 34,
    replies: 28
  },
  {
    id: '3',
    author: 'EigenMod',
    server: 'EigenLayer Official',
    channel: 'announcements',
    content: 'Important update: Scheduled maintenance window for operator nodes tomorrow at 14:00 UTC. Please ensure your nodes are updated to version 1.2.0.',
    date: 'Oct 14, 2024',
    reactions: 156,
    replies: 67
  }
];

const mockTwitterPosts: TwitterPost[] = [
  {
    id: '1',
    author: 'CryptoAnalyst',
    content: 'Breaking: Eigenlayer TVL hits new ATH at $2.3B. Institutional interest growing rapidly as restaking gains momentum.',
    date: 'Oct 16, 2024',
    likes: 1243,
    retweets: 456
  },
  {
    id: '2',
    author: 'DeFi_Pulse',
    content: 'Eigenlayer operator set update: 200+ active operators now participating in network.',
    date: 'Oct 15, 2024',
    likes: 892,
    retweets: 321
  }
];

const mockVoteProposals: VoteProposal[] = [
  {
    id: '1',
    title: 'EIP-1: Increase Minimum Operator Stake',
    description: 'Proposal to increase the minimum stake requirement for network operators from 32 ETH to 64 ETH to enhance network security.',
    status: 'Active',
    votes: {
      for: 1250000,
      against: 450000,
      abstain: 75000
    },
    date: 'Oct 15, 2024',
    endDate: 'Oct 22, 2024',
    proposer: 'EigenLabs'
  },
  {
    id: '2',
    title: 'EIP-2: Implement Slashing Penalties',
    description: 'Introduce a new slashing mechanism for operators who fail to maintain required uptime or engage in malicious behavior.',
    status: 'Passed',
    votes: {
      for: 2100000,
      against: 300000,
      abstain: 50000
    },
    date: 'Oct 10, 2024',
    endDate: 'Oct 17, 2024',
    proposer: 'SecurityDAO'
  },
  {
    id: '3',
    title: 'EIP-3: Expand Restaking Use Cases',
    description: 'Add support for new restaking use cases including liquid staking derivatives and cross-chain validation.',
    status: 'Active',
    votes: {
      for: 890000,
      against: 650000,
      abstain: 120000
    },
    date: 'Oct 16, 2024',
    endDate: 'Oct 23, 2024',
    proposer: 'RestakeDAO'
  }
];

const mockNewsArticles: NewsArticle[] = [
  {
    id: '1',
    source: 'CoinDesk',
    title: 'Eigenlayer Introduces New Staking Derivatives, Market Reacts Positively',
    summary: 'The Ethereum scaling solution introduces new staking derivatives, allowing for greater flexibility in restaking.',
    date: 'Oct 16, 2024',
    readTime: '5 min'
  },
  {
    id: '2',
    source: 'The Block',
    title: "Inside Eigenlayer's Plan to Revolutionize Ethereum Staking",
    summary: 'An in-depth look at how Eigenlayer is transforming the staking landscape with innovative solutions.',
    date: 'Oct 15, 2024',
    readTime: '8 min'
  }
];

const mockResearchReports: ResearchReport[] = [
  {
    id: '1',
    firm: 'Delphi Digital',
    title: 'Eigenlayer: Reshaping the Future of Ethereum Staking',
    type: 'Research Report',
    date: 'Oct 16, 2024',
    pages: 42
  },
  {
    id: '2',
    firm: 'Messari',
    title: 'Q3 2024 Eigenlayer Network Analysis',
    type: 'Quarterly Report',
    date: 'Oct 10, 2024',
    pages: 35
  }
];

const mockConferences: Conference[] = [
  {
    id: '1',
    name: 'ETHGlobal London',
    location: 'London, UK',
    date: 'Oct 15, 2024',
    type: 'In-Person',
    speakers: ['Vitalik Buterin', 'Sreeram Kannan', 'Dan Robinson'],
    attendees: 3500,
    description: 'Special workshop on EigenLayer integration and restaking mechanisms for Ethereum scaling solutions.'
  },
  {
    id: '2',
    name: 'Restaking Summit 2024',
    location: 'Virtual',
    date: 'Oct 12, 2024',
    type: 'Virtual',
    speakers: ['Paul Gafni', 'Alex Evans', 'Tarun Chitra'],
    attendees: 5200,
    description: 'Deep dive into the future of restaking protocols and their impact on blockchain security.'
  },
  {
    id: '3',
    name: 'DevConnect Paris',
    location: 'Paris, France',
    date: 'Oct 8, 2024',
    type: 'Hybrid',
    speakers: ['Justin Drake', 'Georgios Konstantopoulos', 'Elena Nadolinski'],
    attendees: 2800,
    description: 'Technical session on building middleware solutions with EigenLayer and implementing AVS.'
  }
];

const mockMediumArticles: MediumArticle[] = [
  {
    id: '1',
    author: 'EigenLayer Team',
    publication: 'EigenLayer Blog',
    title: 'Understanding EigenLayer\'s Role in Ethereum\'s Security Ecosystem',
    summary: 'A comprehensive overview of how EigenLayer enhances Ethereum\'s security through restaking and middleware solutions.',
    date: 'Oct 16, 2024',
    readTime: '10 min',
    claps: 2300,
    responses: 45
  },
  {
    id: '2',
    author: 'DeFi Researcher',
    publication: 'DeFi Weekly',
    title: 'The Economics of Restaking: An Analysis',
    summary: 'Exploring the economic implications and game theory behind restaking mechanisms in EigenLayer.',
    date: 'Oct 14, 2024',
    readTime: '8 min',
    claps: 1800,
    responses: 32
  },
  {
    id: '3',
    author: 'Crypto Observer',
    publication: 'Blockchain Insights',
    title: 'EigenLayer vs Traditional Staking: A Comparative Study',
    summary: 'Detailed comparison between traditional staking models and EigenLayer\'s innovative restaking approach.',
    date: 'Oct 12, 2024',
    readTime: '12 min',
    claps: 3100,
    responses: 67
  }
];

interface ProjectEvent {
  date: string;
  price: number;
  sentiment: number;
  mindshare: number;
  description: string;
}

interface ProjectConfig {
  basePrice: number;
  priceVolatility: number;
  sentimentRange: readonly [number, number] | [number, number];
  mindshareRange: readonly [number, number] | [number, number];
  events: readonly ProjectEvent[] | ProjectEvent[];
}

interface ProjectDataMap {
  [key: string]: ProjectConfig;
}

// Add project-specific data mapping
const PROJECT_DATA: ProjectDataMap = {
  'Eigenlayer': {
    basePrice: 3200,
    priceVolatility: 50,
    sentimentRange: [-3, 7] as [number, number],
    mindshareRange: [1, 9] as [number, number],
    events: [
      {
        date: "2024-01-25",
        price: 3555.86,
        sentiment: 4.49,
        mindshare: 2.8,
        description: "TVL hits new ATH"
      },
      {
        date: "2024-02-01",
        price: 3612.45,
        sentiment: 5.12,
        mindshare: 3.1,
        description: "Protocol upgrade announced"
      }
    ] as ProjectEvent[]
  },
  'Arbitrum': {
    basePrice: 1.50,
    priceVolatility: 0.2,
    sentimentRange: [-2, 5],
    mindshareRange: [1, 7],
    events: [
      { date: '2024-01-10', price: 1.65, sentiment: 3.2, mindshare: 4.1, description: 'Protocol Upgrade' },
      { date: '2024-03-01', price: 1.80, sentiment: 4.1, mindshare: 5.2, description: 'Partnership Announcement' }
    ]
  }
} as const;

// Add interface for project metrics
interface ProjectMetrics {
  documentMentions: number;
  totalEngagement: number;
  smartEngagement: number;
}

const PROJECT_METRICS: Record<string, ProjectMetrics> = {
  'Eigenlayer': {
    documentMentions: 140379,
    totalEngagement: 2324256,
    smartEngagement: 52217
  },
  'Arbitrum': {
    documentMentions: 98234,
    totalEngagement: 1567890,
    smartEngagement: 34521
  },
  'Sui': {
    documentMentions: 125678,
    totalEngagement: 1987654,
    smartEngagement: 45678
  }
};

// Update chart data generation
const generateChartData = (selectedProject: string) => {
  const projectConfig = PROJECT_DATA[selectedProject] || PROJECT_DATA['Eigenlayer']; // Default to Eigenlayer if no project selected
  
  return Array.from({ length: 365 }, (_, i) => {
    const date = new Date(2023, 10, 1);
    date.setDate(date.getDate() + i);
    const currentDate = date.toISOString().split('T')[0];
    
    // Check if there's a specific event for this date
    const event = projectConfig.events.find(e => e.date === currentDate);
    if (event) {
      return {
        date: currentDate,
        price: event.price,
        sentiment: event.sentiment,
        mindshare: event.mindshare
      };
    }

    // Generate regular data points
    const dayOfYear = Math.floor(i / 30);
    const baseVolatility = (Math.random() - 0.5) * projectConfig.priceVolatility;
    const sentimentBase = (projectConfig.sentimentRange[1] + projectConfig.sentimentRange[0]) / 2;
    const sentimentVolatility = (projectConfig.sentimentRange[1] - projectConfig.sentimentRange[0]) / 4;
    
    return {
      date: currentDate,
      price: Math.round((projectConfig.basePrice + baseVolatility + (dayOfYear * projectConfig.priceVolatility * 0.1)) * 100) / 100,
      sentiment: Math.round((sentimentBase + (Math.random() - 0.5) * sentimentVolatility) * 100) / 100,
      mindshare: Math.round((projectConfig.mindshareRange[0] + Math.random() * (projectConfig.mindshareRange[1] - projectConfig.mindshareRange[0])) * 100) / 100
    };
  });
};

// Update the constants at the top
const SEARCH_OPTIONS = {
  "Blockchain Projects": [
    "Ethereum",
    "BNB Chain",
    "Arbitrum",
    "Optimism",
    "Polygon",
    "Avalanche",
    "Sui",
    "Bitcoin",
    "Cardano",
    "TRON",
    "Cosmos",
    "Polkadot",
    "NEAR Protocol",
    "Chainlink",
    "Internet Computer",
    "Filecoin",
    "Algorand",
    "Hedera",
    "Tezos",
    "EOS",
    "Stellar",
    "VeChain",
    "Zilliqa",
    "Kusama",
    "Theta Network"
  ],
  "Real World Assets": [
    "Centrifuge",
    "Goldfinch",
    "MakerDAO",
    "Maple Finance",
    "RealT",
    "Ondo Finance",
    "Harbor Protocol",
    "TrueFi",
    "New Silver",
    "Backed Finance",
    "Polytrade",
    "Credix",
    "Block Estate",
    "Tangible",
    "RWA Market"
  ]
};

type SubPage = 'search' | 'trends';

interface TrendData {
  name: string;
  current: number;
  d1Change: number;
  d7Change: number;
  d30Change: number;
  d365Change: number;
}

const TREND_CATEGORIES = [
  'ETF',
  'Halving',
  'AI',
  'ZK',
  'BRC-20',
  'Layer 2',
  'Layer 3',
  'App Chain',
  'Parallel EVM',
  'Modularity',
  'Data Availability',
  'LSD',
  'LRT',
  'GameFi',
  'SocialFi',
  'DePIN',
  'DeSci',
  'Decentralized Social',
  'EIP-1559',
  'EIP-4844',
  'Account Abstraction',
  'RWA',
  'Telegram Bot',
  'Omnichain'
];

const Explore: React.FC = (): JSX.Element => {
  const [mode, setMode] = useState<'social' | 'research'>('social');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [projectSearchQuery, setProjectSearchQuery] = React.useState<string>('');
  const [selectedProject, setSelectedProject] = React.useState<string>('');
  const [pinnedSearches, setPinnedSearches] = React.useState<string[]>([]);
  const [timeFilter, setTimeFilter] = React.useState<string>('Last 3m');
  const [selectedSource, setSelectedSource] = React.useState<string>('research');
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = React.useState(0);
  const visibleCount = 4;
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(false);
  const [activeVisTab, setActiveVisTab] = React.useState('analytics');
  const [viewMode, setViewMode] = useState<'heatmap' | 'trend'>('trend');
  const [timeRange, setTimeRange] = useState<'7D' | '30D' | '3M' | '6M' | '1Y'>('7D');

  // Update chart data when project selection changes
  const [currentChartData, setCurrentChartData] = useState(generateChartData('Eigenlayer'));

  useEffect(() => {
    if (selectedProject) {
      setCurrentChartData(generateChartData(selectedProject));
    }
  }, [selectedProject]);

  const handleSearch = () => {
    if (searchQuery.trim() && !pinnedSearches.includes(searchQuery.trim())) {
      setPinnedSearches([...pinnedSearches, searchQuery.trim()]);
      setSearchQuery('');
    }
  };

  const removeSearch = (search: string) => {
    setPinnedSearches(pinnedSearches.filter(s => s !== search));
  };

  const handlePrevious = () => {
    setVisibleStartIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setVisibleStartIndex(prev => Math.min(tabData.length - visibleCount, prev + 1));
  };

  const renderTabContent = () => {
    switch (tabData[selectedTab].id) {
      case 'twitter':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockTwitterPosts.map((post) => (
              <Box
                key={post.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      @{post.author}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {post.date}
                    </Text>
                  </Flex>
                  <Text color="gray.400" fontSize="sm">
                    {post.content}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">❤</Box>
                      <Text color="gray.500" fontSize="xs">
                        {post.likes}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">↺</Box>
                      <Text color="gray.500" fontSize="xs">
                        {post.retweets}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'news':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockNewsArticles.map((article) => (
              <Box
                key={article.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {article.source}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {article.date}
                    </Text>
                  </Flex>
                  <Text color="white" fontSize="sm">
                    {article.title}
                  </Text>
                  <Text color="gray.400" fontSize="sm" noOfLines={2}>
                    {article.summary}
                  </Text>
                  <Text color="gray.500" fontSize="xs">
                    {article.readTime} read
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'research':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockResearchReports.map((report) => (
              <Box
                key={report.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {report.firm}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {report.date}
                    </Text>
                  </Flex>
                  <Text color="white" fontSize="sm">
                    {report.title}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Text color="gray.400" fontSize="xs">
                      {report.type}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {report.pages} pages
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'twitter-space':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockTwitterSpaces.map((space) => (
              <Box
                key={space.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {space.host}
                    </Text>
                    <Box
                      px={2}
                      py={1}
                      borderRadius="full"
                      bg={
                        space.status === 'Live'
                          ? '#10B981'
                          : space.status === 'Scheduled'
                            ? '#3B82F6'
                            : '#6B7280'
                      }
                    >
                      <Text color="white" fontSize="xs">
                        {space.status}
                      </Text>
                    </Box>
                  </Flex>
                  <Text color="white" fontSize="sm">
                    {space.title}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">👥</Box>
                      <Text color="gray.500" fontSize="xs">
                        {space.listeners}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="xs">
                      {space.duration}
                    </Text>
                  </Flex>
                  <Text color="gray.400" fontSize="xs">
                    Speakers: {space.speakers.join(', ')}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'mirror':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockMirrorPosts.map((post) => (
              <Box
                key={post.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {post.author}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {post.date}
                    </Text>
                  </Flex>
                  <Text color="white" fontSize="sm">
                    {post.title}
                  </Text>
                  <Text color="gray.400" fontSize="sm" noOfLines={2}>
                    {post.summary}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">💎</Box>
                      <Text color="gray.500" fontSize="xs">
                        {post.collects}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">🔄</Box>
                      <Text color="gray.500" fontSize="xs">
                        {post.mirrors}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="xs">
                      {post.readTime} read
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'discord':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockDiscordMessages.map((message) => (
              <Box
                key={message.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Flex align="center" gap={2}>
                      <Text color="white" fontSize="sm" fontWeight="medium">
                        {message.author}
                      </Text>
                      <Text color="gray.500" fontSize="xs">
                        {message.server} • {message.channel}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="xs">
                      {message.date}
                    </Text>
                  </Flex>
                  <Text color="gray.400" fontSize="sm">
                    {message.content}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">👍</Box>
                      <Text color="gray.500" fontSize="xs">
                        {message.reactions}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">💬</Box>
                      <Text color="gray.500" fontSize="xs">
                        {message.replies}
                      </Text>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'conference':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockConferences.map((conf) => (
              <Box
                key={conf.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {conf.name}
                    </Text>
                    <Box
                      px={2}
                      py={1}
                      borderRadius="full"
                      bg={
                        conf.type === 'Virtual' ? '#3B82F6' :
                        conf.type === 'In-Person' ? '#10B981' :
                        '#A78BFA'
                      }
                    >
                      <Text color="white" fontSize="xs">
                        {conf.type}
                      </Text>
                    </Box>
                  </Flex>
                  <Text color="gray.400" fontSize="sm" noOfLines={2}>
                    {conf.description}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Text color="gray.500" fontSize="xs">
                      {conf.location}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {conf.date}
                    </Text>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">👥</Box>
                      <Text color="gray.500" fontSize="xs">
                        {conf.attendees}
                      </Text>
                    </Flex>
                  </Flex>
                  <Text color="gray.400" fontSize="xs">
                    Speakers: {conf.speakers.join(', ')}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'medium':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockMediumArticles.map((article) => (
              <Box
                key={article.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Flex direction="column">
                      <Text color="gray.400" fontSize="xs">
                        {article.publication}
                      </Text>
                      <Text color="white" fontSize="sm" fontWeight="medium">
                        {article.author}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="xs">
                      {article.date}
                    </Text>
                  </Flex>
                  <Text color="white" fontSize="sm">
                    {article.title}
                  </Text>
                  <Text color="gray.400" fontSize="sm" noOfLines={2}>
                    {article.summary}
                  </Text>
                  <Flex align="center" gap={4}>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">👏</Box>
                      <Text color="gray.500" fontSize="xs">
                        {article.claps}
                      </Text>
                    </Flex>
                    <Flex align="center" gap={1}>
                      <Box as="span" color="#A78BFA">💬</Box>
                      <Text color="gray.500" fontSize="xs">
                        {article.responses}
                      </Text>
                    </Flex>
                    <Text color="gray.500" fontSize="xs">
                      {article.readTime} read
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      case 'podcast':
        return (
          <VStack spacing={3} align="stretch" px={2}>
            {mockPodcastEpisodes.map((episode) => (
              <Box
                key={episode.id}
                py={3}
                cursor="pointer"
                _hover={{ bg: '#1A1A1A' }}
                borderRadius="md"
              >
                <Flex direction="column" gap={1}>
                  <Flex justify="space-between" align="center">
                    <Text color="white" fontSize="sm" fontWeight="medium">
                      {episode.showName}
                    </Text>
                    <Text color="gray.500" fontSize="xs">
                      {episode.date}
                    </Text>
                  </Flex>
                  <Text color="gray.400" fontSize="sm">
                    {episode.title}
                  </Text>
                  <Flex align="center" gap={2}>
                    <Box as="span" color="#A78BFA">
                      <FiHeadphones size={14} />
                    </Box>
                    <Text color="gray.500" fontSize="xs">
                      {episode.views}
                    </Text>
                  </Flex>
                </Flex>
              </Box>
            ))}
          </VStack>
        );

      default:
        return (
          <VStack spacing={3} align="stretch" px={2}>
            <Text color="gray.400" fontSize="sm">Select a source to view content</Text>
          </VStack>
        );
    }
  };

  const renderVisualization = (): JSX.Element => {
    // Social page visualization
    if (mode === 'social') {
      const formatValue = (value: number) => value.toFixed(2);
      const formatLargeNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
      };
      
      const metrics = PROJECT_METRICS[selectedProject] || PROJECT_METRICS['Eigenlayer'];
      
      return (
        <VStack height="100%" spacing={4} align="stretch">
          {/* Project Title and Metrics */}
          {selectedProject && (
            <VStack px={4} spacing={3} align="stretch">
              <Flex align="center" gap={2}>
                <Box 
                  bg="#1A1A1A" 
                  p={1} 
                  borderRadius="md"
                  display="inline-flex"
                  alignItems="center"
                >
                  <Icon as={FiInfo} color="#60A5FA" mr={2} />
                </Box>
                <Text fontSize="xl" fontWeight="semibold" color="white">
                  {selectedProject === 'Eigenlayer' ? 'Eigenlayer (EIGEN)' : selectedProject}
                </Text>
              </Flex>
              
              {/* Metrics Row */}
              <Flex gap={8}>
                <HStack spacing={2}>
                  <Text color="gray.400" fontSize="sm">Total document mentions</Text>
                  <Icon as={FiInfo} color="gray.600" boxSize={3} />
                  <Text color="white" fontSize="sm">{formatLargeNumber(metrics.documentMentions)}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Text color="gray.400" fontSize="sm">Total engagement</Text>
                  <Icon as={FiInfo} color="gray.600" boxSize={3} />
                  <Text color="white" fontSize="sm">{formatLargeNumber(metrics.totalEngagement)}</Text>
                </HStack>
                <HStack spacing={2}>
                  <Text color="gray.400" fontSize="sm">Smart engagement</Text>
                  <Icon as={FiInfo} color="gray.600" boxSize={3} />
                  <Text color="white" fontSize="sm">{formatLargeNumber(metrics.smartEngagement)}</Text>
                </HStack>
              </Flex>
            </VStack>
          )}

          {/* Analytics/TL;DR Tabs */}
          <Flex px={4} gap={4}>
            <Button
              size="sm"
              bg="#00DAB3"
              color="black"
              _hover={{ bg: '#00C4A2' }}
              leftIcon={<Icon as={FiTrendingUp} />}
            >
              Analytics
            </Button>
            <Button
              size="sm"
              variant="ghost"
              color="gray.400"
              _hover={{ color: 'white' }}
            >
              TL;DR
            </Button>
          </Flex>

          {/* Chart Title */}
          <Flex px={4} align="center" gap={2}>
            <Text color="gray.400" fontSize="sm">
              Mindshare Analytics
            </Text>
            <Icon as={FiInfo} color="gray.600" />
          </Flex>

          {/* First Chart - Mindshare */}
          <Box height="45%" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData}>
                <defs>
                  <linearGradient id="mindshareFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" stroke="#A0AEC0" />
                <YAxis 
                  stroke="#60A5FA"
                  tickFormatter={formatValue}
                  label={{ value: 'Mindshare', angle: -90, position: 'left', offset: 20, fill: '#60A5FA' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`Mindshare: ${formatValue(value)}`, '']}
                  labelFormatter={(label) => label}
                />
                <Area
                  type="monotone"
                  dataKey="mindshare"
                  stroke="#60A5FA"
                  fill="url(#mindshareFill)"
                  name="Mindshare"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>

          {/* Second Chart Title */}
          <Flex px={4} align="center" gap={2} mt={4}>
            <Text color="gray.400" fontSize="sm">
              Price and Sentiment Analytics
            </Text>
            <Icon as={FiInfo} color="gray.600" />
          </Flex>

          {/* Second Chart - Price and Sentiment */}
          <Box height="45%" width="100%">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={currentChartData}>
                <defs>
                  <linearGradient id="sentimentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34D399" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" stroke="#A0AEC0" />
                <YAxis 
                  yAxisId="sentiment"
                  stroke="#34D399"
                  tickFormatter={formatValue}
                  label={{ value: 'Sentiment', angle: -90, position: 'left', offset: 20, fill: '#34D399' }}
                />
                <YAxis 
                  yAxisId="price"
                  orientation="right"
                  stroke="#FBBF24"
                  tickFormatter={formatValue}
                  label={{ value: 'Price', angle: -90, position: 'right', offset: 20, fill: '#FBBF24' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number, name: string) => [`${name}: ${formatValue(value)}`, '']}
                  labelFormatter={(label) => label}
                />
                <Area
                  yAxisId="sentiment"
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#34D399"
                  fill="url(#sentimentFill)"
                  name="Sentiment"
                />
                <Line
                  yAxisId="price"
                  type="basis"
                  dataKey="price"
                  stroke="#FBBF24"
                  dot={false}
                  name="Price"
                  strokeWidth={2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        </VStack>
      );
    }

    // Research page visualization
    switch (viewMode) {
      case 'heatmap':
        return (
          <SimpleGrid columns={2} gap={6} height="100%">
            {/* Social Mindshare Heatmap */}
            <Box>
              <Text color="white" fontSize="lg" mb={4}>Social Mindshare</Text>
              <Box
                bg="#1A1A1A"
                borderRadius="md"
                p={4}
                height="calc(100% - 32px)"
                position="relative"
              >
                {/* Placeholder for heatmap visualization */}
                <Text color="gray.400">Social mindshare heatmap visualization</Text>
              </Box>
            </Box>

            {/* Narrative Mindshare Heatmap */}
            <Box>
              <Text color="white" fontSize="lg" mb={4}>Narrative Mindshare</Text>
              <Box
                bg="#1A1A1A"
                borderRadius="md"
                p={4}
                height="calc(100% - 32px)"
                position="relative"
              >
                {/* Placeholder for heatmap visualization */}
                <Text color="gray.400">Narrative mindshare heatmap visualization</Text>
              </Box>
            </Box>
          </SimpleGrid>
        );
      case 'trend':
        return (
          <Box height="100%">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData}>
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#60A5FA" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                <XAxis dataKey="date" stroke="#A0AEC0" />
                <YAxis stroke="#A0AEC0" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1A1A1A',
                    border: 'none',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="mindshare"
                  stroke="#60A5FA"
                  fill="url(#trendFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        );
      default:
        return <Box>Invalid view mode</Box>;
    }
  };

  const SocialContent = (): JSX.Element => (
    <>
      {/* Search Bar */}
      <Box p={8} borderBottom="1px solid" borderColor="gray.800">
        <Flex gap={4} alignItems="center">
          {/* Project Search Dropdown */}
          <Box position="relative" flex="6">
            <Menu matchWidth>
              <MenuButton
                as={Button}
                rightIcon={<FiChevronDown />}
                width="100%"
                bg="transparent"
                border="1px solid"
                borderColor="gray.800"
                _hover={{ borderColor: '#A78BFA' }}
                _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
                height="40px"
                fontSize="md"
                px="4"
                textAlign="left"
                color={selectedProject ? "white" : "gray.500"}
              >
                {selectedProject || "Search by Project/RWA"}
              </MenuButton>
              <MenuList 
                bg="#1A1A1A" 
                borderColor="gray.800"
                maxH="400px"
                overflowY="auto"
                css={{
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    width: '6px',
                    background: '#2D3748',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#4A5568',
                    borderRadius: '24px',
                  },
                }}
              >
                <Box px={4} py={2}>
                  <Input
                    placeholder="Filter projects and RWAs..."
                    value={projectSearchQuery}
                    onChange={(e) => setProjectSearchQuery(e.target.value)}
                    bg="transparent"
                    border="1px solid"
                    borderColor="gray.700"
                    _hover={{ borderColor: '#A78BFA' }}
                    _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
                    size="sm"
                  />
                </Box>
                {Object.entries(SEARCH_OPTIONS).map(([category, items]) => {
                  const filteredItems = items.filter(item =>
                    projectSearchQuery === '' ||
                    item.toLowerCase().includes(projectSearchQuery.toLowerCase())
                  );

                  if (filteredItems.length === 0) return null;

                  return (
                    <React.Fragment key={category}>
                      <MenuGroup 
                        title={category} 
                        color="gray.400" 
                        fontSize="xs"
                        px={3}
                        py={2}
                        fontWeight="medium"
                      >
                        {filteredItems.map((item) => (
                          <MenuItem
                            key={item}
                            onClick={() => {
                              setSelectedProject(item);
                              setProjectSearchQuery('');
                            }}
                            bg="#1A1A1A"
                            _hover={{ bg: '#2D3748' }}
                            color="white"
                          >
                            {item}
                          </MenuItem>
                        ))}
                      </MenuGroup>
                      <MenuDivider borderColor="gray.800" />
                    </React.Fragment>
                  );
                })}
              </MenuList>
            </Menu>
          </Box>

          {/* Topic Search */}
          <Box position="relative" flex="12">
            <InputGroup>
              <Input
                placeholder="Search Topic (e.g. Dencun)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                bg="transparent"
                border="1px solid"
                borderColor="gray.800"
                _hover={{ borderColor: '#A78BFA' }}
                _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
                height="40px"
                fontSize="md"
                px="4"
                py="3"
                pr="12"
              />
              <InputRightElement h="full" pr="4">
                <FiBook 
                  size={18}
                  color="#4A5568"
                  style={{ cursor: 'pointer' }}
                  onClick={handleSearch}
                />
              </InputRightElement>
            </InputGroup>
            {/* Pinned Searches */}
            {pinnedSearches.length > 0 && (
              <Flex mt={2} gap={2} flexWrap="wrap">
                {pinnedSearches.map((search, index) => (
                  <Flex
                    key={index}
                    align="center"
                    bg="#1A1A1A"
                    color="white"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    borderWidth={1}
                    borderColor="gray.800"
                  >
                    {selectedProject && (
                      <Text color="purple.400" mr={1}>{selectedProject}:</Text>
                    )}
                    <Text>{search}</Text>
                    <Box
                      as="button"
                      ml={2}
                      color="gray.400"
                      _hover={{ color: 'white' }}
                      onClick={() => removeSearch(search)}
                    >
                      ×
                    </Box>
                  </Flex>
                ))}
                {pinnedSearches.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    color="gray.400"
                    _hover={{ color: '#A78BFA' }}
                    h="auto"
                    px={2}
                    py={1}
                    onClick={() => setPinnedSearches([])}
                  >
                    Clear All
                  </Button>
                )}
              </Flex>
            )}
          </Box>

          {/* Controls */}
          <Box flex="1" display="flex" gap={4} alignItems="center" justifyContent="flex-end">
            <Button 
              bg="#A78BFA" 
              color="black" 
              _hover={{ bg: '#8B5CF6' }}
              size="sm"
              px="4"
              onClick={handleSearch}
            >
              Search
            </Button>
            <Select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              w="100px"
              bg="transparent"
              border="1px solid"
              borderColor="gray.800"
              _hover={{ borderColor: '#A78BFA' }}
              _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
              size="sm"
            >
              <option>Last 24h</option>
              <option>Last 1mo</option>
              <option>Last 3mo</option>
              <option>Last 6mo</option>
              <option>Last 1y</option>
            </Select>
            <Select
              w="100px"
              bg="transparent"
              border="1px solid"
              borderColor="gray.800"
              _hover={{ borderColor: '#A78BFA' }}
              _focus={{ borderColor: '#8B5CF6', boxShadow: 'none' }}
              size="sm"
              icon={<FiGlobe />}
              defaultValue="English"
            >
              <option value="English">English</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
            </Select>
            <Flex gap={1}>
              <IconButton
                icon={<FiStar />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: '#A78BFA' }}
                aria-label="Starred items"
                size="sm"
              />
              <IconButton
                icon={<FiBell />}
                variant="ghost"
                color="gray.400"
                _hover={{ color: '#A78BFA' }}
                aria-label="Notifications"
                size="sm"
              />
            </Flex>
            <Button
              variant="ghost"
              color="gray.400"
              _hover={{ color: '#A78BFA' }}
              size="sm"
              fontSize="sm"
            >
              My Searches & Alerts
            </Button>
          </Box>
        </Flex>
      </Box>

      {/* Filter Pills */}
      <Box p={8} borderBottom="1px solid" borderColor="gray.800">
        <Flex gap={4} flexWrap="wrap">
          {sourceOptions.map((source) => (
            <Button
              key={source.id}
              variant={selectedSource === source.id ? 'solid' : 'outline'}
              onClick={() => setSelectedSource(source.id)}
              size="sm"
              bg={selectedSource === source.id ? '#A78BFA' : 'transparent'}
              color={selectedSource === source.id ? 'black' : 'gray.400'}
              borderColor={selectedSource === source.id ? '#A78BFA' : 'gray.800'}
              _hover={{
                bg: selectedSource === source.id ? '#8B5CF6' : 'transparent',
                borderColor: '#A78BFA',
                color: selectedSource === source.id ? 'black' : '#A78BFA'
              }}
              borderRadius="full"
            >
              {source.label}
            </Button>
          ))}
        </Flex>
      </Box>

      {/* Content Area */}
      <Box p={8}>
        <Grid templateColumns={{ base: "1fr", lg: "400px minmax(0, 1fr)" }} gap={8}>
          {/* Left Column - Source Stats */}
          <Box bg="#111" p={4} borderRadius="lg" borderColor="gray.800" borderWidth={1} height="800px" width="400px">
            <Tabs 
              index={selectedTab} 
              onChange={setSelectedTab}
              variant="unstyled"
              width="100%"
              height="100%"
            >
              <TabList borderBottom="1px solid" borderColor="gray.800" mb={4}>
                <Flex align="center" width="100%">
                  <IconButton
                    icon={<FiChevronLeft />}
                    variant="ghost"
                    color="gray.500"
                    _hover={{ color: 'white' }}
                    aria-label="Previous tab"
                    size="sm"
                    onClick={handlePrevious}
                    isDisabled={visibleStartIndex === 0}
                  />
                  <Box width="calc(100% - 64px)" overflow="hidden">
                    <Flex justify="flex-start" gap={3} px={2}>
                      {tabData.slice(visibleStartIndex, visibleStartIndex + visibleCount).map((tab: { id: string; label: string }, index: number) => (
                        <Tab
                          key={tab.id}
                          py={2}
                          px={4}
                          borderWidth={1}
                          borderColor={selectedTab === (index + visibleStartIndex) ? '#A78BFA' : '#333'}
                          borderRadius="md"
                          bg="transparent"
                          color={selectedTab === (index + visibleStartIndex) ? 'white' : 'gray.500'}
                          fontSize="sm"
                          position="relative"
                          onClick={() => setSelectedTab(index + visibleStartIndex)}
                          _hover={{
                            color: 'white',
                            borderColor: '#A78BFA'
                          }}
                          transition="all 0.2s"
                          minWidth="auto"
                        >
                          <Text whiteSpace="nowrap">{tab.id.charAt(0).toUpperCase() + tab.id.slice(1)}</Text>
                        </Tab>
                      ))}
                    </Flex>
                  </Box>
                  <IconButton
                    icon={<FiChevronRight />}
                    variant="ghost"
                    color="gray.500"
                    _hover={{ color: 'white' }}
                    aria-label="Next tab"
                    size="sm"
                    onClick={handleNext}
                    isDisabled={visibleStartIndex >= tabData.length - visibleCount}
                  />
                </Flex>
              </TabList>
              {renderTabContent()}
            </Tabs>
          </Box>
          
          {/* Right Column - Visualization Area */}
          <Box bg="#111" p={12} borderRadius="lg" borderColor="gray.800" borderWidth={1} height="800px">
            {renderVisualization()}
          </Box>
        </Grid>
      </Box>
    </>
  );

  const ResearchContent = (): JSX.Element => {
    const trendTags = [
      { id: 'etf', label: 'ETF', color: '#F472B6' },
      { id: 'halving', label: 'Halving', color: '#60A5FA' },
      { id: 'ai', label: 'AI', color: '#34D399' },
      { id: 'zk', label: 'ZK', color: '#FBBF24' },
      { id: 'layer2', label: 'Layer 2', color: '#A78BFA' },
      { id: 'layer3', label: 'Layer 3', color: '#93C5FD' },
      { id: 'appchain', label: 'App Chain', color: '#6EE7B7' },
      { id: 'parallel-evm', label: 'Parallel EVM', color: '#F472B6' },
      { id: 'modularity', label: 'Modularity', color: '#FB923C' },
      { id: 'da', label: 'Data Availability', color: '#4ADE80' },
      { id: 'lsd', label: 'LSD', color: '#60A5FA' },
      { id: 'lrt', label: 'LRT', color: '#FBBF24' },
      { id: 'gamefi', label: 'GameFi', color: '#F87171' },
      { id: 'socialfi', label: 'SocialFi', color: '#34D399' },
      { id: 'depin', label: 'DePIN', color: '#10B981' },
      { id: 'desci', label: 'DeSci', color: '#60A5FA' },
      { id: 'social', label: 'Decentralized Social', color: '#92400E' },
      { id: 'eip1559', label: 'EIP-1559', color: '#EF4444' },
      { id: 'eip4844', label: 'EIP-4844', color: '#22C55E' },
      { id: 'aa', label: 'Account Abstraction', color: '#10B981' },
      { id: 'rwa', label: 'RWA', color: '#F59E0B' },
      { id: 'telegram', label: 'Telegram Bot', color: '#3B82F6' },
      { id: 'omnichain', label: 'Omnichain', color: '#8B5CF6' }
    ];

    return (
      <Box p={8}>
        <Flex direction="column" gap={6}>
          <Text fontSize="2xl" color="white">Narrative Mindshare</Text>
          <Text color="gray.400" fontSize="sm">
            Narrative Mindshare is a metric that measures the prominence of a specific narrative or story within the overall market context.
          </Text>
          
          {/* Time Range Selector */}
          <Flex justify="flex-end" gap={2}>
            {['7D', '30D', '3M', '6M', '1Y'].map((range) => (
              <Button
                key={range}
                size="sm"
                variant={timeRange === range ? 'solid' : 'ghost'}
                bg={timeRange === range ? '#A78BFA' : 'transparent'}
                color={timeRange === range ? 'black' : 'gray.400'}
                onClick={() => setTimeRange(range as typeof timeRange)}
                _hover={{
                  bg: timeRange === range ? '#8B5CF6' : '#1A1A1A',
                  color: timeRange === range ? 'black' : 'white'
                }}
              >
                {range}
              </Button>
            ))}
          </Flex>

          {/* View Toggle */}
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Button
                size="sm"
                variant={viewMode === 'heatmap' ? 'solid' : 'ghost'}
                leftIcon={<Icon as={FiGrid} />}
                onClick={() => setViewMode('heatmap')}
                bg={viewMode === 'heatmap' ? '#A78BFA' : 'transparent'}
                color={viewMode === 'heatmap' ? 'black' : 'gray.400'}
                _hover={{
                  bg: viewMode === 'heatmap' ? '#8B5CF6' : '#1A1A1A',
                  color: viewMode === 'heatmap' ? 'black' : 'white'
                }}
              >
                Heatmap
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'trend' ? 'solid' : 'ghost'}
                leftIcon={<Icon as={FiTrendingUp} />}
                onClick={() => setViewMode('trend')}
                bg={viewMode === 'trend' ? '#A78BFA' : 'transparent'}
                color={viewMode === 'trend' ? 'black' : 'gray.400'}
                _hover={{
                  bg: viewMode === 'trend' ? '#8B5CF6' : '#1A1A1A',
                  color: viewMode === 'trend' ? 'black' : 'white'
                }}
              >
                Trend
              </Button>
            </HStack>
          </Flex>

          {/* Trend Tags */}
          <Wrap spacing={2}>
            {trendTags.map((tag) => (
              <WrapItem key={tag.id}>
                <Button
                  size="sm"
                  variant="outline"
                  borderColor="gray.700"
                  color={tag.color}
                  _hover={{
                    bg: '#1A1A1A',
                    borderColor: tag.color
                  }}
                >
                  {tag.label}
                </Button>
              </WrapItem>
            ))}
            <WrapItem>
              <Button
                size="sm"
                variant="ghost"
                color="gray.400"
                _hover={{ color: 'white' }}
              >
                Reset
              </Button>
            </WrapItem>
          </Wrap>

          {/* Main Content Area */}
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {/* Trend/Heatmap View */}
            <Box
              gridColumn="span 2"
              bg="#111"
              p={6}
              borderRadius="lg"
              borderColor="gray.800"
              borderWidth={1}
              height="500px"
            >
              {renderVisualization()}
            </Box>

            {/* Top Gainers */}
            <Box bg="#111" p={6} borderRadius="lg" borderColor="gray.800" borderWidth={1}>
              <VStack align="stretch" spacing={4}>
                <Text color="white" fontSize="lg">Top Gainers</Text>
                <Table variant="unstyled" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Name</Th>
                      <Th color="gray.400" isNumeric>Current</Th>
                      <Th color="gray.400" isNumeric>Δ1D</Th>
                      <Th color="gray.400" isNumeric>Δ7D</Th>
                      <Th color="gray.400" isNumeric>Δ30D</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[
                      { name: 'Stablecoin', current: '5.01%', d1: '+42bps', d7: '+227bps', d30: '+237bps' },
                      { name: 'DeFi', current: '7.12%', d1: '+33bps', d7: '+184bps', d30: '+160bps' },
                      { name: 'RWA', current: '2.09%', d1: '+192bps', d7: '+5bps', d30: '-38bps' },
                      { name: 'Layer 2', current: '3.86%', d1: '+50bps', d7: '-79bps', d30: '-147bps' }
                    ].map((item) => (
                      <Tr key={item.name} _hover={{ bg: '#1A1A1A' }}>
                        <Td color="white">{item.name}</Td>
                        <Td color="white" isNumeric>{item.current}</Td>
                        <Td color="green.400" isNumeric>{item.d1}</Td>
                        <Td color={item.d7.startsWith('+') ? 'green.400' : 'red.400'} isNumeric>{item.d7}</Td>
                        <Td color={item.d30.startsWith('+') ? 'green.400' : 'red.400'} isNumeric>{item.d30}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </Box>

            {/* Top Losers */}
            <Box bg="#111" p={6} borderRadius="lg" borderColor="gray.800" borderWidth={1}>
              <VStack align="stretch" spacing={4}>
                <Text color="white" fontSize="lg">Top Losers</Text>
                <Table variant="unstyled" size="sm">
                  <Thead>
                    <Tr>
                      <Th color="gray.400">Name</Th>
                      <Th color="gray.400" isNumeric>Current</Th>
                      <Th color="gray.400" isNumeric>Δ1D</Th>
                      <Th color="gray.400" isNumeric>Δ7D</Th>
                      <Th color="gray.400" isNumeric>Δ30D</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {[
                      { name: 'AI', current: '35.34%', d1: '-1,776bps', d7: '+449bps', d30: '+1,091bps' },
                      { name: 'Meme', current: '15.30%', d1: '-221bps', d7: '+20bps', d30: '+83bps' },
                      { name: 'BRC-20', current: '0.81%', d1: '-53bps', d7: '-185bps', d30: '-685bps' },
                      { name: 'Halving', current: '0.31%', d1: '-40bps', d7: '-126bps', d30: '-240bps' }
                    ].map((item) => (
                      <Tr key={item.name} _hover={{ bg: '#1A1A1A' }}>
                        <Td color="white">{item.name}</Td>
                        <Td color="white" isNumeric>{item.current}</Td>
                        <Td color={item.d1.startsWith('+') ? 'green.400' : 'red.400'} isNumeric>{item.d1}</Td>
                        <Td color={item.d7.startsWith('+') ? 'green.400' : 'red.400'} isNumeric>{item.d7}</Td>
                        <Td color={item.d30.startsWith('+') ? 'green.400' : 'red.400'} isNumeric>{item.d30}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </VStack>
            </Box>
          </Grid>
        </Flex>
      </Box>
    );
  };

  return (
    <Box 
      width="100vw" 
      maxWidth="100vw"
      bg="black" 
      borderRadius="xl" 
      overflow="hidden"
      position="relative"
      left="50%"
      transform="translateX(-50%)"
    >
      {/* Social/Research Toggle */}
      <Box pl={8} pt={8} pb={4}>
        <Flex
          bg="#1A1A1A"
          borderRadius="full"
          w="120px"
          h="28px"
          position="relative"
          overflow="hidden"
          zIndex={1}
        >
          {/* Background Slider */}
          <Box
            position="absolute"
            left={mode === 'social' ? 0 : '50%'}
            top={0}
            width="50%"
            height="100%"
            bg="#A78BFA"
            transition="left 0.2s ease"
          />
          
          {/* Buttons */}
          <Flex w="full" position="relative">
            <Box
              as="button"
              flex={1}
              h="full"
              onClick={() => setMode('social')}
              color={mode === 'social' ? 'black' : 'gray.400'}
              fontSize="xs"
              fontWeight="medium"
              zIndex={2}
              transition="color 0.2s ease"
              _hover={{ color: mode === 'social' ? 'black' : 'white' }}
            >
              Social
            </Box>
            <Box
              as="button"
              flex={1}
              h="full"
              onClick={() => setMode('research')}
              color={mode === 'research' ? 'black' : 'gray.400'}
              fontSize="xs"
              fontWeight="medium"
              zIndex={2}
              transition="color 0.2s ease"
              _hover={{ color: mode === 'research' ? 'black' : 'white' }}
            >
              Research
            </Box>
          </Flex>
        </Flex>
      </Box>

      {/* Content */}
      {mode === 'social' ? <SocialContent /> : <ResearchContent />}
    </Box>
  );
};

export default Explore;
