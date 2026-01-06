'use client'

export default function HeroSection() {
  return (
    <main className="relative w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">
      
    {/* Background abstract shapes */}
    <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 rounded-full opacity-30 animate-blob mix-blend-multiply filter blur-3xl"></div>

    <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-r from-lime-300 via-green-300 to-emerald-400 rounded-full opacity-20 animate-blob animation-delay-2000 mix-blend-multiply filter blur-3xl"></div>

    <div className="absolute bottom-0 left-10 w-[600px] h-[600px] bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-400 rounded-full opacity-10 animate-blob animation-delay-4000 mix-blend-multiply filter blur-3xl"></div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-6 py-24 sm:py-32 lg:py-40 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          <span className="block">Rehearse your talks</span>
          <span className="block bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            like a pro, visually
          </span>
        </h1>

        <p className="mt-6 text-gray-700 sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          AI-powered practice, instant feedback, and interactive tools to boost your confidence. 
          Make every talk engaging and precise.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a 
            href="/signup" 
            className="px-8 py-3 text-base font-bold rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
          >
            Get Started
          </a>
          <a 
            href="/tkh" 
            className="px-8 py-3 text-base font-bold rounded-full border-2 border-gray-300 text-gray-900 hover:bg-gray-100 transition transform hover:scale-105"
          >
            Try Talk Rehearsal
          </a>
        </div>
      </div>

      {/* Hero Image / Floating Card */}
      <div className="relative z-10 max-w-5xl mx-auto mt-16 sm:mt-24">
        <div className="group relative overflow-visible rounded-3xl">
          
          {/* Floating card with glass effect */}
          <div className="relative rounded-3xl overflow-hidden bg-white/30 backdrop-blur-lg border border-white/20 shadow-2xl transform transition duration-500 hover:scale-105 hover:rotate-1">
            <img 
              src="/tkh.png" 
              alt="Talk Rehearsal Preview" 
              className="w-full h-auto object-cover lg:object-contain"
            />
          </div>

          {/* Floating glow */}
          <div className="absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-r from-teal-300 to-indigo-400 opacity-50 blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-8 right-0 w-40 h-40 rounded-full bg-gradient-to-r from-purple-300 to-pink-400 opacity-50 blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
      </div>

    </main>
  )
}
