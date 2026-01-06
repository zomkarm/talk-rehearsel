import { useState, useEffect } from 'react';
import { useGlobalStore } from '@/store/globalStore';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const isLoggedIn = useGlobalStore(state => state.isLoggedIn);
  const fetchUserStatus = useGlobalStore(state => state.fetchUserStatus);
  const router = useRouter();

  useEffect(() => {
    fetchUserStatus();
  }, [fetchUserStatus]);

  const isHome = router.pathname === "/";

  return (
    <>
      <header className="fixed  top-0 left-0 right-0 z-40 flex items-center justify-between h-16 px-6 md:px-12 border-b border-gray-200 md:border-none">

        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/logo.png"
            alt="TalkRehearsel Logo"
            className="h-7 w-7 md:h-8 md:w-8"
          />
          <a href="/" className="ml-2">
            <span className="serif text-teal-700 text-xl md:text-2xl font-bold">
              TalkRehearsel
            </span>
          </a>
        </div>

        {/* Right side group: Nav + Actions */}
        <div className="hidden md:flex items-center gap-10">
          {/* Nav */}
          <nav className="flex items-center gap-8 text-sm font-semibold tracking-wide">
            {["About", "Contact", "Pricing"].map((label) => {
              const href = `/${label.toLowerCase()}`;
              return (
                <a
                  key={label}
                  href={href}
                  className="relative text-gray-800 hover:text-indigo-600 transition-colors
                             after:absolute after:-bottom-1 after:left-0 after:w-full after:h-[2px]
                             after:bg-gradient-to-r after:from-teal-600 after:to-indigo-600
                             after:opacity-100 hover:after:opacity-60 after:transition-all after:duration-300 hover:after:scale-105"
                >
                  {label}
                </a>
              );
            })}
          </nav>



          {/* Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <a
                href="/dashboard"
                className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-90 transition"
              >
                Go to Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-90 transition"
                >
                  Sign In
                </a>
                
              </>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden text-center">
          <button
            aria-label="Close menu"
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <div className="flex items-center">
                <img src="/logo.png" alt="TalkRehearsel Logo" className="h-6 w-6" />
                <a href="/" onClick={() => setIsOpen(false)}>
                  <span className="serif text-teal-700 text-xl font-bold ml-2">TalkRehearsel</span>
                </a>
              </div>
              <button
                aria-label="Close menu"
                className="p-2 rounded-lg hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex-1 px-4 py-6 font-semibold flex flex-col gap-4 text-gray-700">
              <a href="/about" className="hover:text-indigo-600 transition-colors" onClick={() => setIsOpen(false)}>About</a>
              <a href="/contact" className="hover:text-indigo-600 transition-colors" onClick={() => setIsOpen(false)}>Contact</a>
              <a href="/pricing" className="hover:text-indigo-600 transition-colors" onClick={() => setIsOpen(false)}>Pricing</a>

              {isLoggedIn ? (
                <a
                  href="/dashboard"
                  className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-sm font-semibold shadow hover:opacity-90 transition"
                  onClick={() => setIsOpen(false)}
                >
                  Go to Dashboard
                </a>
              ) : (
                <div className="flex flex-col gap-3">
                  <a
                    href="/login"
                    className="hover:text-indigo-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    Log in
                  </a>
                  {!isHome && (
                    <a
                      href="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-md hover:opacity-90 transition"
                      onClick={() => setIsOpen(false)}
                    >
                      Get started for free
                    </a>
                  )}
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
