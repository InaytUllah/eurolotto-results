import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Disclaimer — Important Information About Our Service',
  description: 'Important disclaimers about Euro Lotto Results. We are not a lottery operator. Results are for information only. Always verify with official sources.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Disclaimer</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: March 2026</p>

      {/* Warning Banner */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-8">
        <p className="text-amber-800 dark:text-amber-200 font-semibold text-lg mb-2">Important Notice</p>
        <p className="text-amber-700 dark:text-amber-300">Euro Lotto Results is an independent information website. We are NOT affiliated with any official lottery organisation. Always verify results with the official lottery operator before claiming prizes.</p>
      </div>

      <div className="prose dark:prose-dark max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">No Affiliation</h2>
          <p>Euro Lotto Results is not affiliated with, endorsed by, or connected to any official lottery organisation. This includes but is not limited to Allwyn (formerly Camelot Group), La Francaise des Jeux (FDJ), Loterias y Apuestas del Estado, Deutscher Lotto- und Totoblock (DLTB), Sisal, National Lottery Ireland, or any other national or international lottery operator. All lottery names, logos, and trademarks mentioned on this website are the property of their respective owners and are used for identification purposes only.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Results Accuracy</h2>
          <p>We source lottery results from publicly available information and make every reasonable effort to ensure accuracy and timeliness. However, results displayed on this website may contain errors, omissions, or delays. We accept no responsibility for inaccurate or incomplete results. <strong>You must always check your lottery tickets against the official results published by the relevant lottery operator.</strong> Official results can typically be found on each lottery&apos;s official website or through authorised retailers.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Predictions Are Not Guarantees</h2>
          <p>Any predictions, statistical analyses, number frequency data, hot and cold number information, or number generation tools provided on this website are purely for entertainment and informational purposes. Lottery draws are completely random events governed by probability. No prediction system, pattern analysis, or historical data can guarantee future lottery results. Past performance of any number does not indicate future outcomes. We strongly advise against making financial decisions based on our prediction content.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">No Guarantee of Winnings</h2>
          <p>Nothing on this website should be interpreted as a guarantee, promise, or implication that you will win any lottery prize. The odds of winning lottery jackpots are extremely low. Playing the lottery should be considered a form of entertainment, not an investment or income strategy. We do not guarantee the accuracy of any jackpot amounts, prize tier information, or odds statistics displayed on our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">User Responsibility</h2>
          <p>By using this website, you acknowledge that you are solely responsible for any actions you take based on information found here. This includes the decision to purchase lottery tickets, the selection of numbers, and the verification of results. You should always play responsibly, within your means, and in accordance with the laws of your jurisdiction. If you believe you have a gambling problem, please visit our <Link href="/responsible-gaming" className="text-blue-600 dark:text-blue-400 hover:underline">Responsible Gaming</Link> page for support resources.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Age Restriction</h2>
          <p>Lottery play is restricted to individuals aged 18 years and over in most European jurisdictions. Some countries may have higher age requirements. It is your responsibility to ensure you meet the minimum age requirement in your jurisdiction before participating in any lottery. Our website content is intended for adult audiences only.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Third-Party Links</h2>
          <p>This website may contain links to external websites, including official lottery operators, responsible gambling organisations, and other third-party resources. We do not control, endorse, or assume responsibility for the content, policies, or practices of any external websites. Following third-party links is at your own risk. We recommend reviewing the privacy policy and terms of service of any external website you visit.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">Limitation of Liability</h2>
          <p>To the maximum extent permitted by applicable law, Euro Lotto Results, its owners, operators, employees, and affiliates shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising out of or in connection with your use of this website. This includes, without limitation, damages for loss of revenue, profits, goodwill, data, or other intangible losses, even if we have been advised of the possibility of such damages.</p>
        </section>

        <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Related Pages</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Link href="/terms" className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Terms &amp; Conditions</Link>
            <Link href="/privacy-policy" className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="/responsible-gaming" className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-center text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Responsible Gaming</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
