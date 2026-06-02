import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us — Your Trusted European Lottery Results Source',
  description: 'Learn about Euro Lotto Results, your trusted source for EuroMillions, EuroJackpot, and all major European lottery results. Updated within minutes of every draw.',
};

export default function AboutPage() {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://euromillionsresults.co.uk';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Euro Lotto Results',
    'url': SITE_URL,
    'description': 'Your trusted source for European lottery results, analysis, and tools.',
    'sameAs': [],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">About Euro Lotto Results</h1>

      <div className="prose dark:prose-dark max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Our Mission</h2>
          <p>Euro Lotto Results was created to provide lottery enthusiasts across Europe with a single, reliable destination for checking the latest winning numbers from all major European lotteries. We understand that finding accurate, up-to-date results across multiple countries and lottery operators can be time-consuming, which is why we bring everything together in one easy-to-use platform. Whether you play EuroMillions in France, UK Lotto in Britain, Lotto 6aus49 in Germany, or SuperEnalotto in Italy, we have your results covered within minutes of every draw.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Real-Time Results</h3>
              <p className="text-sm">Latest winning numbers from 10 European lotteries, updated within minutes of each draw. We monitor official sources to bring you accurate results fast.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Statistical Analysis</h3>
              <p className="text-sm">Comprehensive number frequency analysis, hot and cold number tracking, and historical draw data to help you understand patterns across all lotteries.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Lottery Tools</h3>
              <p className="text-sm">Free tools including a multi-game number generator, jackpot tracker comparing all EU jackpots, and prediction analysis based on historical data.</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Educational Content</h3>
              <p className="text-sm">Detailed guides on how to play each lottery, odds explanations, prize tier breakdowns, and responsible gaming resources for every player.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">What Makes Us Different</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Speed:</strong> Results are published within minutes of each draw, so you never have to wait long to check your numbers.</li>
            <li><strong>Coverage:</strong> We cover 10 major European lotteries across 7 countries, all in one place. No need to visit multiple websites.</li>
            <li><strong>Accuracy:</strong> We source results from official lottery data and verify them to ensure reliability. However, we always recommend checking official sources for definitive results.</li>
            <li><strong>Free Tools:</strong> All our analysis tools, number generators, and prediction features are completely free to use with no registration required.</li>
            <li><strong>Responsible Approach:</strong> We promote responsible gaming and provide resources for anyone who needs support with gambling-related issues.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Lotteries We Cover</h2>
          <p>Our platform provides comprehensive coverage of the following European lotteries, each with dedicated results pages, historical data, and statistical analysis:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            {[
              { name: 'EuroMillions', href: '/euromillions', flag: '🇪🇺' },
              { name: 'EuroJackpot', href: '/eurojackpot', flag: '🇪🇺' },
              { name: 'UK Lotto', href: '/uk-lotto', flag: '🇬🇧' },
              { name: 'Thunderball', href: '/thunderball', flag: '🇬🇧' },
              { name: 'Set for Life', href: '/set-for-life', flag: '🇬🇧' },
              { name: 'Irish Lotto', href: '/irish-lotto', flag: '🇮🇪' },
              { name: 'French Loto', href: '/french-loto', flag: '🇫🇷' },
              { name: 'La Primitiva', href: '/spanish-lottery', flag: '🇪🇸' },
              { name: 'Lotto 6aus49', href: '/german-lotto', flag: '🇩🇪' },
              { name: 'SuperEnalotto', href: '/italian-superenalotto', flag: '🇮🇹' },
            ].map((game) => (
              <Link key={game.href} href={game.href} className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <span>{game.flag}</span> {game.name}
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Our Commitment to Responsible Gaming</h2>
          <p>We take responsible gaming seriously. Lottery play should be enjoyable entertainment, not a source of financial stress. We encourage all users to set budgets, play within their means, and seek help if gambling becomes a problem. Visit our <Link href="/responsible-gaming" className="text-blue-600 dark:text-blue-400 hover:underline">Responsible Gaming</Link> page for support resources including GamCare, BeGambleAware, and other organisations that provide free, confidential help.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Get in Touch</h2>
          <p>We value your feedback and are always looking to improve our service. If you have questions, suggestions, or need assistance, please visit our <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link>. We aim to respond to all enquiries within 48 hours.</p>
        </section>
      </div>
    </div>
  );
}
