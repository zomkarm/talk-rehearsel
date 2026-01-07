'use client'
import { useEffect, useRef, useState } from 'react';
import { Rocket, Palette, Zap, Check } from "lucide-react";

function useInView(options) {
  const ref = useRef(null);
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      options
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref, isVisible];
}

export default function HeroSection() {
  const [row1Ref, row1Visible] = useInView({ threshold: 0.2 });
  const [row2Ref, row2Visible] = useInView({ threshold: 0.2 });
  const [row3Ref, row3Visible] = useInView({ threshold: 0.2 });
  return (
    <main className="relative w-full overflow-hidden bg-gradient-to-b from-white via-gray-50 to-white text-gray-900">

      {/* Background abstract shapes */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-400 rounded-full opacity-30 mix-blend-multiply blur-3xl"></div>
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-r from-lime-300 via-green-300 to-emerald-400 rounded-full opacity-20 mix-blend-multiply blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-[600px] h-[600px] bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-400 rounded-full opacity-10 mix-blend-multiply blur-3xl"></div>

      {/* Hero Text */}
      <div className="relative z-10 text-center px-6 py-24 sm:py-32 lg:py-40 max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto">
          <span className="block">Rehearse your talks</span>
          <span className="block bg-gradient-to-r from-teal-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
            like a pro, visually
          </span>
        </h1>

        <p className="mt-6 text-gray-700 sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
          Practice real-life conversations with structured scenarios, role-based playback,
          and guided speaking flow. Build confidence before important conversations happen.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/signup"
            className="px-8 py-3 text-base font-bold rounded-full bg-gradient-to-r from-teal-400 to-indigo-500 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition"
          >
            Get Started
          </a>
          <a
            href="/tkh"
            className="px-8 py-3 text-base font-bold rounded-full border-2 border-gray-300 text-gray-900 hover:bg-gray-100 hover:scale-105 transition"
          >
            Try Talk Rehearsal
          </a>
        </div>
      </div>

      <section className="relative w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 py-24">
          <style jsx>{`
            @keyframes fadeUp {
              from { opacity: 0; transform: translateY(40px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .fadeUp {
              opacity: 0;
              animation: fadeUp 0.8s ease-out forwards;
            }
          `}</style>


          <div className="max-w-7xl mx-auto px-6 space-y-20">
            
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="serif animate-pulse text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Why TalkRehearsel?
              </h2>

              <p className="sans mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                Important conversations are rarely improvised successfully.
                <span className="font-semibold text-gray-800">
                  {" "}TalkRehearsel helps you practice before the moment matters.
                </span>
                <br />
                It provides realistic scenarios, guided flow, and private rehearsal tools
                so you can speak with clarity, confidence, and intent — not guesswork.
              </p>
              <div className="mt-8 w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full"></div>
            </div>

            <div
              ref={row1Ref}
              className={`flex flex-col md:flex-row items-center gap-12 ${row1Visible ? 'fadeUp' : ''}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold text-indigo-600">Structured conversation rehearsal</h3>
                <p className="mt-4 text-lg md:text:xl text-gray-700 leading-loose max-w-2xl mx-auto md:mx-0">
                  TalkRehearsel lets you practice real-world conversations
                  <span className="font-semibold">
                    {" "}step by step, role by role
                  </span>.
                  Instead of imagining responses, you listen, respond, record,
                  and improve — just like a real interaction, without pressure.
                </p>

                                <p className="mt-3 text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Whether it’s an interview, a difficult discussion, or an important meeting,
                  TalkRehearsel helps you prepare your words, pacing, and tone
                  before you need them.
                </p>
                <ul className="mt-6 space-y-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                  <li className="flex items-start gap-3">
                    <Check className="text-indigo-500 w-5 h-5 mt-1" />
                    <span>Practice realistic, scenario-based conversations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-indigo-500 w-5 h-5 mt-1" />
                    <span>Record responses privately and improve naturally</span>
                  </li>
                </ul>

                <a
                  href="/tkh"
                  className="mt-8 block w-full px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold shadow hover:scale-105 transition text-center"
                >
                  Start practicing →
                </a>
              </div>
              <div className="flex-1 w-full max-w-md mx-auto md:max-w-none md:mx-0">
                <div className="h-64 sm:h-80 md:h-96 rounded-2xl shadow-2xl overflow-hidden">
                  <img
                    src="/tkh.png"
                    alt="TalkRehearsel practice interface preview"
                    className="w-full h-full object-cover md:object-contain"
                  />
                </div>
              </div>

            </div>


          </div>
        </section>


    </main>
  )
}
