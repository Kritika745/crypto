"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { fetchCryptoHistory } from "@/redux/features/cryptoSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowLeft, ArrowUp, Bitcoin, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import CryptoChart from "@/components/crypto/crypto-chart"

interface CryptoDetailProps {
  coinId: string
}

export default function CryptoDetail({ coinId }: CryptoDetailProps) {
  const dispatch = useDispatch()
  const cryptoData = useSelector((state: RootState) => state.crypto.data[coinId])
  const cryptoHistory = useSelector((state: RootState) => state.crypto.history[coinId] || [])
  const loading = useSelector((state: RootState) => state.crypto.loading)

  useEffect(() => {
    if (coinId) {
      dispatch(fetchCryptoHistory(coinId))
    }
  }, [coinId, dispatch])

  if (!cryptoData && !loading) {
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
            <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Cryptocurrency Not Found</h1>
            <p className="text-gray-600 dark:text-gray-400">The data for {coinId} could not be found.</p>
          </div>
        </div>
      </div>
    )
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
            <div
              className={`bg-gradient-to-r ${getCoinColors(cryptoData.id)} text-white p-6 rounded-lg shadow-lg mb-6`}
            >
              <h1 className="text-3xl font-bold flex items-center">
                <Bitcoin className="mr-3 h-8 w-8" />
                {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
              </h1>
              <p className="mt-2 opacity-90">Current price and market information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${getCoinColors(cryptoData.id)} text-white pb-2`}>
                  <CardTitle className="text-base flex items-center">
                    <DollarSign className="mr-2 h-5 w-5" />
                    Current Price
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-white dark:bg-gray-800">
                  <div className="text-4xl font-bold">{formatPrice(cryptoData.price)}</div>
                  <div
                    className={`flex items-center mt-2 text-sm px-2 py-1 rounded-full w-fit ${
                      cryptoData.priceChange24h >= 0
                        ? "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30"
                        : "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30"
                    }`}
                  >
                    {cryptoData.priceChange24h >= 0 ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span>{Math.abs(cryptoData.priceChange24h).toFixed(2)}% (24h)</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${getCoinColors(cryptoData.id)} text-white pb-2`}>
                  <CardTitle className="text-base flex items-center">
                    <TrendingUp className="mr-2 h-5 w-5" />
                    Market Cap
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-white dark:bg-gray-800">
                  <div className="text-3xl font-bold">{formatMarketCap(cryptoData.marketCap)}</div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className={`bg-gradient-to-r ${getCoinColors(cryptoData.id)} text-white pb-2`}>
                  <CardTitle className="text-base">Last Updated</CardTitle>
                </CardHeader>
                <CardContent className="p-4 bg-white dark:bg-gray-800">
                  <div className="text-lg font-medium">{new Date(cryptoData.lastUpdated).toLocaleTimeString()}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {new Date(cryptoData.lastUpdated).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-0 shadow-lg overflow-hidden">
              <CardHeader className={`bg-gradient-to-r ${getCoinColors(cryptoData.id)} text-white`}>
                <CardTitle>Price History (7 Days)</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-white dark:bg-gray-800">
                {cryptoHistory.length > 0 ? (
                  <CryptoChart data={cryptoHistory} />
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

