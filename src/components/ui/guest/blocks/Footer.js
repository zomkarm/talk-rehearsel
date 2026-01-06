export default function Footer() {
  return (
    <footer className="relative w-screen bottom-0 mt-16 bg-gray-800 text-gray-200 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between text-sm sans">
        
        {/* Left: Brand */}
        <div className="text-center md:text-left">
          <p className="font-semibold text-blue-400">TalkRehearsel</p>
          <p className="text-xs text-gray-400 mt-1">
            A workspace for clarity, autonomy, and purpose.
          </p>
        </div>

        {/* Middle: Nav */}
        <nav className="flex gap-6 mt-6 md:mt-0">
          <a href="/about" className="text-gray-300 hover:text-blue-400 transition">About</a>
          <a href="/pricing" className="text-gray-300 hover:text-blue-400 transition">Pricing</a>
          <a href="/contact" className="text-gray-300 hover:text-blue-400 transition">Contact Us</a>
          <a href="/help" className="text-gray-300 hover:text-blue-400 transition">Help</a>
        </nav>

        {/* Right: Social */}
        <div className="flex gap-4 mt-6 md:mt-0">
          <a
            href="#"
            aria-label="Twitter"
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.633 7.997c.013.18.013.361.013.541 0 5.51-4.192 11.86-11.86 11.86-2.356 0-4.547-.69-6.391-1.878.33.04.648.053.991.053a8.39 8.39 0 0 0 5.2-1.79 4.186 4.186 0 0 1-3.906-2.9c.26.04.52.066.793.066.378 0 .756-.053 1.107-.146a4.178 4.178 0 0 1-3.352-4.106v-.053c.56.31 1.2.5 1.884.527a4.173 4.173 0 0 1-1.862-3.475c0-.767.204-1.458.56-2.066a11.86 11.86 0 0 0 8.607 4.367c-.066-.31-.106-.634-.106-.96 0-2.35 1.905-4.255 4.255-4.255 1.225 0 2.332.514 3.11 1.338a8.387 8.387 0 0 0 2.672-1.02 4.23 4.23 0 0 1-1.84 2.35 8.43 8.43 0 0 0 2.428-.648 8.979 8.979 0 0 1-2.092 2.17z" />
            </svg>
          </a>
          <a
            href="#"
            aria-label="GitHub"
            className="text-gray-400 hover:text-blue-400 transition"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.16.08 1.77 1.2 1.77 1.2 1.04 1.77 2.73 1.26 3.4.97.1-.75.41-1.26.74-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.28 1.2-3.09-.12-.3-.52-1.54.11-3.21 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.67.23 2.91.12 3.21.75.81 1.2 1.83 1.2 3.09 0 4.43-2.69 5.39-5.26 5.67.42.36.79 1.09.79 2.21 0 1.6-.01 2.89-.01 3.28 0 .31.21.68.8.56A10.996 10.996 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5z"
              />
            </svg>
          </a>
        </div>
      </div>

      <div className="text-center py-4 text-xs text-gray-400 border-t border-gray-700">
        © 2026 TalkRehearsel. All rights reserved.
      </div>
    </footer>
  )
}
