"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { fetchWeatherHistory } from "@/redux/features/weatherSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, CloudSun, Droplets, Thermometer } from "lucide-react"
import Link from "next/link"
import WeatherChart from "@/components/weather/weather-chart"

// Fix the type definition for params
interface PageProps {
  params: {
    city: string
  }
}

export default function CityPage({ params }: PageProps) {
  const dispatch = useDispatch()
  const city = decodeURIComponent(params.city)
  const weatherData = useSelector((state: RootState) => state.weather.data[city])
  const weatherHistory = useSelector((state: RootState) => state.weather.history[city] || [])
  const loading = useSelector((state: RootState) => state.weather.loading)

  useEffect(() => {
    if (city) {
      dispatch(fetchWeatherHistory(city))
    }
  }, [city, dispatch])

  if (!weatherData && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Link
          href="/"
          className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 pt-4 px-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="container mx-auto px-4 py-8">
          <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">City Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">The weather data for {city} could not be found.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Link
        href="/"
        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 mb-4 pt-4 px-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="container mx-auto px-4 py-4">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-[300px] w-full" />
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-6 rounded-lg shadow-lg mb-6">
              <h1 className="text-3xl font-bold flex items-center">
                <CloudSun className="mr-3 h-8 w-8" />
                {city} Weather
              </h1>
              <p className="mt-2 opacity-90">Current weather conditions and forecast</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center text-blue-700 dark:text-blue-400">
                    <Thermometer className="mr-2 h-5 w-5" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-300">
                    {Math.round(weatherData.temperature)}°C
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{weatherData.conditions}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20 dark:border dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center text-teal-700 dark:text-teal-400">
                    <Droplets className="mr-2 h-5 w-5" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-teal-600 dark:text-teal-300">{weatherData.humidity}%</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border dark:border-gray-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center text-purple-700 dark:text-purple-400">
                    Last Updated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-lg font-medium text-purple-600 dark:text-purple-300">
                    {new Date(weatherData.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(weatherData.timestamp).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                <CardTitle>Temperature History (7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                {weatherHistory.length > 0 ? (
                  <WeatherChart data={weatherHistory} />
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Loading historical data...
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}

