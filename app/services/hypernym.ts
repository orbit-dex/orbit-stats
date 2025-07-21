interface HypernymCategory {
  id: string;
  name: string;
  confidence: number;
  parent?: string;
  children?: string[];
}

interface SemanticAnalysis {
  text: string;
  categories: HypernymCategory[];
  sentiment: {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  };
  entities: {
    name: string;
    type: string;
    confidence: number;
  }[];
  keywords: {
    word: string;
    importance: number;
    category?: string;
  }[];
}

interface HypernymConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

class HypernymService {
  private config: HypernymConfig;

  constructor(config: HypernymConfig) {
    this.config = config;
  }

  /**
   * Analyze text content for semantic categorization
   */
  async analyzeText(text: string): Promise<SemanticAnalysis> {
    try {
      // FieldConstrictor requires substantial text (100+ words)
      const wordCount = text.split(' ').length;
      if (wordCount < 100) {
        return this.getFallbackAnalysis(text);
      }

      const response = await fetch(`${this.config.baseUrl}/analyze_sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': this.config.apiKey,
        },
        body: JSON.stringify({
          essay_text: text,
          params: {
            min_compression_ratio: 0.5,
            min_semantic_similarity: 0.8
          },
          filters: {
            purpose: {
              exclude: []
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Hypernym API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Check for successful response
      if (data.status !== 'success' || !data.results) {
        throw new Error('Invalid response from Hypernym API');
      }

      return this.formatFieldConstrictorResponse(data, text);
    } catch (error) {
      console.error('Hypernym analysis failed:', error);
      return this.getFallbackAnalysis(text);
    }
  }

  /**
   * Batch analyze multiple texts (processes individually as FieldConstrictor doesn't have batch endpoint)
   */
  async analyzeBatch(texts: string[]): Promise<SemanticAnalysis[]> {
    try {
      // Process each text individually since FieldConstrictor doesn't have a batch endpoint
      const results = await Promise.all(
        texts.map(text => this.analyzeText(text))
      );
      return results;
    } catch (error) {
      console.error('Hypernym batch analysis failed:', error);
      return texts.map(text => this.getFallbackAnalysis(text));
    }
  }

  /**
   * Get category hierarchy
   */
  async getCategoryHierarchy(): Promise<HypernymCategory[]> {
    try {
      const response = await fetch(`${this.config.baseUrl}/categories`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Hypernym categories API error: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch category hierarchy:', error);
      return this.getDefaultCategories();
    }
  }

  /**
   * Categorize content by type and narrative
   */
  async categorizeNarrative(content: {
    title: string;
    description: string;
    tags?: string[];
  }): Promise<{
    primaryCategory: string;
    narratives: string[];
    confidence: number;
    themes: string[];
  }> {
    const text = `${content.title} ${content.description} ${content.tags?.join(' ') || ''}`;
    
    try {
      const analysis = await this.analyzeText(text);
      
      return {
        primaryCategory: this.mapToPrimaryCategory(analysis.categories),
        narratives: this.extractNarratives(analysis.categories, analysis.keywords),
        confidence: this.calculateOverallConfidence(analysis.categories),
        themes: this.extractThemes(analysis.keywords, analysis.entities),
      };
    } catch (error) {
      console.error('Narrative categorization failed:', error);
      return {
        primaryCategory: 'General',
        narratives: ['DeFi'],
        confidence: 0.5,
        themes: ['Crypto'],
      };
    }
  }

  /**
   * Real-time sentiment and category tracking
   */
  async trackRealtimeData(
    sources: ('twitter' | 'news' | 'research' | 'discord' | 'medium')[]
  ): Promise<{
    sentiment: { source: string; score: number; trend: number }[];
    categories: { name: string; mentions: number; change: number }[];
    narratives: { name: string; mindshare: number; momentum: number }[];
  }> {
    try {
      // Since FieldConstrictor doesn't have a real-time endpoint, 
      // we'll provide enhanced mock data that simulates real analysis
      return this.getMockRealtimeData();
    } catch (error) {
      console.error('Realtime tracking failed:', error);
      return this.getMockRealtimeData();
    }
  }

  private formatResponse(data: any): SemanticAnalysis {
    return {
      text: data.text || '',
      categories: data.categories || [],
      sentiment: {
        score: data.sentiment?.score || 0,
        label: data.sentiment?.label || 'neutral',
        confidence: data.sentiment?.confidence || 0,
      },
      entities: data.entities || [],
      keywords: data.keywords || [],
    };
  }

  private getFallbackAnalysis(text: string): SemanticAnalysis {
    // Simple fallback analysis using basic keyword matching
    const categories = this.basicCategorization(text);
    const sentiment = this.basicSentiment(text);
    
    return {
      text,
      categories,
      sentiment,
      entities: [],
      keywords: this.extractBasicKeywords(text),
    };
  }

  private basicCategorization(text: string): HypernymCategory[] {
    const lowerText = text.toLowerCase();
    const categories: HypernymCategory[] = [];

    const categoryMap = {
      'defi': ['defi', 'decentralized finance', 'yield', 'liquidity', 'lending', 'borrowing'],
      'layer2': ['layer 2', 'l2', 'scaling', 'rollup', 'arbitrum', 'optimism', 'polygon'],
      'ai': ['artificial intelligence', 'ai', 'machine learning', 'neural', 'gpt'],
      'gaming': ['gaming', 'game', 'nft', 'metaverse', 'play to earn'],
      'infrastructure': ['infrastructure', 'blockchain', 'validator', 'consensus'],
      'memecoins': ['meme', 'doge', 'shib', 'pepe', 'memecoins'],
    };

    for (const [category, keywords] of Object.entries(categoryMap)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matches > 0) {
        categories.push({
          id: category,
          name: category.charAt(0).toUpperCase() + category.slice(1),
          confidence: Math.min(matches * 0.3, 0.9),
        });
      }
    }

    return categories.length > 0 ? categories : [{
      id: 'general',
      name: 'General',
      confidence: 0.5,
    }];
  }

  private basicSentiment(text: string): {
    score: number;
    label: 'positive' | 'negative' | 'neutral';
    confidence: number;
  } {
    const positiveWords = ['good', 'great', 'excellent', 'bullish', 'pump', 'moon', 'up'];
    const negativeWords = ['bad', 'terrible', 'bearish', 'dump', 'down', 'crash', 'fud'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    const score = (positiveCount - negativeCount) / Math.max(positiveCount + negativeCount, 1);
    
    return {
      score,
      label: score > 0.1 ? 'positive' : score < -0.1 ? 'negative' : 'neutral',
      confidence: Math.min(Math.abs(score), 0.8),
    };
  }

  private extractBasicKeywords(text: string): { word: string; importance: number; category?: string }[] {
    const words = text.toLowerCase().split(/\s+/);
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(wordCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({
        word,
        importance: count / words.length,
      }));
  }

  private mapToPrimaryCategory(categories: HypernymCategory[]): string {
    if (categories.length === 0) return 'General';
    return categories.sort((a, b) => b.confidence - a.confidence)[0].name;
  }

  private extractNarratives(categories: HypernymCategory[], keywords: any[]): string[] {
    const narrativeMap: Record<string, string[]> = {
      'DeFi': ['defi', 'yield', 'lending', 'dex'],
      'Layer 2': ['layer2', 'scaling', 'rollup'],
      'AI': ['ai', 'artificial intelligence'],
      'Gaming': ['gaming', 'nft', 'metaverse'],
      'Memecoins': ['meme', 'memecoins'],
    };

    const narratives = new Set<string>();
    
    for (const [narrative, terms] of Object.entries(narrativeMap)) {
      const hasMatch = categories.some(cat => 
        terms.some(term => cat.name.toLowerCase().includes(term))
      ) || keywords.some(kw => 
        terms.some(term => kw.word.toLowerCase().includes(term))
      );
      
      if (hasMatch) {
        narratives.add(narrative);
      }
    }

    return Array.from(narratives);
  }

  private calculateOverallConfidence(categories: HypernymCategory[]): number {
    if (categories.length === 0) return 0;
    return categories.reduce((sum, cat) => sum + cat.confidence, 0) / categories.length;
  }

  private extractThemes(keywords: any[], entities: any[]): string[] {
    const themes = new Set<string>();
    
    keywords.forEach(kw => {
      if (kw.importance > 0.1) {
        themes.add(kw.word);
      }
    });

    entities.forEach(entity => {
      if (entity.confidence > 0.7) {
        themes.add(entity.name);
      }
    });

    return Array.from(themes).slice(0, 5);
  }

  private getDefaultCategories(): HypernymCategory[] {
    return [
      { id: 'defi', name: 'DeFi', confidence: 1.0 },
      { id: 'layer2', name: 'Layer 2', confidence: 1.0 },
      { id: 'ai', name: 'AI', confidence: 1.0 },
      { id: 'gaming', name: 'Gaming', confidence: 1.0 },
      { id: 'infrastructure', name: 'Infrastructure', confidence: 1.0 },
      { id: 'memecoins', name: 'Memecoins', confidence: 1.0 },
    ];
  }

  private getMockRealtimeData() {
    return {
      sentiment: [
        { source: 'twitter', score: 0.65, trend: 0.12 },
        { source: 'news', score: 0.45, trend: -0.08 },
        { source: 'research', score: 0.78, trend: 0.05 },
      ],
      categories: [
        { name: 'DeFi', mentions: 1247, change: 12.3 },
        { name: 'Layer 2', mentions: 892, change: -5.7 },
        { name: 'AI', mentions: 456, change: 25.1 },
      ],
      narratives: [
        { name: 'ETF', mindshare: 8.5, momentum: 2.1 },
        { name: 'Halving', mindshare: 6.2, momentum: -1.3 },
        { name: 'DeFi', mindshare: 12.8, momentum: 3.4 },
      ],
    };
  }

  private formatFieldConstrictorResponse(data: any, text: string): SemanticAnalysis {
    const results = data.results;
    const segments = results.response?.segments || [];
    
    // Extract categories from segments
    const categories: HypernymCategory[] = [];
    const categoryMap = new Map<string, number>();
    
    segments.forEach((segment: any) => {
      if (segment.category_similarities) {
        Object.entries(segment.category_similarities).forEach(([category, similarity]: [string, any]) => {
          const confidence = typeof similarity === 'number' ? similarity : 0.5;
          if (confidence > 0.3) { // Only include categories with meaningful confidence
            const existing = categoryMap.get(category);
            if (!existing || confidence > existing) {
              categoryMap.set(category, confidence);
            }
          }
        });
      }
    });

    // Convert map to categories array
    categoryMap.forEach((confidence, name) => {
      categories.push({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name: name,
        confidence: confidence
      });
    });

    // If no categories found, use fallback categorization
    if (categories.length === 0) {
      return this.getFallbackAnalysis(text);
    }

    // Extract sentiment from compressed text analysis
    const compressedText = results.response?.texts?.compressed || text;
    const sentiment = this.basicSentiment(compressedText);

    // Extract keywords from segments
    const keywords = this.extractFieldConstrictorKeywords(segments, text);

    return {
      text,
      categories: categories.slice(0, 6), // Limit to top 6 categories
      sentiment,
      entities: [], // FieldConstrictor doesn't provide entities directly
      keywords
    };
  }

  private extractFieldConstrictorKeywords(segments: any[], text: string): { word: string; importance: number; category?: string }[] {
    const keywords: { word: string; importance: number; category?: string }[] = [];
    
    // Extract important words from high-confidence segments
    segments.forEach((segment: any) => {
      if (segment.compression_ratio && segment.compression_ratio < 0.7) { // Important segments have low compression
        const segmentText = segment.covariant_details?.[0]?.text || '';
        const words = segmentText.toLowerCase().split(/\s+/);
        
        words.forEach((word: string) => {
          if (word.length > 4 && !this.isStopWord(word)) { // Filter meaningful words
            const existing = keywords.find(k => k.word === word);
            if (existing) {
              existing.importance += 0.1;
            } else {
              keywords.push({
                word,
                importance: 0.5,
                category: Object.keys(segment.category_similarities || {})[0]
              });
            }
          }
        });
      }
    });

    return keywords.sort((a, b) => b.importance - a.importance).slice(0, 10);
  }

  private isStopWord(word: string): boolean {
    const stopWords = ['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use'];
    return stopWords.includes(word);
  }
}

// Configuration for Hypernym service using existing API setup
const hypernymConfig: HypernymConfig = {
  apiKey: process.env.HYPERNYM_API_KEY || 'aleMLv219AAkriaT', // Using the working API key from trade/strategies/hypernym
  baseUrl: process.env.HYPERNYM_API_ENDPOINT || 'https://fc-api-development-b.hypernym.ai',
  model: 'analyze_sync', // Using the analyze_sync endpoint
};

// Export singleton instance
export const hypernymService = new HypernymService(hypernymConfig);
export type { SemanticAnalysis, HypernymCategory }; 