"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import { fetchNewsData } from "@/redux/features/newsSlice"
import { setupWebSocket } from "@/redux/features/notificationSlice"
import WeatherSection from "@/components/weather/weather-section"
import CryptoSection from "@/components/crypto/crypto-section"
import NewsSection from "@/components/news/news-section"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function Dashboard() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Initial data fetch
    const fetchData = async () => {
      try {
        await dispatch(fetchWeatherData())
        await dispatch(fetchCryptoData())
        await dispatch(fetchNewsData())
      } catch (error) {
        console.error("Error fetching initial data:", error)
      }
    }
    
    fetchData()

    // Setup WebSocket connection
    dispatch(setupWebSocket())

    // Set up periodic refresh (every 60 seconds)
    const intervalId = setInterval(() => {
      fetchData()
    }, 60000)

    return () => {
      clearInterval(intervalId)
    }
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CryptoWeather Nexus Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your real-time dashboard for weather, crypto, and news updates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <WeatherSection />
          <CryptoSection />
          <NewsSection />
        </div>
      </main>
      <Footer />
    </div>
  )
}