'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'cookie-consent';
const GA_PROPERTY = 'G-M2KBLXBJ5S';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage not available
      return;
    }
    // Small delay so the slide-up animation is visible
    const timer = setTimeout(() => setVisible(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback((consent: 'all' | 'necessary') => {
    setDismissing(true);

    try {
      localStorage.setItem(STORAGE_KEY, consent);
    } catch {
      // localStorage not available
    }

    if (consent === 'necessary') {
      // Disable Google Analytics
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any)[`ga-disable-${GA_PROPERTY}`] = true;
    }

    // Wait for slide-down animation to finish before unmounting
    setTimeout(() => setVisible(false), 400);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className={`fixed bottom-0 left-0 right-0 z-[998] transition-transform duration-400 ease-out ${
        dismissing ? 'translate-y-full' : 'translate-y-0 animate-slide-up'
      }`}
    >
      <div className="border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(0,0,0,0.08)] dark:border-gray-700 dark:bg-gray-900/95 dark:shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Text */}
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 sm:max-w-2xl">
              We use cookies to enhance your experience and analyse site traffic.
              By continuing to use this site, you consent to our use of cookies.{' '}
              <Link
                href="/privacy-policy"
                className="font-semibold text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700 hover:decoration-blue-700/50 dark:text-blue-400 dark:decoration-blue-400/30 dark:hover:text-blue-300"
              >
                Privacy Policy
              </Link>
            </p>

            {/* Buttons */}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
              <button
                onClick={() => dismiss('necessary')}
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 dark:focus:ring-offset-gray-900"
              >
                Necessary Only
              </button>
              <button
                onClick={() => dismiss('all')}
                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
