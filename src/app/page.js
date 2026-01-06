"use client";
import Header from "@/components/ui/guest/blocks/Header";
import Footer from "@/components/ui/guest/blocks/Footer";
import { Inter, Playfair_Display } from "next/font/google";
import Hero from "@/components/ui/guest/blocks/Hero";
import { Rocket, Palette, Zap, Check } from "lucide-react";
import ParticleBackground from "@/components/ui/shared/ParticleBackground";
import { useEffect, useRef, useState } from 'react';

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  style: ["normal", "italic"],
});

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

export default function HomePage() {
  const [row1Ref, row1Visible] = useInView({ threshold: 0.2 });
  const [row2Ref, row2Visible] = useInView({ threshold: 0.2 });
  const [row3Ref, row3Visible] = useInView({ threshold: 0.2 });

  return (
    <>
      <div className={`${inter.variable} ${playfair.variable} min-h-screen`}>
        
      {/* <div className="fixed inset-0 -z-10 bg-gradient-to-br from-violet-200 via-indigo-100 to-crimson-200"></div> */ }
          {/* Header */}
          <Header />

          {/* HERO */}
          <Hero />
        
        {/*<section className="relative w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 py-24">
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
            
            <!-- Intro -->
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="serif animate-pulse text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 bg-clip-text text-transparent">
                Why TalkRehearsel?
              </h2>
              <p className="sans mt-6 text-lg md:text-xl text-gray-600 leading-relaxed">
                Minim tempor tempor dolore tempor consectetur excepteur  — <span className="font-semibold text-gray-800">Lorem ipsum aliquip do non in ut deserunt sit cillum reprehenderit.</span>.  
                Officia qui amet in fugiat dolore irure excepteur deserunt tempor ullamco pariatur excepteur sunt amet ut dolore minim officia quis quis cupidatat eiusmod aliquip sed velit aute eu consectetur ex dolore.
              </p>
              <div className="mt-8 w-24 h-1 mx-auto bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 rounded-full"></div>
            </div>

            <!-- PageTutor Row -->
            <div
              ref={row1Ref}
              className={`flex flex-col md:flex-row items-center gap-12 ${row1Visible ? 'fadeUp' : ''}`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-4xl font-bold text-indigo-600">PageTutor</h3>
                <p className="mt-4 text-lg md:text:xl text-gray-700 leading-loose max-w-2xl mx-auto md:mx-0">
                  A media‑style player for code and UI. PageTutor lets you 
                  <span className="font-semibold"> watch HTML & CSS transform into live interfaces step by step</span>. 
                  It’s like a video player, but for learning code — pause, rewind, and play through every detail.
                </p>
                <p className="mt-3 text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto md:mx-0">
                  Perfect for learners who want clarity, and for teachers who want to demonstrate concepts visually.
                </p>
                <ul className="mt-6 space-y-3 text-gray-600 text-base md:text-lg max-w-2xl mx-auto md:mx-0">
                  <li className="flex items-start gap-3">
                    <Check className="text-indigo-500 w-5 h-5 mt-1" />
                    <span>Pause, rewind, and replay lessons</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="text-indigo-500 w-5 h-5 mt-1" />
                    <span>Visual clarity for every concept</span>
                  </li>
                </ul>

                <a
                  href="/page-tutor"
                  className="mt-8 block w-full px-8 py-4 rounded-lg bg-indigo-600 text-white text-lg font-semibold shadow hover:scale-105 transition text-center"
                >
                  Try PageTutor →
                </a>
              </div>
              <div className="flex-1 w-full max-w-md mx-auto md:max-w-none md:mx-0">
                <div className="h-64 sm:h-80 md:h-96 rounded-2xl shadow-2xl overflow-hidden">
                  <img
                    src="/b1.png"
                    alt="PageTutor preview"
                    className="w-full h-full object-cover md:object-contain"
                  />
                </div>
              </div>

            </div>


          </div>
        </section> */}




        {/* FOOTER */}
        <Footer />
      </div>
    </>
  );
}
