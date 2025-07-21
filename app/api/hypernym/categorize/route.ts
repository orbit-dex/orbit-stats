import { NextRequest, NextResponse } from 'next/server';
import { hypernymService } from '@/app/services/hypernym';

interface ContentInput {
  title?: string;
  description?: string;
  tags?: string[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, contents, type = 'single' } = body;

    if (!content && !contents) {
      return NextResponse.json(
        { error: 'Content object or contents array is required' },
        { status: 400 }
      );
    }

    // Validate content structure
    const validateContent = (item: ContentInput) => {
      if (!item.title && !item.description) {
        throw new Error('Content must have at least title or description');
      }
      return {
        title: item.title || '',
        description: item.description || '',
        tags: item.tags || [],
      };
    };

    let result;

    if (type === 'batch' && contents) {
      const validatedContents = (contents as ContentInput[]).map(validateContent);
      const categorizations = await Promise.all(
        validatedContents.map((item: { title: string; description: string; tags: string[] }) => 
          hypernymService.categorizeNarrative(item)
        )
      );
      
      result = categorizations.map((categorization, index) => ({
        ...categorization,
        originalContent: validatedContents[index],
      }));
    } else if (content) {
      const validatedContent = validateContent(content as ContentInput);
      const categorization = await hypernymService.categorizeNarrative(validatedContent);
      
      result = {
        ...categorization,
        originalContent: validatedContent,
      };
    } else {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Hypernym categorization API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to categorize content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get trending narratives and categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const sources = searchParams.get('sources')?.split(',') as any[] || ['twitter', 'news', 'research'];

    // Get real-time narrative and category data
    const realtimeData = await hypernymService.trackRealtimeData(sources);
    
    // Get category hierarchy for context
    const categories = await hypernymService.getCategoryHierarchy();

    return NextResponse.json({
      success: true,
      data: {
        narratives: realtimeData.narratives,
        categories: realtimeData.categories,
        sentiment: realtimeData.sentiment,
        categoryHierarchy: categories,
        timeframe,
        sources,
      },
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Hypernym trending data API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trending data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 