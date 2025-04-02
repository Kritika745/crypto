"use client"

import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}

