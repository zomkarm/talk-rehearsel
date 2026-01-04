"use client";

import Header from "@/components/ui/guest/blocks/Header";
import Footer from "@/components/ui/guest/blocks/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <section className="mt-12 sm:mt-16 relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 shadow-inner">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center px-4 sm:px-6 md:px-8 py-10 sm:py-12 md:py-16">
            {/* Left: Text */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-cyan-600 to-emerald-600 bg-clip-text text-transparent">
                About TalkRehearsel
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                TalkRehearsel is a production-ready application foundation designed to help teams and individuals
                build real-world products faster and with confidence. It provides a structured yet flexible
                base that removes repetitive setup work and lets you focus on what truly matters — your product.
              </p>
              <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                From authentication and dashboards to system settings and extensible modules,
                TalkRehearsel acts as a reliable core that adapts to different use cases without enforcing
                unnecessary constraints or opinions.
              </p>
            </div>

            {/* Right: Creator Info */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start gap-4 sm:gap-6 bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-100 hover:shadow-lg transition">
              <img
                src="/profile.jpg"
                alt="Creator"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-gray-200 shadow-sm"
              />
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 relative inline-block">
                  Project Maintainer
                  <span className="absolute left-0 -bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded"></span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">Architecture & Engineering</p>
                <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed max-w-sm">
                  TalkRehearsel was created to serve as a stable, reusable foundation for building practical
                  software products. The focus is on clarity, maintainability, and long-term sustainability.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 text-white shadow-lg px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Our Mission</h2>
          <p className="mt-4 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
            TalkRehearsel exists to reduce friction in software development by providing a solid,
            extensible foundation that scales from small utilities to larger production systems.
          </p>
          <p className="mt-6 sm:mt-8 italic text-lg sm:text-xl md:text-2xl opacity-90">
            “A strong foundation enables faster progress and better decisions.”
          </p>
        </section>

        {/* Philosophy Section */}
        <section className="mt-16 sm:mt-20 rounded-3xl bg-gray-50 px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 text-center shadow-inner">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Design Philosophy</h2>
          <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
            TalkRehearsel is built with a balance of structure and flexibility. It avoids unnecessary abstraction
            while providing sensible defaults that encourage consistency, readability, and maintainability.
            The goal is not to dictate how products should be built, but to support how they naturally evolve.
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
