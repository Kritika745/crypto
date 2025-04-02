"use client"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import { markNotificationAsRead, clearNotifications } from "@/redux/features/notificationSlice"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Droplets, Trash2 } from "lucide-react"
import { useEffect, useRef } from "react"

interface NotificationDropdownProps {
  onClose: () => void
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  const handleMarkAsRead = (id: string) => {
    dispatch(markNotificationAsRead(id))
  }

  const handleClearAll = () => {
    dispatch(clearNotifications())
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
    }).format(date)
  }

  return (
    <Card
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 z-50 shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <CardTitle className="text-base">Notifications</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[300px] overflow-y-auto p-0">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800">
            No notifications
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 text-sm border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                  notification.read ? "opacity-70" : ""
                }`}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  {notification.type === "weather_alert" ? (
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full">
                      <Droplets className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    </div>
                  ) : (
                    <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded-full">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">{notification.title}</div>
                    <div className="mt-1 text-gray-600 dark:text-gray-400">{notification.message}</div>
                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                      {formatTime(notification.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearAll}
          className="w-full text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear all
        </Button>
      </CardFooter>
    </Card>
  )
}

