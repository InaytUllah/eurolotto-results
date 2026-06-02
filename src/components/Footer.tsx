import Link from 'next/link';

const lotteryLinks = [
  { name: 'EuroMillions', href: '/euromillions' },
  { name: 'EuroJackpot', href: '/eurojackpot' },
  { name: 'UK Lotto', href: '/uk-lotto' },
  { name: 'Thunderball', href: '/thunderball' },
  { name: 'Set for Life', href: '/set-for-life' },
  { name: 'Irish Lotto', href: '/irish-lotto' },
  { name: 'French Loto', href: '/french-loto' },
  { name: 'La Primitiva', href: '/spanish-lottery' },
  { name: 'Lotto 6aus49', href: '/german-lotto' },
  { name: 'SuperEnalotto', href: '/italian-superenalotto' },
];

const toolLinks = [
  { name: 'Number Generator', href: '/number-generator' },
  { name: 'Results Checker', href: '/results-checker' },
  { name: 'Hot & Cold Numbers', href: '/hot-cold-numbers' },
  { name: 'Statistics', href: '/statistics' },
  { name: 'Predictions', href: '/predictions' },
  { name: 'Jackpot Tracker', href: '/jackpot-tracker' },
  { name: 'Blog', href: '/blog' },
  { name: 'FAQ', href: '/faq' },
];

const legalLinks = [
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms of Use', href: '/terms' },
  { name: 'Disclaimer', href: '/disclaimer' },
  { name: 'About Us', href: '/about' },
  { name: 'Contact', href: '/contact' },
  { name: 'Responsible Gaming', href: '/responsible-gaming' },
];

const drawTimes = [
  { name: 'EuroMillions', schedule: 'Tue & Fri 8:45 PM', color: 'bg-blue-500' },
  { name: 'EuroJackpot', schedule: 'Tue & Fri 9:00 PM', color: 'bg-amber-500' },
  { name: 'UK Lotto', schedule: 'Wed & Sat 8:00 PM', color: 'bg-purple-500' },
  { name: 'Thunderball', schedule: 'Tue-Sat 8:15 PM', color: 'bg-red-500' },
  { name: 'Set for Life', schedule: 'Mon & Thu 8:00 PM', color: 'bg-green-500' },
  { name: 'Irish Lotto', schedule: 'Wed & Sat 8:00 PM', color: 'bg-emerald-500' },
  { name: 'French Loto', schedule: 'Mon, Wed & Sat 8:30 PM', color: 'bg-blue-400' },
  { name: 'La Primitiva', schedule: 'Thu & Sat 9:00 PM', color: 'bg-orange-500' },
  { name: 'Lotto 6aus49', schedule: 'Wed & Sat 6:25 PM', color: 'bg-yellow-500' },
  { name: 'SuperEnalotto', schedule: 'Tue, Thu & Sat 8:00 PM', color: 'bg-indigo-500' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center" aria-hidden="true">
                <span className="text-blue-900 font-extrabold text-xs">EU</span>
              </div>
              <span className="text-white font-bold">Euro Lotto Results</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your trusted source for European lottery results, analysis, and tools. We cover all major
              European lotteries including EuroMillions, EuroJackpot, UK Lotto, and more. Check the latest
              winning numbers, track jackpots, and generate your lucky numbers.
            </p>
            {/* Social Links Placeholders */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors"
                aria-label="Follow us on Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-sky-500 hover:text-white transition-colors"
                aria-label="Follow us on Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-colors"
                aria-label="Follow us on Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Lotteries Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Lotteries</h3>
            <ul className="space-y-2 text-sm" role="list">
              {lotteryLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Tools</h3>
            <ul className="space-y-2 text-sm" role="list">
              {toolLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm" role="list">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-400 hover:text-yellow-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Draw Times Column */}
          <div>
            <h3 className="text-white font-semibold mb-4">Draw Times</h3>
            <ul className="space-y-2 text-sm" role="list">
              {drawTimes.map((draw) => (
                <li key={draw.name} className="flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full ${draw.color} mt-1.5 shrink-0`} aria-hidden="true" />
                  <span>
                    <span className="text-gray-300 font-medium">{draw.name}:</span>{' '}
                    <span className="text-gray-400">{draw.schedule}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Our Network */}
        <div className="mt-10 mb-8">
          <h3 className="text-white font-semibold mb-3">Our Lottery Network</h3>
          <div className="flex flex-wrap gap-2">
            <a href="https://lottonumbersusa.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors">🇺🇸 Lotto Numbers USA</a>
            <a href="https://uk49sresults.co.uk" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors">🇬🇧 UK 49s Results</a>
            <a href="https://oz-lotto-results.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors">🇦🇺 AU Lotto Results</a>
            <a href="https://lotterycalculators.com" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-full transition-colors">🧮 Lottery Calculators</a>
          </div>
        </div>

        {/* 18+ Responsible Gaming Badge */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-5 bg-amber-900/30 border border-amber-700/50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-amber-500 flex items-center justify-center shrink-0 border-2 border-amber-300 shadow-lg">
              <span className="text-white font-extrabold text-xl">18+</span>
            </div>
            <div className="text-sm">
              <p className="text-amber-200 font-semibold mb-1">Play Responsibly</p>
              <p className="text-gray-400">
                Lottery games are for adults aged 18 and over. If you or someone you know has a gambling
                problem, please seek help.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <a
              href="https://www.begambleaware.org"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              BeGambleAware.org
            </a>
            <a
              href="https://www.gamcare.org.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium rounded-lg transition-colors"
            >
              GamCare.org.uk
            </a>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <p className="text-xs text-gray-500 text-center max-w-3xl mx-auto">
            This website is not affiliated with, endorsed by, or connected to any official lottery
            operator or governing body. All lottery results displayed are sourced from publicly available
            information and are provided for informational and reference purposes only. While we make every
            effort to ensure accuracy, we cannot guarantee the completeness or correctness of results.
            Players should always verify winning numbers with the official lottery operator before claiming
            any prize. Lottery participation is subject to the laws and regulations of your jurisdiction.
            You must be 18 years of age or older to purchase lottery tickets. Please play responsibly.
          </p>
          <p className="text-xs text-gray-600 text-center mt-4">
            &copy; {currentYear} Euro Lotto Results. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
