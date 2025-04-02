"use client"

import { useEffect, useRef } from "react"
import type { WeatherData } from "@/redux/features/weatherSlice"
import { useTheme } from "next-themes"

interface WeatherChartProps {
  data: WeatherData[]
}

export default function WeatherChart({ data }: WeatherChartProps) {
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

    // Extract temperatures and dates
    const temperatures = sortedData.map((item) => item.temperature)
    const dates = sortedData.map((item) => new Date(item.timestamp).toLocaleDateString())

    // Calculate chart dimensions
    const width = chartRef.current.width
    const height = chartRef.current.height
    const padding = 40
    const chartWidth = width - padding * 2
    const chartHeight = height - padding * 2

    // Calculate scales
    const maxTemp = Math.max(...temperatures) + 5
    const minTemp = Math.min(...temperatures) - 5
    const tempRange = maxTemp - minTemp

    // Set colors based on theme
    const textColor = theme === "dark" ? "#e5e7eb" : "#374151"
    const gridColor = theme === "dark" ? "#374151" : "#e5e7eb"
    const lineColor = "#3b82f6"

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

      // Draw temperature labels
      const temp = maxTemp - (tempRange / 5) * i
      ctx.fillStyle = textColor
      ctx.font = "12px sans-serif"
      ctx.textAlign = "right"
      ctx.fillText(`${temp.toFixed(1)}°C`, padding - 10, y + 4)
    }

    // Draw line chart
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 2
    ctx.beginPath()

    sortedData.forEach((item, index) => {
      const x = padding + (chartWidth / (sortedData.length - 1)) * index
      const y = padding + chartHeight - ((item.temperature - minTemp) / tempRange) * chartHeight

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
  }, [data, theme])

  return (
    <div className="w-full h-[300px]">
      <canvas ref={chartRef} width={800} height={300} className="w-full h-full" />
    </div>
  )
}

