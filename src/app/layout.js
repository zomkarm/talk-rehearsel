import { Suspense } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from 'sonner'
import { GlobalLoader } from '@/components/ui/shared/GlobalLoader'
import { RouteLoaderController } from '@/components/ui/shared/RouteLoaderController'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "TalkRehearsel | Practice Real Conversations",
  description:
    "TalkRehearsel helps you practice real-world conversations with guided audio and speaking rehearsal — built for confidence, fluency, and clarity.",
};


function Fallback() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-50/60 backdrop-blur-sm z-[9999]">
      <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        {/* Only a small fallback for edge Suspense delays */}
        <Suspense fallback={<GlobalLoader />}>
          {children}
          <Toaster position="top-right" richColors />
          <GlobalLoader />
          <RouteLoaderController />
        </Suspense>
      </body>
    </html>
  );
}
