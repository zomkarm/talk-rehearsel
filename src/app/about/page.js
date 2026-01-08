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
                TalkRehearsel is an interactive conversation practice platform designed to help people
                speak with confidence in real-world situations. Whether it’s interviews, meetings,
                daily conversations, or professional communication, TalkRehearsel provides a safe,
                guided environment to practice before it matters.
              </p>

              <p className="mt-4 text-base sm:text-lg text-gray-700 leading-relaxed">
                By combining structured scenarios, voice playback, and user-recorded responses,
                TalkRehearsel bridges the gap between theory and real communication — helping users
                improve clarity, fluency, and confidence through repetition and feedback.
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
                  Creator & Maintainer
                  <span className="absolute left-0 -bottom-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded"></span>
                </h3>

                <p className="text-xs sm:text-sm text-gray-500">
                  Product Design & Engineering
                </p>

                <p className="mt-2 text-sm sm:text-base text-gray-700 leading-relaxed max-w-sm">
                  TalkRehearsel is built with a focus on real usability — clean design, reliable
                  systems, and practical features that support continuous improvement rather than
                  one-time learning.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-emerald-600 text-white shadow-lg px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Our Mission
          </h2>

          <p className="mt-4 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
            Our mission is to make confident communication accessible to everyone by transforming
            practice into a structured, repeatable, and engaging experience.
          </p>

          <p className="mt-6 sm:mt-8 italic text-lg sm:text-xl md:text-2xl opacity-90">
            “Practice conversations before real conversations.”
          </p>
        </section>

        {/* Philosophy Section */}
        <section className="mt-16 sm:mt-20 rounded-3xl bg-gray-50 px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 text-center shadow-inner">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
            Design Philosophy
          </h2>

          <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
            TalkRehearsel is designed to feel calm, focused, and purposeful. Every interaction is
            intentional — from guided audio playback to structured practice flows — ensuring users
            can focus on learning without distraction.
          </p>

          <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
            The platform emphasizes clarity over complexity, real practice over passive learning,
            and long-term confidence over short-term performance.
          </p>
        </section>

        {/* Support Section */}
      <section className="mt-4 sm:mt-20 rounded-3xl bg-white px-4 sm:px-6 md:px-8 py-12 sm:py-14 md:py-16 text-center border border-gray-100 shadow-sm">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Free & Community-Supported
        </h2>

        <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
          TalkRehearsel is free to use and built as an independent project focused on real-world
          speaking practice. There are no ads, no subscriptions, and no locked features.
        </p>

        <p className="mt-4 text-gray-700 max-w-3xl mx-auto leading-relaxed text-base sm:text-lg md:text-xl">
          If this platform helps you practice speaking with more confidence, you can choose to
          support its development and ongoing maintenance.
        </p>

        <div className="mt-8">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-yellow-400 text-gray-900 font-medium hover:bg-yellow-300 transition"
          >
            ☕ Support TalkRehearsel
          </a>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Support is completely optional.
        </p>
      </section>

      </div>

      <Footer />
    </div>
  );
}
