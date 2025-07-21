import { NextRequest, NextResponse } from 'next/server';
import { exaService } from '../../services/exa';
import { hypernymService } from '../../services/hypernym';

interface SearchRequest {
  query: string;
  project?: string;
  sourceType?: 'all' | 'news' | 'research' | 'social' | 'crypto';
  limit?: number;
  analyzeContent?: boolean;
}

// Enhanced mock data that simulates real search results
const generateMockResults = (query: string, project?: string, sourceType?: string, limit: number = 10) => {
  const mockContent = [
    {
      id: 'mock-1',
      title: `${project || 'DeFi'} Protocol Analysis: ${query}`,
      content: `This comprehensive analysis explores ${query} in the context of ${project || 'decentralized finance'}. The research examines various aspects including technical implementation, market impact, and future implications. Key findings suggest significant developments in blockchain infrastructure and user adoption patterns. The protocol demonstrates innovative approaches to solving scalability challenges while maintaining security and decentralization principles.`,
      description: `In-depth analysis of ${query} examining market trends, technical developments, and ecosystem impact`,
      url: `https://example.com/analysis/${query.toLowerCase().replace(/\s+/g, '-')}`,
      author: 'DeFi Research Team',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 0.95,
      source: 'Research Report',
      type: sourceType || 'research',
      highlights: [`${query} shows promising development`, `${project || 'Protocol'} ecosystem growth`]
    },
    {
      id: 'mock-2', 
      title: `Market Update: ${query} Trends and Insights`,
      content: `Recent market analysis reveals interesting patterns in ${query} adoption and implementation. The study covers multiple sectors including institutional adoption, retail engagement, and technological developments. Data suggests growing interest from traditional finance sectors and increasing integration with existing financial infrastructure. The analysis includes comparative studies with similar protocols and market positioning strategies.`,
      description: `Market trends and insights related to ${query} with focus on adoption patterns`,
      url: `https://example.com/market/${query.toLowerCase().replace(/\s+/g, '-')}`,
      author: 'Market Analyst',
      date: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 0.88,
      source: 'Market Report',
      type: sourceType || 'news',
      highlights: [`${query} market dynamics`, 'institutional adoption trends']
    },
    {
      id: 'mock-3',
      title: `Technical Deep Dive: ${query} Implementation`,
      content: `This technical analysis provides detailed insights into ${query} implementation and architecture. The document covers smart contract design, security considerations, and performance optimizations. Key technical innovations include novel consensus mechanisms, improved transaction throughput, and enhanced user experience features. The implementation demonstrates best practices in blockchain development and sets new standards for protocol design.`,
      description: `Technical analysis of ${query} covering implementation details and architectural decisions`,
      url: `https://example.com/technical/${query.toLowerCase().replace(/\s+/g, '-')}`,
      author: 'Technical Research',
      date: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      score: 0.92,
      source: 'Technical Report',
      type: 'research',
      highlights: [`${query} technical innovations`, 'blockchain architecture']
    }
  ];

  return mockContent.slice(0, limit);
};

export async function POST(request: NextRequest) {
  try {
    const body: SearchRequest = await request.json();
    const { 
      query, 
      project, 
      sourceType = 'all', 
      limit = 10,
      analyzeContent = true 
    } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Searching for: "${query}" (project: ${project}, type: ${sourceType})`);

    // Step 1: Try to search with Exa API, fallback to enhanced mock data
    let searchResults: any[] = [];
    let searchMethod = 'exa';
    
    try {
      // Only attempt Exa search if we have an API key
      if (process.env.EXA_API_KEY) {
        switch (sourceType) {
          case 'news':
            const newsResults = await exaService.searchNews(query, project);
            searchResults = exaService.formatResults(newsResults.results, 'news');
            break;
            
          case 'research':
            const researchResults = await exaService.searchResearch(query, project);
            searchResults = exaService.formatResults(researchResults.results, 'research');
            break;
            
          case 'social':
            const socialResults = await exaService.searchSocial(query, project);
            searchResults = exaService.formatResults(socialResults.results, 'social');
            break;
            
          case 'crypto':
            const cryptoResults = await exaService.searchCrypto(query, project);
            searchResults = exaService.formatResults(cryptoResults.results, 'crypto');
            break;
            
          case 'all':
          default:
            // Search across multiple types and combine
            const [news, research, crypto] = await Promise.allSettled([
              exaService.searchNews(query, project),
              exaService.searchResearch(query, project),
              exaService.searchCrypto(query, project)
            ]);
            
            const allResults: any[] = [];
            
            if (news.status === 'fulfilled') {
              allResults.push(...exaService.formatResults(news.value.results.slice(0, 4), 'news'));
            }
            if (research.status === 'fulfilled') {
              allResults.push(...exaService.formatResults(research.value.results.slice(0, 3), 'research'));
            }
            if (crypto.status === 'fulfilled') {
              allResults.push(...exaService.formatResults(crypto.value.results.slice(0, 3), 'crypto'));
            }
            
            // Sort by relevance score and limit
            searchResults = allResults
              .sort((a, b) => (b.score || 0) - (a.score || 0))
              .slice(0, limit);
            break;
        }
      } else {
        throw new Error('Exa API key not configured - using enhanced mock data');
      }

      console.log(`📊 Found ${searchResults.length} results from Exa`);

    } catch (searchError) {
      console.log('🔄 Exa search failed, using enhanced mock data for Hypernym analysis');
      searchResults = generateMockResults(query, project, sourceType, limit);
      searchMethod = 'mock-enhanced';
    }

    // Step 2: Analyze content with Hypernym (this is the main feature)
    let enhancedResults = searchResults;
    
    if (analyzeContent && searchResults.length > 0) {
      console.log(`🧠 Analyzing content with Hypernym...`);
      
      try {
        // Analyze each piece of content with Hypernym
        const analysisPromises = searchResults.map(async (result) => {
          try {
            const contentToAnalyze = `${result.title} ${result.description || result.content}`;
            const analysis = await hypernymService.categorizeNarrative({
              title: result.title,
              description: result.description || result.content || '',
              tags: result.highlights || []
            });
            
            return {
              ...result,
              hypernym: {
                primaryCategory: analysis.primaryCategory,
                narratives: analysis.narratives,
                confidence: analysis.confidence,
                themes: analysis.themes,
                analyzed: true
              }
            };
          } catch (error) {
            console.error(`Failed to analyze content for ${result.id}:`, error);
            return {
              ...result,
              hypernym: {
                primaryCategory: 'General',
                narratives: ['DeFi'],
                confidence: 0.5,
                themes: ['Crypto'],
                analyzed: false
              }
            };
          }
        });

        enhancedResults = await Promise.all(analysisPromises);
        console.log(`✅ Enhanced ${enhancedResults.length} results with Hypernym analysis`);
        
      } catch (error) {
        console.error('Hypernym analysis failed:', error);
        // Continue with unanalyzed results
      }
    }

    // Step 3: Return combined results
    const response = {
      success: true,
      data: {
        query,
        project,
        sourceType,
        total: enhancedResults.length,
        results: enhancedResults,
        metadata: {
          searchedWith: searchMethod,
          analyzedWith: analyzeContent ? 'hypernym' : 'none',
          timestamp: new Date().toISOString(),
          note: searchMethod === 'mock-enhanced' ? 'Using enhanced mock data for Hypernym analysis demonstration' : undefined
        }
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 