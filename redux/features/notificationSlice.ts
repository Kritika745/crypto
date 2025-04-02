import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { updateCryptoPrice } from "./cryptoSlice"
import type { AppDispatch } from "../store"

// Define types
export interface Notification {
  id: string
  type: "price_alert" | "weather_alert"
  title: string
  message: string
  timestamp: number
  read: boolean
}

interface NotificationState {
  items: Notification[]
  webSocketConnected: boolean
}

// Initial state
const initialState: NotificationState = {
  items: [],
  webSocketConnected: false,
}

// Async thunk for setting up WebSocket
export const setupWebSocket = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  "notifications/setupWebSocket",
  async (_, { dispatch }) => {
    // Connect to CoinCap WebSocket for real-time price updates
    const ws = new WebSocket("wss://ws.coincap.io/prices?assets=bitcoin,ethereum")

    ws.onopen = () => {
      dispatch(setWebSocketConnected(true))
      console.log("WebSocket connected")
    }

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        // Update crypto prices in the store
        Object.entries(data).forEach(([coin, price]) => {
          const coinId = coin === "bitcoin" ? "bitcoin" : coin === "ethereum" ? "ethereum" : coin
          dispatch(updateCryptoPrice({ id: coinId, price: Number.parseFloat(price as string) }))

          // Check for significant price changes (e.g., more than 1%)
          // In a real app, you would compare with the previous price
          if (Math.random() < 0.1) {
            // Simulate occasional alerts for demo purposes
            const priceChange = Math.random() > 0.5 ? "increased" : "decreased"
            const changePercent = (Math.random() * 5).toFixed(2)

            dispatch(
              addNotification({
                type: "price_alert",
                title: `${coin.toUpperCase()} Price Alert`,
                message: `${coin.toUpperCase()} has ${priceChange} by ${changePercent}% in the last hour. Current price: $${Number.parseFloat(price as string).toFixed(2)}`,
              }),
            )
          }
        })
      } catch (error) {
        console.error("Error processing WebSocket message:", error)
      }
    }

    ws.onclose = () => {
      dispatch(setWebSocketConnected(false))
      console.log("WebSocket disconnected")

      // Attempt to reconnect after a delay
      setTimeout(() => {
        dispatch(setupWebSocket())
      }, 5000)
    }

    // Simulate weather alerts
    const simulateWeatherAlerts = () => {
      const cities = ["New York", "London", "Tokyo"]
      const alertTypes = [
        "Heavy Rain Warning",
        "High Temperature Alert",
        "Storm Warning",
        "Air Quality Alert",
        "Flood Warning",
      ]

      const randomCity = cities[Math.floor(Math.random() * cities.length)]
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]

      dispatch(
        addNotification({
          type: "weather_alert",
          title: `Weather Alert: ${randomCity}`,
          message: `${randomAlert} for ${randomCity}. Take necessary precautions.`,
        }),
      )

      // Schedule next alert
      setTimeout(simulateWeatherAlerts, Math.random() * 60000 + 30000) // Between 30s and 90s
    }

    // Start simulating weather alerts
    setTimeout(simulateWeatherAlerts, 10000) // First alert after 10s
  },
)

// Create slice
const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setWebSocketConnected: (state, action: PayloadAction<boolean>) => {
      state.webSocketConnected = action.payload
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>) => {
      const { type, title, message } = action.payload

      state.items.unshift({
        id: Date.now().toString(),
        type,
        title,
        message,
        timestamp: Date.now(),
        read: false,
      })
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.read = true
      }
    },
    clearNotifications: (state) => {
      state.items = []
    },
  },
})

export const { setWebSocketConnected, addNotification, markNotificationAsRead, clearNotifications } =
  notificationSlice.actions
export default notificationSlice.reducer

