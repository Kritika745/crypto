"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import WeatherCard from "@/components/weather/weather-card"
import CryptoCard from "@/components/crypto/crypto-card"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

export default function FavoritesPage() {
  const favoriteWeatherCities = useSelector((state: RootState) => state.preferences.favoriteWeatherCities)
  const favoriteCryptoCoins = useSelector((state: RootState) => state.preferences.favoriteCryptoCoins)
  const weatherData = useSelector((state: RootState) => state.weather.data)
  const cryptoData = useSelector((state: RootState) => state.crypto.data)

  const favoriteWeather = Object.values(weatherData).filter((city) => favoriteWeatherCities.includes(city.city))
  const favoriteCrypto = Object.values(cryptoData).filter((coin) => favoriteCryptoCoins.includes(coin.id))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent flex items-center justify-center">
            <Heart className="h-8 w-8 mr-3 text-pink-500" />
            Your Favorites
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Quick access to your favorite cities and cryptocurrencies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border dark:border-gray-800">
            <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-6">
              <CardTitle className="text-xl">Favorite Cities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {favoriteWeather.length === 0 ? (
                <div className="p-6 text-center bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">
                    You haven&apos;t added any favorite cities yet.
                  </div>
                  <div className="mt-4">
                    <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                      Go to the dashboard to add favorites
                    </Link>
                  </div>
                </div>
              ) : (
                favoriteWeather.map((city) => <WeatherCard key={city.id} data={city} />)
              )}
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border dark:border-gray-800">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6">
              <CardTitle className="text-xl">Favorite Cryptocurrencies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              {favoriteCrypto.length === 0 ? (
                <div className="p-6 text-center bg-white dark:bg-gray-800 rounded-lg">
                  <div className="text-gray-500 dark:text-gray-400">
                    You haven&apos;t added any favorite cryptocurrencies yet.
                  </div>
                  <div className="mt-4">
                    <Link href="/" className="text-purple-600 dark:text-purple-400 hover:underline font-medium">
                      Go to the dashboard to add favorites
                    </Link>
                  </div>
                </div>
              ) : (
                favoriteCrypto.map((coin) => <CryptoCard key={coin.id} data={coin} />)
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

