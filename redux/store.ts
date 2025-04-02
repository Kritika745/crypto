import { configureStore } from "@reduxjs/toolkit"
import weatherReducer from "@/redux/features/weatherSlice"
import cryptoReducer from "@/redux/features/cryptoSlice"
import newsReducer from "@/redux/features/newsSlice"
import notificationReducer from "@/redux/features/notificationSlice"
import preferencesReducer from '@/redux/features/preferencesSlice'
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    crypto: cryptoReducer,
    news: newsReducer,
    notifications: notificationReducer,
    preferences: preferencesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

