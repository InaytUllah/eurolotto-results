'use client';

import { useState } from 'react';
import Link from 'next/link';

const faqs = [
  { q: 'What time are EuroMillions draws?', a: 'EuroMillions draws take place every Tuesday and Friday at 8:45 PM CET (Central European Time). In the UK, this is 7:45 PM GMT during winter and 8:45 PM BST during summer. Results are usually available on our website within minutes of the draw taking place.' },
  { q: 'What is the difference between EuroMillions and EuroJackpot?', a: 'Both are transnational European lotteries, but they are operated by different organisations and available in different countries. EuroMillions is played in 9 Western European countries (UK, France, Spain, Ireland, Portugal, Belgium, Austria, Luxembourg, Switzerland), while EuroJackpot is available in 18 countries across Northern and Central Europe (including Germany, Finland, Denmark, the Netherlands, and others). Both require picking 5 main numbers plus 2 bonus numbers.' },
  { q: 'Which countries can play EuroMillions?', a: 'EuroMillions is available to players in nine participating countries: the United Kingdom, France, Spain, Ireland, Portugal, Belgium, Austria, Luxembourg, and Switzerland. Each country has its own national lottery operator that sells EuroMillions tickets. Players in non-participating countries may be able to play through authorised online lottery services.' },
  { q: 'How do I check my lottery results on this website?', a: 'Simply visit our homepage to see the latest results from all 10 European lotteries we cover. You can also navigate to a specific lottery page (such as EuroMillions or UK Lotto) to see the most recent draw results and past winning numbers. We update results within minutes of each draw taking place.' },
  { q: 'Are the results on this website official?', a: 'While we make every effort to provide accurate and timely results, we are an independent information service and not affiliated with any official lottery operator. We source our results from publicly available data and verify them against official sources. However, we always recommend checking your tickets against the official results published by your national lottery operator.' },
  { q: 'What is the biggest EuroMillions jackpot ever won?', a: 'The record EuroMillions jackpot stands at €240 million, which has been reached multiple times due to the cap on the maximum jackpot. When the jackpot reaches its cap and is not won, it enters a "must be won" draw where the prize rolls down to lower tiers if no one matches all numbers. Individual country records vary.' },
  { q: 'How do the predictions on your website work?', a: 'Our predictions are based on statistical analysis of historical draw data, including number frequency analysis, hot and cold number identification, and mathematical probability patterns. However, it is important to understand that lottery draws are completely random events and no prediction method can guarantee winning numbers. Our predictions are for entertainment and informational purposes only.' },
  { q: 'What are hot and cold numbers?', a: 'Hot numbers are those that have been drawn most frequently in recent lottery draws, while cold numbers are those that appear less often. While some players like to use this information when choosing their numbers, it is important to remember that each draw is an independent random event. Past frequency does not influence future results.' },
  { q: 'Can I buy lottery tickets through this website?', a: 'No, Euro Lotto Results is purely an information service. We do not sell lottery tickets, accept bets, or facilitate any form of gambling. To purchase lottery tickets, please visit your national lottery operator or an authorised retailer. In the UK, you can buy tickets at any National Lottery retailer or online at national-lottery.co.uk.' },
  { q: 'What lotteries do you cover?', a: 'We cover 10 major European lotteries: EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, Spanish La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto. Each lottery has its own dedicated results page with past draws, number frequency analysis, and detailed game information.' },
  { q: 'How quickly are results updated after a draw?', a: 'We aim to update results within 1 to 5 minutes of each draw taking place. Our automated systems monitor official lottery data sources and publish results as soon as they become available. During peak times or if there are delays from official sources, it may take slightly longer. We always prioritise accuracy over speed.' },
  { q: 'What is the Italian SuperEnalotto and why are the odds so high?', a: 'The Italian SuperEnalotto requires players to choose 6 numbers from 1 to 90, making it one of the hardest lotteries to win in the world with odds of approximately 1 in 622 million. However, because jackpots are not capped and can roll over indefinitely, the SuperEnalotto has produced some of the largest lottery prizes in European history, including a €371 million jackpot in 2023.' },
  { q: 'Do you have a number generator?', a: 'Yes, our free Number Generator tool allows you to generate random numbers for any of the 10 European lotteries we cover. Simply select the lottery game you want to play and our generator will produce a set of random numbers matching that game\'s format. You can generate multiple sets and view your generation history.' },
  { q: 'What is Set for Life and how is it different?', a: 'Set for Life is a UK National Lottery game that offers a top prize of £10,000 every month for 30 years, instead of a single lump-sum payment. This unique prize structure provides financial security over a long period. Draws take place every Monday and Thursday. Players choose 5 main numbers from 1-47 and 1 Life Ball from 1-10.' },
  { q: 'Is it legal to play European lotteries from another country?', a: 'This depends on the specific lottery and your country of residence. Some European lotteries restrict ticket sales to residents of participating countries, while others allow international play through authorised online services. Always check the rules of the specific lottery you wish to play and ensure you are complying with your local gambling laws.' },
  { q: 'How do I claim a lottery prize?', a: 'Prize claiming procedures vary by country and lottery operator. Small prizes (typically under €500 or £500) can usually be claimed at any authorised retailer. Larger prizes may need to be claimed at regional lottery offices or by post. Jackpots and very large prizes typically require contacting the lottery operator directly. Always check with your national lottery operator for specific claim procedures and deadlines.' },
  { q: 'What is the Thunderball lottery?', a: 'Thunderball is a UK National Lottery game with a fixed top prize of £500,000, drawn five times a week (Tuesday through Saturday). Players choose 5 main numbers from 1-39 and 1 Thunderball from 1-14. The odds of winning the top prize are approximately 1 in 8 million, making it one of the easier lottery games to win compared to EuroMillions or UK Lotto.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
        Frequently Asked Questions
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Find answers to the most common questions about European lotteries, our results service, and how to play responsibly.
      </p>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left px-6 py-4 flex items-center justify-between gap-4"
              aria-expanded={openIndex === i}
              aria-controls={`faq-answer-${i}`}
            >
              <span className="font-semibold text-gray-900 dark:text-white">{faq.q}</span>
              <svg
                className={`w-5 h-5 shrink-0 text-gray-500 transition-transform ${openIndex === i ? 'rotate-180' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === i && (
              <div id={`faq-answer-${i}`} className="px-6 pb-4">
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Related Links */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Explore More</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/euromillions" className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
            <p className="font-medium text-gray-900 dark:text-white">EuroMillions</p>
            <p className="text-xs text-gray-500">Latest Results</p>
          </Link>
          <Link href="/predictions" className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
            <p className="font-medium text-gray-900 dark:text-white">Predictions</p>
            <p className="text-xs text-gray-500">Number Analysis</p>
          </Link>
          <Link href="/number-generator" className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
            <p className="font-medium text-gray-900 dark:text-white">Generator</p>
            <p className="text-xs text-gray-500">Random Numbers</p>
          </Link>
          <Link href="/responsible-gaming" className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center hover:shadow-md transition-shadow">
            <p className="font-medium text-gray-900 dark:text-white">Safe Play</p>
            <p className="text-xs text-gray-500">Responsible Gaming</p>
          </Link>
        </div>
      </div>

      {/* SEO Content */}
      <div className="mt-10 prose dark:prose-dark max-w-none text-gray-700 dark:text-gray-300">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">About Euro Lotto Results FAQ</h2>
        <p>Our Frequently Asked Questions page covers the most common queries we receive about European lottery results, how to play various lotteries, and how our service works. We cover 10 major European lotteries including EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, Spanish La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto. If your question is not answered here, please visit our <Link href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</Link> to get in touch. We are always happy to help and typically respond within 48 hours.</p>
        <p>Whether you are a seasoned lottery player looking for the latest draw results or a newcomer wanting to understand how European lotteries work, our comprehensive FAQ section aims to provide clear, accurate answers. Remember that we are an independent information service and always recommend checking official lottery websites for definitive results before claiming any prizes. For information about responsible gambling, please visit our <Link href="/responsible-gaming" className="text-blue-600 dark:text-blue-400 hover:underline">Responsible Gaming</Link> page.</p>
      </div>

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqs.map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: { '@type': 'Answer', text: faq.a },
            })),
            speakable: {
              '@type': 'SpeakableSpecification',
              cssSelector: ['.space-y-3 button span', '.space-y-3 .px-6.pb-4 p'],
            },
          }),
        }}
      />
    </div>
  );
}
