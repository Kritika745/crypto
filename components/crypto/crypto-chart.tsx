"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface ChartDataPoint {
  timestamp: number
  price: number
}

interface CryptoChartProps {
  data: ChartDataPoint[]
}

export default function CryptoChart({ data }: CryptoChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, chartRef.current.width, chartRef.current.height)

    // Sort data by timestamp
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp)

    // Extract prices and dates
    const prices = sortedData.map((item) => item.price)
    const dates = sortedData.map((item) => new Date(item.timestamp).toLocaleDateString())

    // Calculate chart dimensions
    const width = chartRef.current.width
    const height = chartRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Calculate scales
    const maxPrice = Math.max(...prices) * 1.05
    const minPrice = Math.min(...prices) * 0.95
    const priceRange = maxPrice - minPrice

    // Set colors based on theme
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const lineColor = "#10b981"

    // Draw grid
    ctx.strokeStyle = gridColor
    ctx.lineWidth = 0.5

    // Draw horizontal grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i
      ctx.beginPath()
      ctx.moveTo(padding, y)
      ctx.lineTo(width - padding, y)
      ctx.stroke()

      // Draw price labels
      const price = maxPrice - (priceRange / 5) * i
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`$${price.toFixed(2)}`, padding - 10, y + 4)
    }

    // Draw line chart
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.beginPath()

    sortedData.forEach((item, index) => {
      const x = padding + (chartWidth / (sortedData.length - 1)) * index
      const y = padding + chartHeight - ((item.price - minPrice) / priceRange) * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Draw points
      ctx.fillStyle = lineColor
      ctx.beginPath()
      ctx.arc(x, y, 4, 0, Math.PI * 2)
      ctx.fill()

      // Draw date labels for every other point to avoid crowding
      if (index % 2 === 0) {
        ctx.fillStyle = textColor
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(dates[index], x, height - 10)
      }
    })

    ctx.stroke()

    // Fill area under the line
    ctx.lineTo(padding + chartWidth, padding + chartHeight)
    ctx.lineTo(padding, padding + chartHeight)
    ctx.closePath()
    ctx.fillStyle = `${lineColor}20`
    ctx.fill()
  }, [data, theme])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} width={800} height={300} className="w-full h-full" />
    </div>
  )
}

