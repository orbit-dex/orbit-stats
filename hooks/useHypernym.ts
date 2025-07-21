'use client';

import { useState, useEffect, useCallback } from 'react';
import { SemanticAnalysis, HypernymCategory } from '@/app/services/hypernym';

interface UseHypernymOptions {
  autoFetch?: boolean;
  sources?: string[];
  timeframe?: string;
}

interface HypernymData {
  narratives: Array<{ name: string; mindshare: number; momentum: number }>;
  categories: Array<{ name: string; mentions: number; change: number }>;
  sentiment: Array<{ source: string; score: number; trend: number }>;
  categoryHierarchy: HypernymCategory[];
}

interface CategorizationResult {
  primaryCategory: string;
  narratives: string[];
  confidence: number;
  themes: string[];
  originalContent?: any;
}

export const useHypernym = (options: UseHypernymOptions = {}) => {
  const { autoFetch = true, sources = ['twitter', 'news', 'research'], timeframe = '24h' } = options;

  const [data, setData] = useState<HypernymData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch trending narratives and categories
  const fetchTrendingData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/hypernym/categorize?timeframe=${timeframe}&sources=${sources.join(',')}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch trending data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      console.error('Failed to fetch Hypernym trending data:', err);
    } finally {
      setLoading(false);
    }
  }, [sources, timeframe]);

  // Analyze single text
  const analyzeText = useCallback(async (text: string): Promise<SemanticAnalysis | null> => {
    try {
      const response = await fetch('/api/hypernym/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type: 'single' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Failed to analyze text:', err);
      return null;
    }
  }, []);

  // Analyze multiple texts in batch
  const analyzeBatch = useCallback(async (texts: string[]): Promise<SemanticAnalysis[] | null> => {
    try {
      const response = await fetch('/api/hypernym/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts, type: 'batch' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Failed to analyze texts:', err);
      return null;
    }
  }, []);

  // Categorize content narratively
  const categorizeContent = useCallback(async (
    content: { title: string; description: string; tags?: string[] }
  ): Promise<CategorizationResult | null> => {
    try {
      const response = await fetch('/api/hypernym/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, type: 'single' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Failed to categorize content:', err);
      return null;
    }
  }, []);

  // Categorize multiple contents
  const categorizeBatch = useCallback(async (
    contents: Array<{ title: string; description: string; tags?: string[] }>
  ): Promise<CategorizationResult[] | null> => {
    try {
      const response = await fetch('/api/hypernym/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, type: 'batch' }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success ? result.data : null;
    } catch (err) {
      console.error('Failed to categorize contents:', err);
      return null;
    }
  }, []);

  // Enhanced content analysis with real-time categorization
  const enhanceContentWithCategories = useCallback(async (
    items: Array<{
      id: string;
      title?: string;
      content?: string;
      description?: string;
      tags?: string[];
    }>
  ) => {
    const contents = items.map(item => ({
      title: item.title || '',
      description: item.description || item.content || '',
      tags: item.tags || [],
    }));

    const categorizations = await categorizeBatch(contents);
    
    if (!categorizations) return items;

    return items.map((item, index) => ({
      ...item,
      hypernym: categorizations[index] || {
        primaryCategory: 'General',
        narratives: ['DeFi'],
        confidence: 0.5,
        themes: ['Crypto'],
      },
    }));
  }, [categorizeBatch]);

  // Get real-time narrative momentum
  const getNarrativeMomentum = useCallback((narrativeName: string): number => {
    if (!data) return 0;
    const narrative = data.narratives.find(n => 
      n.name.toLowerCase() === narrativeName.toLowerCase()
    );
    return narrative?.momentum || 0;
  }, [data]);

  // Get category mention count
  const getCategoryMentions = useCallback((categoryName: string): number => {
    if (!data) return 0;
    const category = data.categories.find(c => 
      c.name.toLowerCase() === categoryName.toLowerCase()
    );
    return category?.mentions || 0;
  }, [data]);

  // Get sentiment for specific source
  const getSourceSentiment = useCallback((sourceName: string): { score: number; trend: number } => {
    if (!data) return { score: 0, trend: 0 };
    const sentiment = data.sentiment.find(s => 
      s.source.toLowerCase() === sourceName.toLowerCase()
    );
    return {
      score: sentiment?.score || 0,
      trend: sentiment?.trend || 0,
    };
  }, [data]);

  // Auto-fetch data on mount and when dependencies change
  useEffect(() => {
    if (autoFetch) {
      fetchTrendingData();
    }
  }, [autoFetch, fetchTrendingData]);

  return {
    // State
    data,
    loading,
    error,

    // Actions
    fetchTrendingData,
    analyzeText,
    analyzeBatch,
    categorizeContent,
    categorizeBatch,
    enhanceContentWithCategories,

    // Utilities
    getNarrativeMomentum,
    getCategoryMentions,
    getSourceSentiment,

    // Refresh data
    refresh: fetchTrendingData,
  };
};

export default useHypernym; 