"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import CryptoCard from "./crypto-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Bitcoin } from "lucide-react"

export default function CryptoSection() {
  const { data, loading, error } = useSelector((state: RootState) => state.crypto)
  const coins = useSelector((state: RootState) => state.crypto.coins)

  return (
    <Card className="col-span-1 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 dark:border dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-6">
        <div className="flex items-center">
          <Bitcoin className="h-6 w-6 mr-2" />
          <CardTitle className="text-xl">Cryptocurrency</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {loading && coins.map((coin) => <Skeleton key={coin} className="h-[120px] w-full rounded-md" />)}

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            Error loading cryptocurrency data: {error}
          </div>
        )}

        {!loading && !error && Object.values(data).length === 0 && (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            No cryptocurrency data available.
          </div>
        )}

        {!loading && Object.values(data).map((coinData) => <CryptoCard key={coinData.id} data={coinData} />)}
      </CardContent>
    </Card>
  )
}

