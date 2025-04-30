import { NextResponse } from 'next/server';

// Mock data - replace with actual data fetching logic
const getTokenMindshare = () => {
  return [
    { name: 'BTC', value: 35, change: '+2.5%' },
    { name: 'ETH', value: 25, change: '-1.2%' },
    { name: 'SOL', value: 15, change: '+5.3%' },
    { name: 'AVAX', value: 8, change: '+0.8%' },
    { name: 'DOT', value: 7, change: '-0.5%' },
    { name: 'ADA', value: 5, change: '-2.1%' },
    { name: 'Others', value: 5, change: '-4.8%' },
  ];
};

const getSocialMindshare = () => {
  return [
    { date: 'Jan', mentions: 1200, engagement: 4500 },
    { date: 'Feb', mentions: 1500, engagement: 5200 },
    { date: 'Mar', mentions: 1800, engagement: 6000 },
    { date: 'Apr', mentions: 2200, engagement: 7500 },
    { date: 'May', mentions: 2500, engagement: 8500 },
    { date: 'Jun', mentions: 2800, engagement: 9500 },
  ];
};

const getNarrativeMindshare = () => {
  return [
    { name: 'AI', value: 30, change: '+5.2%' },
    { name: 'DeFi', value: 25, change: '-2.1%' },
    { name: 'NFTs', value: 15, change: '-3.5%' },
    { name: 'Gaming', value: 12, change: '+1.8%' },
    { name: 'L2s', value: 10, change: '+3.2%' },
    { name: 'Others', value: 8, change: '-4.6%' },
  ];
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const timeRange = searchParams.get('timeRange') || '7d';

  // In a real implementation, you would fetch data based on the timeRange
  // For now, we'll return mock data
  const data = {
    tokenMindshare: getTokenMindshare(),
    socialMindshare: getSocialMindshare(),
    narrativeMindshare: getNarrativeMindshare(),
  };

  return NextResponse.json(data);
} 