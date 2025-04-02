import type { NewsItem as NewsItemType } from "@/redux/features/newsSlice"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

interface NewsItemProps {
  item: NewsItemType
}

export default function NewsItem({ item }: NewsItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <Card className="hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-white dark:bg-gray-800 p-4">
            <div className="flex justify-between gap-2">
              <div>
                <h3 className="font-medium line-clamp-2 text-gray-800 dark:text-gray-200">{item.title}</h3>
                <div className="mt-2 text-xs flex items-center gap-2">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-0.5 rounded-full">
                    {item.source}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400">{formatDate(item.publishedAt)}</span>
                </div>
              </div>
              <ExternalLink className="h-4 w-4 flex-shrink-0 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  )
}

