import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Responsible Gaming — Play Safely and Know Your Limits',
  description: 'Responsible gaming information and support resources. Learn about safe lottery play, warning signs of problem gambling, and where to get help.',
};

export default function ResponsibleGamingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Responsible Gaming</h1>

      {/* Warning Banner */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="bg-red-600 text-white font-black text-xl px-3 py-1 rounded-lg shrink-0">18+</div>
          <div>
            <p className="text-red-800 dark:text-red-200 font-bold text-lg mb-1">Gambling is for adults only</p>
            <p className="text-red-700 dark:text-red-300">You must be 18 years or older to play any lottery in most European countries. Please play responsibly and never spend more than you can afford to lose. If gambling is causing problems in your life, help is available.</p>
          </div>
        </div>
      </div>

      <div className="prose dark:prose-dark max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Our Commitment</h2>
          <p>At Euro Lotto Results, we believe that playing the lottery should be an enjoyable form of entertainment. We are committed to promoting responsible gaming and providing our users with the information and resources they need to play safely. While we provide lottery results and statistical analysis for EuroMillions, EuroJackpot, UK Lotto, and other European lotteries, we strongly encourage all players to gamble responsibly and within their means.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Tips for Responsible Play</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {[
              { title: 'Set a Budget', desc: 'Decide how much you can afford to spend on lottery tickets each week or month, and stick to it. Never use money meant for essentials like rent, bills, or food.' },
              { title: 'Play for Fun', desc: 'Treat lottery play as entertainment, not as a way to make money or solve financial problems. The odds of winning a jackpot are extremely low.' },
              { title: 'Know the Odds', desc: 'Understand the probability of winning before you play. EuroMillions odds are 1 in 139 million. Accept that losing is the most likely outcome.' },
              { title: 'Take Breaks', desc: 'Do not play every draw. Taking regular breaks helps maintain a healthy relationship with gambling and prevents it from becoming habitual.' },
              { title: 'Never Chase Losses', desc: 'If you do not win, do not increase your spending to try to recover losses. Each draw is independent and the odds remain the same.' },
              { title: 'Keep It Private', desc: 'Do not borrow money to gamble, and be honest with friends and family about your spending habits. Secrecy can be a warning sign.' },
              { title: 'Balance Your Life', desc: 'Make sure lottery play does not take priority over work, relationships, health, or other important aspects of your life.' },
            ].map((tip, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{tip.title}</h3>
                <p className="text-sm">{tip.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Warning Signs of Problem Gambling</h2>
          <p>Gambling may have become a problem if you experience any of the following:</p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Spending more money on gambling than you can afford</li>
            <li>Borrowing money or selling possessions to gamble</li>
            <li>Feeling anxious, stressed, or depressed about gambling</li>
            <li>Arguing with friends or family about money and gambling</li>
            <li>Losing interest in activities you used to enjoy</li>
            <li>Neglecting work, studies, or responsibilities because of gambling</li>
            <li>Lying to others about how much time or money you spend gambling</li>
            <li>Gambling to escape problems or relieve feelings of helplessness</li>
            <li>Feeling the need to gamble with increasing amounts of money</li>
          </ul>
          <p className="mt-3">If you recognise any of these signs in yourself or someone you know, please seek help. Support is available 24/7 and all services listed below are free and confidential.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Self-Exclusion</h2>
          <p>Most lottery operators offer self-exclusion programmes that allow you to block yourself from purchasing tickets for a set period. If you feel you need to take a break from gambling, consider using self-exclusion tools provided by your local lottery operator. In the UK, you can use GAMSTOP to self-exclude from all UK-licensed online gambling companies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Support Organisations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">GamCare (UK)</h3>
              <p className="text-sm mb-3">Free information, support, and counselling for anyone affected by problem gambling. Available 24/7.</p>
              <p className="text-sm font-semibold">Phone: 0808 8020 133</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">gamcare.org.uk</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">BeGambleAware (UK)</h3>
              <p className="text-sm mb-3">Free, confidential advice and support for anyone concerned about their gambling. Provides guidance and treatment referrals.</p>
              <p className="text-sm font-semibold">Phone: 0808 8020 133</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">begambleaware.org</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">Gamblers Anonymous (International)</h3>
              <p className="text-sm mb-3">A fellowship of men and women who share experiences to help each other recover from a gambling problem. Meetings available across Europe.</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">gamblersanonymous.org</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">European Association for the Study of Gambling</h3>
              <p className="text-sm mb-3">Research-based organisation providing information about responsible gambling across European countries.</p>
              <p className="text-sm text-blue-600 dark:text-blue-400">easg.org</p>
            </div>
          </div>
        </section>

        <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">If you or someone you know has a gambling problem, please reach out to one of the organisations above. Help is available 24 hours a day, 7 days a week, and all services are free and confidential. Remember: it is never too late to seek help.</p>
          <div className="flex flex-wrap gap-3 mt-4">
            <Link href="/disclaimer" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Disclaimer</Link>
            <Link href="/terms" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
