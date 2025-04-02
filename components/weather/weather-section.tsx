"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import WeatherCard from "./weather-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CloudSun } from "lucide-react"

export default function WeatherSection() {
  const { data, loading, error } = useSelector((state: RootState) => state.weather)
  const cities = useSelector((state: RootState) => state.weather.cities)

  return (
    <Card className="col-span-1 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 dark:border dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-6">
        <div className="flex items-center">
          <CloudSun className="h-6 w-6 mr-2" />
          <CardTitle className="text-xl">Weather Updates</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {loading && cities.map((city) => <Skeleton key={city} className="h-[120px] w-full rounded-md" />)}

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            Error loading weather data: {error}
          </div>
        )}

        {!loading && !error && Object.values(data).length === 0 && (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            No weather data available.
          </div>
        )}

        {!loading && Object.values(data).map((cityData) => <WeatherCard key={cityData.id} data={cityData} />)}
      </CardContent>
    </Card>
  )
}

