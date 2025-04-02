"use client"

import type React from "react"

import { useDispatch, useSelector } from "react-redux"
import type { CryptoData } from "@/redux/features/cryptoSlice"
import type { RootState } from "@/redux/store"
import { toggleFavoriteCoin } from "@/redux/features/preferencesSlice"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Star } from "lucide-react"
import Link from "next/link"

interface CryptoCardProps {
  data: CryptoData
}

export default function CryptoCard({ data }: CryptoCardProps) {
  const dispatch = useDispatch()
  const favoriteCryptoCoins = useSelector((state: RootState) => state.preferences.favoriteCryptoCoins)
  const isFavorite = favoriteCryptoCoins.includes(data.id)

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dispatch(toggleFavoriteCoin(data.id))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toFixed(2)}`
    }
  }

  // Function to get coin-specific colors
  const getCoinColors = (id: string) => {
    switch (id) {
      case "bitcoin":
        return "from-orange-500 to-yellow-500"
      case "ethereum":
        return "from-blue-500 to-indigo-500"
      case "solana":
        return "from-purple-500 to-pink-500"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

  return (
    <Link href={`/crypto/${data.id}`}>
      <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className={`bg-gradient-to-r ${getCoinColors(data.id)} text-white p-4`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{data.name}</h3>
                  <span className="text-xs bg-white/30 px-2 py-0.5 rounded-full">{data.symbol.toUpperCase()}</span>
                </div>
                <div className="mt-2">
                  <div className="text-3xl font-bold">{formatPrice(data.price)}</div>
                  <div className="text-sm opacity-80">Market Cap: {formatMarketCap(data.marketCap)}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <button onClick={handleToggleFavorite} className="text-white hover:text-yellow-300 transition-colors">
                  <Star className={`h-5 w-5 ${isFavorite ? "fill-yellow-300 text-yellow-300" : ""}`} />
                </button>
                <div
                  className={`flex items-center mt-2 px-2 py-1 rounded-full ${
                    data.priceChange24h >= 0 ? "bg-green-500/30" : "bg-red-500/30"
                  }`}
                >
                  {data.priceChange24h >= 0 ? (
                    <ArrowUp className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDown className="h-4 w-4 mr-1" />
                  )}
                  <span className="text-sm font-medium">{Math.abs(data.priceChange24h).toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            Last updated: {new Date(data.lastUpdated).toLocaleTimeString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

