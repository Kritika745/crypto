import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Define types
export interface CryptoData {
  id: string
  symbol: string
  name: string
  price: number
  priceChange24h: number
  marketCap: number
  lastUpdated: number
}

interface CryptoState {
  coins: string[]
  data: Record<string, CryptoData>
  loading: boolean
  error: string | null
  history: Record<string, { timestamp: number; price: number }[]>
}

// Initial state
const initialState: CryptoState = {
  coins: ["bitcoin", "ethereum", "solana"],
  data: {},
  loading: false,
  error: null,
  history: {},
}

// Async thunk for fetching crypto data
export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async (_, { getState, rejectWithValue }) => {
  try {
    const state = getState() as { crypto: CryptoState }
    const coins = state.crypto.coins

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(",")}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`,
    )

    if (!response.ok) {
      throw new Error("Failed to fetch cryptocurrency data")
    }

    const data = await response.json()

    const results: Record<string, CryptoData> = {}

    data.forEach((coin: any) => {
      results[coin.id] = {
        id: coin.id,
        symbol: coin.symbol,
        name: coin.name,
        price: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h,
        marketCap: coin.market_cap,
        lastUpdated: Date.now(),
      }
    })

    return results
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

// Async thunk for fetching crypto history
export const fetchCryptoHistory = createAsyncThunk(
  "crypto/fetchCryptoHistory",
  async (coinId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7&interval=daily`,
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch history for ${coinId}`)
      }

      const data = await response.json()

      // Format the data
      const history = data.prices.map((item: [number, number]) => ({
        timestamp: item[0],
        price: item[1],
      }))

      return { coinId, history }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

// Create slice
const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    addCoin: (state, action: PayloadAction<string>) => {
      if (!state.coins.includes(action.payload)) {
        state.coins.push(action.payload)
      }
    },
    removeCoin: (state, action: PayloadAction<string>) => {
      state.coins = state.coins.filter((coin) => coin !== action.payload)
      delete state.data[action.payload]
    },
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload

      if (state.data[id]) {
        const oldPrice = state.data[id].price
        state.data[id].price = price

        // Calculate price change since last update
        const priceChange = ((price - oldPrice) / oldPrice) * 100

        // Update last updated timestamp
        state.data[id].lastUpdated = Date.now()

        // Add to history
        if (!state.history[id]) {
          state.history[id] = []
        }

        state.history[id].push({
          timestamp: Date.now(),
          price,
        })

        // Keep only the last 100 price points
        if (state.history[id].length > 100) {
          state.history[id].shift()
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        const { coinId, history } = action.payload
        state.history[coinId] = history
      })
  },
})

export const { addCoin, removeCoin, updateCryptoPrice } = cryptoSlice.actions
export default cryptoSlice.reducer

