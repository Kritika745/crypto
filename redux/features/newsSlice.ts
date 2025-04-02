import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// Define types
export interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
}

interface NewsState {
  items: NewsItem[]
  loading: boolean
  error: string | null
}

// Initial state
const initialState: NewsState = {
  items: [],
  loading: false,
  error: null,
}

// Mock news data for fallback
const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "Bitcoin Surges Past $60,000 as Institutional Adoption Grows",
    description: "Bitcoin has reached a new all-time high as major financial institutions continue to invest.",
    url: "https://example.com/news/1",
    source: "CryptoNews",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Ethereum 2.0 Upgrade: What You Need to Know",
    description: "The long-awaited Ethereum upgrade promises improved scalability and reduced energy consumption.",
    url: "https://example.com/news/2",
    source: "BlockchainReport",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Regulatory Challenges Facing Cryptocurrency Markets",
    description: "Governments worldwide are developing new frameworks to regulate digital assets.",
    url: "https://example.com/news/3",
    source: "FinTechDaily",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "NFT Market Continues to Expand Despite Crypto Volatility",
    description: "Non-fungible tokens remain popular among collectors and investors despite market fluctuations.",
    url: "https://example.com/news/4",
    source: "ArtTech",
    publishedAt: new Date().toISOString(),
  },
  {
    id: "5",
    title: "DeFi Protocols Reach $100 Billion in Total Value Locked",
    description: "Decentralized finance continues to grow as more users seek alternatives to traditional banking.",
    url: "https://example.com/news/5",
    source: "DeFiInsider",
    publishedAt: new Date().toISOString(),
  },
]

// Async thunk for fetching news data
export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async (_, { rejectWithValue }) => {
  try {
    // Using NewsData.io API
    const response = await fetch(
      `https://newsdata.io/api/1/news?apikey=${process.env.NEXT_PUBLIC_NEWSDATA_API_KEY}&q=cryptocurrency&language=en&size=5`,
    )

    if (!response.ok) {
      // Handle rate limiting specifically
      if (response.status === 429) {
        console.warn("NewsData API rate limit exceeded. Using fallback data.")
        return mockNews
      }
      throw new Error(`Failed to fetch news data: ${response.statusText}`)
    }

    const data = await response.json()

    // Format the data
    const newsItems: NewsItem[] = data.results.map((item: any) => ({
      id: item.article_id || item.title,
      title: item.title,
      description: item.description || "No description available",
      url: item.link,
      source: item.source_id,
      publishedAt: item.pubDate,
    }))

    return newsItems
  } catch (error) {
    console.error("Error fetching news:", error)
    // Return mock data on any error
    return mockNews
  }
})

// Create slice
const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        // Provide fallback data in case of error
        state.items = mockNews
      })
  },
})

export default newsSlice.reducer

