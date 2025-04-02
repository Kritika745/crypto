"use client"

import type React from "react"
import Image from "next/image"
import { useDispatch, useSelector } from "react-redux"
import type { WeatherData } from "@/redux/features/weatherSlice"
import type { RootState } from "@/redux/store"
import { toggleFavoriteCity } from "@/redux/features/preferencesSlice"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Link from "next/link"

interface WeatherCardProps {
  data: WeatherData
}

export default function WeatherCard({ data }: WeatherCardProps) {
  const dispatch = useDispatch()
  const favoriteWeatherCities = useSelector((state: RootState) => state.preferences.favoriteWeatherCities)
  const isFavorite = favoriteWeatherCities.includes(data.city)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavoriteCity(data.city))
  }

  // Function to determine background color based on temperature
  const getTemperatureColor = (temp: number) => {
    if (temp >= 30) return "from-red-400 to-orange-300"
    if (temp >= 20) return "from-orange-400 to-yellow-300"
    if (temp >= 10) return "from-yellow-400 to-green-300"
    if (temp >= 0) return "from-blue-400 to-cyan-300"
    return "from-blue-500 to-indigo-400"
  }

  return (
    <Link href={`/weather/${encodeURIComponent(data.city)}`}>
      <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${getTemperatureColor(data.temperature)} text-white p-4`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{data.city}</h3>
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">{data.country}</span>
                </div>
                <div className="mt-2 flex items-center gap-4">
                  <div className="text-3xl font-bold">{Math.round(data.temperature)}°C</div>
                  <div className="text-sm">
                    <div className="font-medium">{data.conditions}</div>
                    <div className="opacity-80">Humidity: {data.humidity}%</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button onClick={handleToggleFavorite} className="text-white hover:text-yellow-300 transition-colors">
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-300 text-yellow-300" : ""}`} />
                </button>
                <div className="w-12 h-12 flex items-center justify-center">
                  {data.icon && (
                    <Image
                      src={`https://openweathermap.org/img/wn/${data.icon}@2x.png`}
                      alt={data.conditions}
                      width={50}
                      height={50}
                      className="drop-shadow-md"
                      unoptimized // Add this because it's an external image
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            Last updated: {new Date(data.timestamp).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

