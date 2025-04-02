import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

// Define types
export interface WeatherData {
  id: string
  city: string
  country: string
  temperature: number
  humidity: number
  conditions: string
  icon: string
  timestamp: number
}

interface WeatherState {
  cities: string[]
  data: Record<string, WeatherData>
  loading: boolean
  error: string | null
  history: Record<string, WeatherData[]>
}

// Initial state
const initialState: WeatherState = {
  cities: ["New York", "London", "Tokyo"],
  data: {},
  loading: false,
  error: null,
  history: {},
}

// Async thunk for fetching weather data
export const fetchWeatherData = createAsyncThunk(
  "weather/fetchWeatherData",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { weather: WeatherState }
      const cities = state.weather.cities

      const results: Record<string, WeatherData> = {}

      // Fetch weather data for each city
      for (const city of cities) {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`,
        )

        if (!response.ok) {
          throw new Error(`Failed to fetch weather data for ${city}`)
        }

        const data = await response.json()

        results[city] = {
          id: data.id.toString(),
          city: city,
          country: data.sys.country,
          temperature: data.main.temp,
          humidity: data.main.humidity,
          conditions: data.weather[0].main,
          icon: data.weather[0].icon,
          timestamp: Date.now(),
        }
      }

      return results
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

// Async thunk for fetching weather history
export const fetchWeatherHistory = createAsyncThunk(
  "weather/fetchWeatherHistory",
  async (city: string, { rejectWithValue }) => {
    try {
      // In a real app, you would fetch historical data from an API
      // For this example, we'll simulate it with a mock response
      const mockHistory: WeatherData[] = Array.from({ length: 7 }).map((_, i) => ({
        id: `${city}-history-${i}`,
        city,
        country: city === "New York" ? "US" : city === "London" ? "GB" : "JP",
        temperature: 20 + Math.random() * 10 - 5,
        humidity: 50 + Math.random() * 20,
        conditions: ["Clear", "Clouds", "Rain"][Math.floor(Math.random() * 3)],
        icon: ["01d", "02d", "10d"][Math.floor(Math.random() * 3)],
        timestamp: Date.now() - i * 24 * 60 * 60 * 1000, // Past days
      }))

      return { city, history: mockHistory }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  },
)

// Create slice
const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {
    addCity: (state, action: PayloadAction<string>) => {
      if (!state.cities.includes(action.payload)) {
        state.cities.push(action.payload)
      }
    },
    removeCity: (state, action: PayloadAction<string>) => {
      state.cities = state.cities.filter((city) => city !== action.payload)
      delete state.data[action.payload]
    },
    simulateWeatherAlert: (state, action: PayloadAction<{ city: string; alert: string }>) => {
      // This is just a placeholder for simulating weather alerts
      // In a real app, this would be triggered by a WebSocket or similar
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload

        // Add to history
        Object.entries(action.payload).forEach(([city, data]) => {
          if (!state.history[city]) {
            state.history[city] = []
          }

          // Keep only the last 24 entries (1 day if updated hourly)
          if (state.history[city].length >= 24) {
            state.history[city].pop()
          }

          state.history[city].unshift(data)
        })
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        const { city, history } = action.payload
        state.history[city] = history
      })
  },
})

export const { addCity, removeCity, simulateWeatherAlert } = weatherSlice.actions
export default weatherSlice.reducer

