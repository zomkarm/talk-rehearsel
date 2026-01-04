'use client'
import { useGlobalStore } from '@/store/globalStore'

export function GlobalLoader() {
  const isLoading = useGlobalStore(s => s.isLoading)
  const loaderMessage = useGlobalStore(s => s.loaderMessage)


  if (!isLoading) return null

  return (
    <div
      className={`
        fixed inset-0 z-[9999] flex flex-col items-center justify-center
        bg-gradient-to-br from-gray-900/90 to-gray-800/80 backdrop-blur-sm animate-fade-in
      `}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.05)_0%,transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.05)_0%,transparent_40%)] animate-pulse" />

      {/* Solar System Loader */}
      <div className="relative h-32 w-32 flex items-center justify-center">
        {/* Central glowing sun */}
        <div className="absolute h-4 w-4 rounded-full bg-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.9)] sun-core" />

        {/* Ring 1 */}
        <div className="absolute h-12 w-12 rounded-full border border-yellow-400/60 animate-spin-slow" />
        <div className="absolute h-2.5 w-2.5 rounded-full bg-gray-400 shadow-[0_0_8px_rgba(156,163,175,0.8)] orbit-dot orbit1" />

        {/* Ring 2 */}
        <div className="absolute h-20 w-20 rounded-full border border-green-300/50 animate-spin-medium" />
        <div className="absolute h-3 w-3 rounded-full bg-yellow-200 shadow-[0_0_10px_rgba(253,224,71,0.8)] orbit-dot orbit2" />

        {/* Ring 3 */}
        <div className="absolute h-28 w-28 rounded-full border border-red-200/40 animate-spin-fast" />
        <div className="absolute h-3.5 w-3.5 rounded-full bg-blue-400 shadow-[0_0_12px_rgba(56,189,248,0.8)] orbit-dot orbit3" />
      </div>

      {/* Dynamic text */}
      <p className="mt-6 text-sm font-medium tracking-wide text-gray-200">
        <span className="text-yellow-400 font-semibold">{loaderMessage}</span>
      </p>

      {/* Inline animations */}
      <style jsx>{`
        .animate-spin-slow {
          animation: spin 4s linear infinite;
        }
        .animate-spin-medium {
          animation: spin 6s linear infinite;
        }
        .animate-spin-fast {
          animation: spin 8s linear infinite;
        }

        .orbit1 { animation: orbit1 2s linear infinite; }
        .orbit2 { animation: orbit2 3s linear infinite; }
        .orbit3 { animation: orbit3 4s linear infinite; }

        .sun-core {
          background: radial-gradient(circle, #fde047 0%, #facc15 60%, #f59e0b 100%);
          box-shadow: 0 0 20px rgba(250, 204, 21, 0.9),
                      0 0 40px rgba(250, 204, 21, 0.6),
                      0 0 60px rgba(250, 204, 21, 0.4);
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit1 {
          0%   { transform: rotate(0deg) translateX(1.5rem) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(1.5rem) rotate(-360deg); }
        }
        @keyframes orbit2 {
          0%   { transform: rotate(0deg) translateX(2.5rem) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(2.5rem) rotate(-360deg); }
        }
        @keyframes orbit3 {
          0%   { transform: rotate(0deg) translateX(3.5rem) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(3.5rem) rotate(-360deg); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
