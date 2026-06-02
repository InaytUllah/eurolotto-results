'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const STORAGE_KEY = 'responsible-gaming-dismissed';
const SHOW_DELAY = 5000; // 5 seconds
const VISIBLE_DURATION = 10000; // 10 seconds
const FADE_DURATION = 500; // 0.5 seconds

export default function ResponsibleGamingPopup() {
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  const dismiss = useCallback(() => {
    setFadingOut(true);
    setTimeout(() => {
      setVisible(false);
      setFadingOut(false);
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // sessionStorage not available
      }
    }, FADE_DURATION);
  }, []);

  useEffect(() => {
    // Check if already dismissed this session
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // sessionStorage not available — show anyway
    }

    const showTimer = setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after VISIBLE_DURATION
  useEffect(() => {
    if (!visible || fadingOut) return;

    const autoDismissTimer = setTimeout(() => {
      dismiss();
    }, VISIBLE_DURATION);

    return () => clearTimeout(autoDismissTimer);
  }, [visible, fadingOut, dismiss]);

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[400px] z-[999] transition-all duration-500 ${
        fadingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="rounded-2xl bg-white shadow-2xl ring-1 ring-gray-200 overflow-hidden dark:bg-gray-800 dark:ring-gray-700">
        {/* Amber accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400" />

        <div className="p-5">
          {/* Header with icon and close button */}
          <div className="flex items-start gap-3">
            {/* Warning icon */}
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Responsible Gaming
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                Gambling is considered sinful in many faiths and traditions. If
                your beliefs discourage it, please honor them. No tool or
                strategy can change lottery odds — play responsibly or not at
                all.
              </p>
              <Link
                href="/responsible-gaming"
                className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Get Help &amp; Support
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Close button */}
            <button
              onClick={dismiss}
              className="shrink-0 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              aria-label="Dismiss responsible gaming notice"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Shrinking progress bar */}
        {!fadingOut && (
          <div className="h-1 bg-gray-100 dark:bg-gray-700">
            <div className="h-full bg-amber-500 animate-shrink-bar" />
          </div>
        )}
      </div>
    </div>
  );
}
