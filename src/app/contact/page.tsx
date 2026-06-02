import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us — Get in Touch with Euro Lotto Results',
  description: 'Contact Euro Lotto Results with questions, feedback, or suggestions about our European lottery results service. We respond within 48 hours.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="prose dark:prose-dark max-w-none text-gray-700 dark:text-gray-300">
          <p>We would love to hear from you. Whether you have a question about our lottery results service, feedback on our website, or a suggestion for improvement, we are here to help. Euro Lotto Results covers 10 major European lotteries and we are always working to improve our coverage and accuracy.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">How to Reach Us</h2>
          <p>The best way to contact us is via email. We aim to respond to all enquiries within 48 hours during business days.</p>
          <p className="font-semibold">Email: contact@euromillionsresults.co.uk</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Common Questions</h2>
          <p>Before reaching out, you may find the answer to your question in our resources:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><Link href="/faq" className="text-blue-600 dark:text-blue-400 hover:underline">Frequently Asked Questions</Link> — answers to common queries about our service</li>
            <li><Link href="/disclaimer" className="text-blue-600 dark:text-blue-400 hover:underline">Disclaimer</Link> — important information about the nature of our service</li>
            <li><Link href="/responsible-gaming" className="text-blue-600 dark:text-blue-400 hover:underline">Responsible Gaming</Link> — support resources for gambling-related concerns</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Report an Issue</h2>
          <p>If you have noticed an error in our lottery results or any technical issue with our website, please let us know. Include as much detail as possible, such as the lottery game, draw date, and the nature of the issue. Accurate results are our top priority and we appreciate your help in maintaining data quality across all 10 European lotteries we cover.</p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Important Note</h2>
          <p>Euro Lotto Results is an independent information service. We are not a lottery operator and cannot help with ticket purchases, prize claims, or account issues. For these matters, please contact your official lottery operator directly. We do not have access to any player accounts or ticket information.</p>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h2>
            <div className="space-y-3">
              {[
                { label: 'Latest Results', href: '/', desc: 'Check the latest lottery results' },
                { label: 'FAQ', href: '/faq', desc: 'Frequently asked questions' },
                { label: 'About Us', href: '/about', desc: 'Learn more about our service' },
                { label: 'Privacy Policy', href: '/privacy-policy', desc: 'How we handle your data' },
                { label: 'Terms & Conditions', href: '/terms', desc: 'Rules for using our service' },
                { label: 'Responsible Gaming', href: '/responsible-gaming', desc: 'Gaming support resources' },
              ].map((link) => (
                <Link key={link.href} href={link.href} className="block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <p className="font-medium text-blue-600 dark:text-blue-400">{link.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{link.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
