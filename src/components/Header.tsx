'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import DarkModeToggle from './DarkModeToggle';

// ---------------------------------------------------------------------------
// Menu data — grouped into Results, Predictions, Tools
// ---------------------------------------------------------------------------

interface MenuItem {
  icon: string;
  title: string;
  description: string;
  href: string;
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

const RESULTS_ITEMS: MenuItem[] = [
  { icon: '🇪🇺', title: 'EuroMillions', description: 'Tue & Fri draws, jackpots up to €240M', href: '/euromillions' },
  { icon: '🇪🇺', title: 'EuroJackpot', description: 'Tue & Fri draws across 18 countries', href: '/eurojackpot' },
  { icon: '🇬🇧', title: 'UK Lotto', description: 'Wed & Sat draws, 6 from 59', href: '/uk-lotto' },
  { icon: '🇬🇧', title: 'Thunderball', description: '5 draws per week, £500K top prize', href: '/thunderball' },
  { icon: '🇬🇧', title: 'Set for Life', description: 'Mon & Thu, £10K every month for 30 years', href: '/set-for-life' },
  { icon: '🇮🇪', title: 'Irish Lotto', description: 'Wed & Sat draws, 6 from 47', href: '/irish-lotto' },
  { icon: '🇫🇷', title: 'French Loto', description: 'Mon, Wed & Sat draws', href: '/french-loto' },
  { icon: '🇪🇸', title: 'La Primitiva', description: 'Thu & Sat draws, 6 from 49', href: '/spanish-lottery' },
  { icon: '🇩🇪', title: 'Lotto 6aus49', description: 'Wed & Sat draws, Superzahl bonus', href: '/german-lotto' },
  { icon: '🇮🇹', title: 'SuperEnalotto', description: 'Tue, Thu & Sat, jackpots over €100M', href: '/italian-superenalotto' },
];

const PREDICTIONS_ITEMS: MenuItem[] = [
  { icon: '🔮', title: 'Predictions', description: 'Statistical number predictions for all games', href: '/predictions' },
  { icon: '🔥', title: 'Hot & Cold Numbers', description: 'Most and least drawn numbers analysis', href: '/hot-cold-numbers' },
  { icon: '📊', title: 'Statistics & Analysis', description: 'Comprehensive frequency data and trends', href: '/statistics' },
  { icon: '📰', title: 'Lottery Blog', description: 'Latest draw results news and analysis', href: '/blog' },
];

const TOOLS_ITEMS: MenuItem[] = [
  { icon: '🎲', title: 'Number Generator', description: 'Generate random numbers for any lottery', href: '/number-generator' },
  { icon: '✅', title: 'Results Checker', description: 'Check your numbers against recent draws', href: '/results-checker' },
  { icon: '💰', title: 'Jackpot Tracker', description: 'Compare jackpot sizes across all games', href: '/jackpot-tracker' },
  { icon: '❓', title: 'FAQ', description: 'Common questions about European lotteries', href: '/faq' },
  { icon: '📖', title: 'How to Play', description: 'Rules and guides for every lottery game', href: '/how-to-play/euromillions' },
];

const MENU_GROUPS: MenuGroup[] = [
  { label: 'Results', items: RESULTS_ITEMS },
  { label: 'Predictions', items: PREDICTIONS_ITEMS },
  { label: 'Tools', items: TOOLS_ITEMS },
];

// ---------------------------------------------------------------------------
// Chevron SVG
// ---------------------------------------------------------------------------

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Desktop Mega Dropdown
// ---------------------------------------------------------------------------

function DesktopDropdown({
  group,
  isOpen,
  onEnter,
  onLeave,
  buttonRef,
}: {
  group: MenuGroup;
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}) {
  // Determine grid columns based on item count
  const cols = group.items.length > 6 ? 'lg:grid-cols-2' : group.items.length > 3 ? 'lg:grid-cols-2' : 'lg:grid-cols-1';

  return (
    <div
      className="relative"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <button
        ref={buttonRef}
        className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
          isOpen
            ? 'text-white bg-blue-700/60'
            : 'text-blue-100 hover:text-white hover:bg-blue-700/50'
        }`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        onClick={onEnter}
      >
        {group.label}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Mega panel */}
      <div
        className={`absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50 transition-all duration-150 ${
          isOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 ${
            group.items.length > 6 ? 'w-[600px]' : group.items.length > 3 ? 'w-[540px]' : 'w-[300px]'
          }`}
        >
          {/* Category header */}
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 px-2 mb-2">
            {group.label}
          </p>

          <div className={`grid ${cols} gap-1`}>
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors group/item"
              >
                <span className="text-xl mt-0.5 shrink-0" aria-hidden="true">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white group-hover/item:text-blue-700 dark:group-hover/item:text-blue-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-snug mt-0.5">
                    {item.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Accordion Section
// ---------------------------------------------------------------------------

function MobileAccordion({
  group,
  isOpen,
  onToggle,
  onLinkClick,
}: {
  group: MenuGroup;
  isOpen: boolean;
  onToggle: () => void;
  onLinkClick: () => void;
}) {
  return (
    <div className="border-b border-blue-700/30 last:border-b-0">
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-semibold text-white">{group.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-blue-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-2 pb-3 space-y-0.5">
          {group.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-start gap-3 px-3 py-2.5 rounded-lg text-blue-100 hover:bg-blue-700/50 transition-colors"
              onClick={onLinkClick}
            >
              <span className="text-lg mt-0.5 shrink-0" aria-hidden="true">
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{item.title}</p>
                <p className="text-xs text-blue-300 leading-snug mt-0.5">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Header
// ---------------------------------------------------------------------------

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDesktop, setOpenDesktop] = useState<number | null>(null);
  const [openMobile, setOpenMobile] = useState<number | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setOpenMobile(null);
  }, [pathname]);

  // Close desktop menu on escape
  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpenDesktop(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Close desktop menu on click outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      // Check if click is inside any dropdown
      const header = document.getElementById('site-header');
      if (header && !header.contains(target)) {
        setOpenDesktop(null);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // 150ms close delay for desktop hover
  const handleDesktopEnter = useCallback((index: number) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDesktop(index);
  }, []);

  const handleDesktopLeave = useCallback(() => {
    closeTimerRef.current = setTimeout(() => {
      setOpenDesktop(null);
    }, 150);
  }, []);

  const toggleMobileAccordion = useCallback((index: number) => {
    setOpenMobile((prev) => (prev === index ? null : index));
  }, []);

  return (
    <header
      id="site-header"
      className="sticky top-0 z-50 bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 shrink-0"
            aria-label="Euro Lotto Results home page"
          >
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
              <span className="text-blue-900 font-extrabold text-sm">EU</span>
            </div>
            <span className="text-white font-bold text-lg hidden sm:block">
              Euro Lotto Results
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {MENU_GROUPS.map((group, i) => (
              <DesktopDropdown
                key={group.label}
                group={group}
                isOpen={openDesktop === i}
                onEnter={() => handleDesktopEnter(i)}
                onLeave={handleDesktopLeave}
                buttonRef={{ current: buttonRefs.current[i] } as React.RefObject<HTMLButtonElement | null>}
              />
            ))}

            {/* Standalone links */}
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/faq"
              className="px-3 py-2 text-sm font-medium text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors"
            >
              FAQ
            </Link>
            <DarkModeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="lg:hidden p-2 text-blue-100 hover:text-white hover:bg-blue-700/50 rounded-lg transition-colors"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          mobileOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav
          className="border-t border-blue-700/50 bg-blue-900/95 backdrop-blur-sm"
          aria-label="Mobile navigation"
        >
          {MENU_GROUPS.map((group, i) => (
            <MobileAccordion
              key={group.label}
              group={group}
              isOpen={openMobile === i}
              onToggle={() => toggleMobileAccordion(i)}
              onLinkClick={() => setMobileOpen(false)}
            />
          ))}

          {/* Extra links */}
          <div className="flex gap-2 px-4 py-3 border-t border-blue-700/30">
            <Link
              href="/blog"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              📰 Blog
            </Link>
            <Link
              href="/faq"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              ❓ FAQ
            </Link>
            <Link
              href="/about"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-blue-100 hover:bg-blue-700/50 rounded-lg transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              ℹ️ About
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
