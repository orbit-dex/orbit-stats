interface ExaSearchResult {
  id: string;
  url: string;
  title: string;
  text: string;
  highlights: string[];
  highlightScores: number[];
  publishedDate: string;
  author?: string;
  score: number;
}

interface ExaSearchResponse {
  results: ExaSearchResult[];
  autopromptString?: string;
}

interface ExaSearchOptions {
  type?: 'neural' | 'keyword';
  useAutoprompt?: boolean;
  numResults?: number;
  includeDomains?: string[];
  excludeDomains?: string[];
  startCrawlDate?: string;
  endCrawlDate?: string;
  startPublishedDate?: string;
  endPublishedDate?: string;
  includeText?: boolean;
  includeHighlights?: boolean;
  includeSummary?: boolean;
  category?: 'company' | 'research paper' | 'news' | 'linkedin company' | 'github' | 'tweet' | 'movie' | 'song' | 'personal site' | 'pdf';
}

class ExaService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EXA_API_KEY || '';
    this.baseUrl = 'https://api.exa.ai';
  }

  /**
   * Search for content using Exa API
   */
  async search(query: string, options: ExaSearchOptions = {}): Promise<ExaSearchResponse> {
    const {
      type = 'neural',
      useAutoprompt = true,
      numResults = 10,
      includeDomains,
      excludeDomains,
      startCrawlDate,
      endCrawlDate,
      startPublishedDate,
      endPublishedDate,
      includeText = true,
      includeHighlights = true,
      includeSummary = false,
      category
    } = options;

    try {
      // Build request body with correct EXA API format
      const requestBody: any = {
        query,
        type,
        numResults
      };

      // Add content options in the correct format
      if (includeText || includeHighlights || includeSummary) {
        requestBody.contents = {};
        if (includeText) requestBody.contents.text = true;
        if (includeHighlights) requestBody.contents.highlights = true;
        if (includeSummary) requestBody.contents.summary = true;
      }

      // Add optional parameters only if they exist and are valid
      if (useAutoprompt !== undefined) requestBody.useAutoprompt = useAutoprompt;
      
      // Add domain filters if provided
      if (includeDomains && includeDomains.length > 0) requestBody.includeDomains = includeDomains;
      if (excludeDomains && excludeDomains.length > 0) requestBody.excludeDomains = excludeDomains;
      
      // Add date filters if provided
      if (startCrawlDate) requestBody.startCrawlDate = startCrawlDate;
      if (endCrawlDate) requestBody.endCrawlDate = endCrawlDate;
      if (startPublishedDate) requestBody.startPublishedDate = startPublishedDate;
      if (endPublishedDate) requestBody.endPublishedDate = endPublishedDate;
      
      // Add category if provided
      if (category) requestBody.category = category;

      console.log('🔎 EXA API Request:', JSON.stringify(requestBody, null, 2));

      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('EXA API Error Response:', errorText);
        throw new Error(`Exa API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Exa search failed:', error);
      throw error;
    }
  }

  /**
   * Search for crypto/DeFi specific content
   */
  async searchCrypto(query: string, project?: string): Promise<ExaSearchResponse> {
    const cryptoDomains = [
      'coindesk.com',
      'cointelegraph.com',
      'theblock.co',
      'decrypt.co',
      'defipulse.com',
      'messari.io',
      'medium.com',
      'mirror.xyz',
      'substack.com'
    ];

    const fullQuery = project ? `${project} ${query}` : query;
    
    return this.search(fullQuery, {
      type: 'neural',
      numResults: 15,
      includeDomains: cryptoDomains,
      includeText: true,
      includeHighlights: true,
      startPublishedDate: '2024-01-01', // Recent content only
    });
  }

  /**
   * Search for research papers and technical content
   */
  async searchResearch(query: string, project?: string): Promise<ExaSearchResponse> {
    const researchDomains = [
      'arxiv.org',
      'papers.ssrn.com',
      'research.paradigm.xyz',
      'medium.com',
      'github.com',
      'docs.google.com',
      'hackmd.io'
    ];

    const fullQuery = project ? `${project} ${query} research paper analysis` : `${query} research paper analysis`;
    
    return this.search(fullQuery, {
      type: 'neural',
      numResults: 10,
      includeDomains: researchDomains,
      includeText: true,
      includeHighlights: true,
      category: 'research paper',
    });
  }

  /**
   * Search for social content (Twitter, Discord, etc.)
   */
  async searchSocial(query: string, project?: string): Promise<ExaSearchResponse> {
    const socialDomains = [
      'twitter.com',
      'x.com',
      'discord.gg',
      'reddit.com',
      'telegram.org'
    ];

    const fullQuery = project ? `${project} ${query}` : query;
    
    return this.search(fullQuery, {
      type: 'neural',
      numResults: 20,
      includeDomains: socialDomains,
      includeText: true,
      includeHighlights: true,
      startPublishedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
    });
  }

  /**
   * Search for news articles
   */
  async searchNews(query: string, project?: string): Promise<ExaSearchResponse> {
    const newsDomains = [
      'coindesk.com',
      'cointelegraph.com',
      'theblock.co',
      'decrypt.co',
      'benzinga.com',
      'yahoo.com',
      'reuters.com',
      'bloomberg.com'
    ];

    const fullQuery = project ? `${project} ${query} news` : `${query} crypto news`;
    
    return this.search(fullQuery, {
      type: 'neural',
      numResults: 12,
      includeDomains: newsDomains,
      includeText: true,
      includeHighlights: true,
      category: 'news',
      startPublishedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 30 days
    });
  }

  /**
   * Convert Exa results to application format
   */
  formatResults(results: ExaSearchResult[], sourceType: string) {
    return results.map((result, index) => ({
      id: result.id || `${sourceType}-${index}`,
      title: result.title,
      content: result.text,
      description: result.highlights?.join(' ') || result.text?.substring(0, 200) + '...',
      url: result.url,
      author: result.author || this.extractAuthorFromUrl(result.url),
      date: result.publishedDate || new Date().toISOString().split('T')[0],
      score: result.score,
      source: this.extractSourceFromUrl(result.url),
      type: sourceType,
      highlights: result.highlights,
      highlightScores: result.highlightScores
    }));
  }

  private extractAuthorFromUrl(url: string): string {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      if (domain.includes('medium.com')) {
        const path = new URL(url).pathname;
        const match = path.match(/@([^\/]+)/);
        return match ? match[1] : domain;
      }
      if (domain.includes('mirror.xyz')) {
        const subdomain = new URL(url).hostname.split('.')[0];
        return subdomain !== 'www' ? subdomain : domain;
      }
      return domain;
    } catch {
      return 'Unknown';
    }
  }

  private extractSourceFromUrl(url: string): string {
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      const sourceMap: Record<string, string> = {
        'coindesk.com': 'CoinDesk',
        'cointelegraph.com': 'Cointelegraph',
        'theblock.co': 'The Block',
        'decrypt.co': 'Decrypt',
        'medium.com': 'Medium',
        'mirror.xyz': 'Mirror',
        'twitter.com': 'Twitter',
        'x.com': 'X (Twitter)',
        'github.com': 'GitHub',
        'arxiv.org': 'arXiv'
      };
      return sourceMap[domain] || domain;
    } catch {
      return 'Unknown';
    }
  }
}

// Export singleton instance
export const exaService = new ExaService();
export type { ExaSearchResult, ExaSearchResponse, ExaSearchOptions }; 