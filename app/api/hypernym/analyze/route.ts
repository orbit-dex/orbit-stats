import { NextRequest, NextResponse } from 'next/server';
import { hypernymService } from '@/app/services/hypernym';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, texts, type = 'single' } = body;

    if (!text && !texts) {
      return NextResponse.json(
        { error: 'Text or texts array is required' },
        { status: 400 }
      );
    }

    let result;

    if (type === 'batch' && texts) {
      result = await hypernymService.analyzeBatch(texts);
    } else if (text) {
      result = await hypernymService.analyzeText(text);
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
    console.error('Hypernym analysis API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze content',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'categories') {
      const categories = await hypernymService.getCategoryHierarchy();
      return NextResponse.json({
        success: true,
        data: categories,
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'realtime') {
      const sources = searchParams.get('sources')?.split(',') as any[] || ['twitter', 'news', 'research'];
      const realtimeData = await hypernymService.trackRealtimeData(sources);
      return NextResponse.json({
        success: true,
        data: realtimeData,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action parameter' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Hypernym GET API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 