"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "../mode-toggle"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"
import NotificationDropdown from "../notifications/notification-dropdown"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          CryptoWeather Nexus
        </Link>
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === "/" ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/favorites"
            className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === "/favorites" ? "text-blue-600 dark:text-blue-400 font-medium" : "text-gray-700 dark:text-gray-300"}`}
          >
            Favorites
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] flex items-center justify-center text-white">
                  {unreadCount}
                </span>
              )}
            </Button>
            {showNotifications && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
          </div>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

