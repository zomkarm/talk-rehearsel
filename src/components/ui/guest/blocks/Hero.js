'use client'

export default function HeroSection() {

  return (
    <main className="relative w-full">
      {/* Hero Header */}
      <div className="text-center py-12 sm:py-16 md:py-24 lg:py-32">
        <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight max-w-3xl mx-auto">
          <span className="text-gray-900">Learn and build</span>
          <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 bg-clip-text text-transparent"> modern web apps</span>,
          <span className="underline decoration-blue-400 decoration-4 underline-offset-4"> visually </span>
          and clearly
        </h3>

        <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Ex voluptate laboris sit duis cupidatat dolor laborum proident est anim aliquip reprehenderit dolor fugiat cillum in proident in qui nulla proident dolor anim ex commodo cillum laboris sunt ut adipisicing proident elit fugiat.
        </p>

        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
          <a href="/signup" className="px-3 py-2 text-sm md:px-6 md:py-3 md:text-base font-semibold rounded-lg bg-gradient-to-r from-teal-600 to-indigo-600 text-white shadow hover:scale-105 transition">Get Started</a>
          <a href="/#" className="px-3 py-2 text-sm md:px-6 md:py-3 md:text-base font-semibold rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition shadow-lg">Link 1</a>
          <a href="/#" className="px-3 py-2 text-sm md:px-6 md:py-3 md:text-base font-semibold rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition shadow-lg">Linke 2</a>
          <a href="/#" className="px-3 py-2 text-sm md:px-6 md:py-3 md:text-base font-semibold rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-100 transition shadow-lg">Link 3</a>
        </div>
      </div>

      {/* Visual Anchor */}
      <div className="relative max-w-6xl mx-auto">
        <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-white/20 via-gray-50/10 to-white/5 backdrop-blur-2xl border border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.18)] hover:scale-[1.02]">
          
          {/* Decorative gradient glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-indigo-500 to-purple-500 opacity-30 blur-3xl pointer-events-none" />

          {/* Inner frame */}
          <div className="relative p-1 rounded-3xl bg-gradient-to-tr from-gray-50 via-white to-gray-100">
            <div className="rounded-2xl overflow-hidden">
              <img
                src="/preview_cardset.jpg"
                alt="Drofront preview"
                className="w-full h-auto object-cover lg:object-contain transition-transform duration-500 ease-out group-hover:scale-[1.01]"
              />
            </div>
          </div>
        </div>
      </div>
   
    </main>
  )
}
