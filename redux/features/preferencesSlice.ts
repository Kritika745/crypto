import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

// Define types
interface Preferences {
  favoriteWeatherCities: string[]
  favoriteCryptoCoins: string[]
  theme: "light" | "dark" | "system"
}

// Initial state
const initialState: Preferences = {
  favoriteWeatherCities: [],
  favoriteCryptoCoins: [],
  theme: "system",
}

// Create slice
const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    toggleFavoriteCity: (state, action: PayloadAction<string>) => {
      const city = action.payload
      if (state.favoriteWeatherCities.includes(city)) {
        state.favoriteWeatherCities = state.favoriteWeatherCities.filter((c) => c !== city)
      } else {
        state.favoriteWeatherCities.push(city)
      }
    },
    toggleFavoriteCoin: (state, action: PayloadAction<string>) => {
      const coin = action.payload
      if (state.favoriteCryptoCoins.includes(coin)) {
        state.favoriteCryptoCoins = state.favoriteCryptoCoins.filter((c) => c !== coin)
      } else {
        state.favoriteCryptoCoins.push(coin)
      }
    },
    setTheme: (state, action: PayloadAction<"light" | "dark" | "system">) => {
      state.theme = action.payload
    },
  },
})

export const { toggleFavoriteCity, toggleFavoriteCoin, setTheme } = preferencesSlice.actions
export default preferencesSlice.reducer

