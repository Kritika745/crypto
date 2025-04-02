"use client"

import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import NewsItem from "./news-item"
import { Newspaper } from "lucide-react"

export default function NewsSection() {
  const { items, loading, error } = useSelector((state: RootState) => state.news)

  return (
    <Card className="col-span-1 overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 dark:border dark:border-gray-800">
      <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-6">
        <div className="flex items-center">
          <Newspaper className="h-6 w-6 mr-2" />
          <CardTitle className="text-xl">Crypto News</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-5">
        {loading &&
          Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-[80px] w-full rounded-md" />)}

        {error && (
          <div className="p-4 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            Error loading news data: {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="p-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-md">
            No news available.
          </div>
        )}

        {!loading && items.map((item) => <NewsItem key={item.id} item={item} />)}
      </CardContent>
    </Card>
  )
}

