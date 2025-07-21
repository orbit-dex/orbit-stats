# Hypernym Semantic Categorization Integration

## Overview

This integration adds **AI-powered semantic categorization** to the Orbit analytics platform using Hypernym's advanced natural language processing capabilities.

## 🎯 What It Does

**Hypernym** analyzes crypto-related content across multiple sources and provides:

- **📊 Semantic Categories**: Automatically categorizes content into themes like DeFi, Layer 2, AI, Gaming, etc.
- **💭 Sentiment Analysis**: Real-time sentiment scoring across Twitter, news, research, and more
- **🔍 Narrative Detection**: Identifies trending narratives and their momentum
- **⚡ Real-time Processing**: Live analysis of crypto conversations and content

## 🏗️ Architecture

### Core Components

1. **HypernymService** (`app/services/hypernym.ts`)
   - Main service class handling API communication
   - Fallback analysis for offline/demo mode
   - Batch processing capabilities

2. **API Routes** (`app/api/hypernym/`)
   - `/api/hypernym/analyze` - Text analysis endpoint
   - `/api/hypernym/categorize` - Content categorization endpoint

3. **React Hook** (`hooks/useHypernym.ts`)
   - Custom hook for React components
   - State management for analysis data
   - Real-time data fetching

4. **UI Components**
   - `SemanticCategorizer` - Production-ready component
   - `HypernymDemo` - Interactive demo component

## 🚀 Quick Start

### 1. View the Demo

Navigate to: `http://localhost:3001/explore` → Click "Research" tab

You'll see the **Hypernym Demo** at the top of the page:
- Click "Run Hypernym Analysis" to see semantic categorization in action
- View real-time category confidence scores
- See sentiment analysis across different sources

### 2. Configuration

Set your Hypernym API credentials:

```bash
# .env.local
NEXT_PUBLIC_HYPERNYM_API_KEY=your_api_key_here
NEXT_PUBLIC_HYPERNYM_BASE_URL=https://api.hypernym.ai/v1
NEXT_PUBLIC_HYPERNYM_MODEL=semantic-categorizer-v1
```

### 3. Using in Your Components

```tsx
import { useHypernym } from '@/hooks/useHypernym';

function MyComponent() {
  const {
    data,
    loading,
    analyzeText,
    categorizeContent,
    getNarrativeMomentum
  } = useHypernym({
    sources: ['twitter', 'news', 'research'],
    timeframe: '24h'
  });

  // Analyze single text
  const analysis = await analyzeText("DeFi protocols are revolutionizing finance");
  
  // Categorize content
  const categorization = await categorizeContent({
    title: "New Layer 2 Protocol Launch",
    description: "Revolutionary scaling solution for Ethereum",
    tags: ["ethereum", "scaling", "layer2"]
  });

  return (
    <div>
      {data?.narratives?.map(narrative => (
        <div key={narrative.name}>
          {narrative.name}: {narrative.mindshare}% mindshare
          (Momentum: {getNarrativeMomentum(narrative.name)}%)
        </div>
      ))}
    </div>
  );
}
```

## 📊 API Reference

### Analyze Text

```typescript
POST /api/hypernym/analyze
{
  "text": "Your text to analyze",
  "type": "single" // or "batch"
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "defi",
        "name": "DeFi",
        "confidence": 0.92
      }
    ],
    "sentiment": {
      "score": 0.65,
      "label": "positive",
      "confidence": 0.88
    },
    "entities": [...],
    "keywords": [...]
  }
}
```

### Categorize Content

```typescript
POST /api/hypernym/categorize
{
  "content": {
    "title": "Article title",
    "description": "Article content",
    "tags": ["tag1", "tag2"]
  }
}
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "primaryCategory": "DeFi",
    "narratives": ["DeFi", "Layer 2"],
    "confidence": 0.89,
    "themes": ["yield", "liquidity", "ethereum"]
  }
}
```

### Get Real-time Data

```typescript
GET /api/hypernym/categorize?sources=twitter,news&timeframe=24h
```

**Response:**
```typescript
{
  "success": true,
  "data": {
    "narratives": [
      {
        "name": "DeFi",
        "mindshare": 12.8,
        "momentum": 3.4
      }
    ],
    "categories": [
      {
        "name": "DeFi",
        "mentions": 1247,
        "change": 12.3
      }
    ],
    "sentiment": [
      {
        "source": "twitter",
        "score": 0.65,
        "trend": 0.12
      }
    ]
  }
}
```

## 🎨 UI Components

### HypernymDemo (Current)

Interactive demo showing semantic analysis capabilities:
- Real-time category detection
- Sentiment analysis visualization  
- Momentum tracking
- Confidence scoring

### SemanticCategorizer (Production)

Full-featured component for production use:
- Category selection
- Narrative filtering
- Real-time updates
- Source filtering

## 🔧 Customization

### Adding New Categories

Edit `app/services/hypernym.ts`:

```typescript
private getDefaultCategories(): HypernymCategory[] {
  return [
    { id: 'defi', name: 'DeFi', confidence: 1.0 },
    { id: 'layer2', name: 'Layer 2', confidence: 1.0 },
    { id: 'your_category', name: 'Your Category', confidence: 1.0 }, // Add here
  ];
}
```

### Custom Fallback Analysis

Modify `basicCategorization()` method to add custom keyword matching:

```typescript
const categoryMap = {
  'your_category': ['keyword1', 'keyword2', 'keyword3'],
  // ... existing categories
};
```

## 🌟 Key Features

- **✨ Real-time Analysis**: Live processing of crypto content
- **🎯 High Accuracy**: Advanced AI categorization with confidence scores
- **📱 Mobile-Responsive**: Works seamlessly across all devices
- **⚡ Fast Performance**: Optimized API calls and caching
- **🔄 Fallback Mode**: Works offline with local categorization
- **📊 Rich Visualizations**: Beautiful charts and progress indicators
- **🎛️ Customizable**: Easy to configure and extend

## 🚦 Next Steps

1. **Get Hypernym API Key**: Sign up at [hypernym.ai](https://hypernym.ai)
2. **Configure Environment**: Add your API credentials to `.env.local`
3. **Enable Production Mode**: Replace `HypernymDemo` with `SemanticCategorizer`
4. **Customize Categories**: Add your own semantic categories
5. **Integrate Everywhere**: Use the `useHypernym` hook in other components

## 📝 Notes

- Demo mode works without API key using mock data
- Production mode requires valid Hypernym API credentials
- Categories are customizable and extensible
- Real-time updates require WebSocket connection (coming soon)

---

**🎉 Hypernym integration is now live at `/explore`!** 

Navigate to the Research tab to see AI-powered semantic categorization in action. 