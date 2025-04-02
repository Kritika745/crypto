export default function Footer() {
    return (
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CryptoWeather Nexus
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your real-time dashboard for weather, cryptocurrency, and news updates
          </p>
          <div className="flex justify-center space-x-6 mb-4">
            <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              Twitter
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              GitHub
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-blue-400">
              Discord
            </a>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-500">
            © {new Date().getFullYear()} CryptoWeather Nexus. All rights reserved.
          </p>
        </div>
      </footer>
    )
  }
  
  