import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Rules for Using Our Service',
  description: 'Terms and conditions for using Euro Lotto Results. Understand the rules, disclaimers and limitations of our European lottery results information service.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Terms &amp; Conditions</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: March 2026</p>

      <div className="prose dark:prose-dark max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Euro Lotto Results (&quot;the Website&quot;), you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, you must not use our website. These terms apply to all visitors, users, and others who access or use the service. The Website provides lottery results information for EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Nature of Our Service</h2>
          <p>Euro Lotto Results is an independent information service. We are <strong>NOT</strong> a lottery operator, betting company, or gambling service. We do not sell lottery tickets, accept bets, or facilitate any form of gambling. Our sole purpose is to provide lottery draw results, statistical analysis, and educational content about European lotteries. We are not affiliated with, endorsed by, or connected to any official lottery organisation including Camelot, Francaise des Jeux, Loterias y Apuestas del Estado, DLTB, Sisal, or any other lottery operator.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. Results Accuracy</h2>
          <p>While we make every effort to ensure the accuracy of lottery results displayed on our website, we cannot guarantee that results are always correct or up to date. Lottery results are sourced from publicly available information and third-party data providers. <strong>You must always verify results against official lottery operator websites before claiming any prizes.</strong> We accept no liability for any errors, omissions, or delays in the results displayed on our website.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Predictions Disclaimer</h2>
          <p>Any predictions, number analysis, hot and cold numbers, or statistical content provided on this website is for informational and entertainment purposes only. Lottery draws are random events and past results do not influence future outcomes. We make no claims or guarantees that any prediction method, system, or analysis can improve your chances of winning. Do not rely on our predictions when making financial decisions about lottery play.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Age Restriction</h2>
          <p>Lottery participation is restricted to individuals aged 18 years and over in most European countries. Our website content is intended for adults only. By using this website, you confirm that you are at least 18 years of age. We do not encourage or promote lottery play by minors under any circumstances.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. User Responsibilities</h2>
          <p>Users of this website agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the website only for lawful purposes and in accordance with these terms</li>
            <li>Verify all lottery results against official sources before taking any action</li>
            <li>Not attempt to access, alter, or damage the website or its underlying systems</li>
            <li>Not reproduce, distribute, or commercially exploit our content without permission</li>
            <li>Gamble responsibly and within their financial means</li>
            <li>Seek help if they believe they have a gambling problem</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Intellectual Property</h2>
          <p>All content on this website, including text, graphics, logos, images, data compilations, and software, is the property of Euro Lotto Results or its content suppliers and is protected by international copyright laws. Our statistical analyses, frequency tables, and prediction algorithms are our original work. You may not reproduce, distribute, modify, or create derivative works from our content without express written consent.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Third-Party Links</h2>
          <p>Our website may contain links to third-party websites, including official lottery operators and responsible gambling organisations. These links are provided for your convenience and information only. We do not endorse, control, or accept responsibility for the content, privacy policies, or practices of any third-party websites. You access third-party websites at your own risk.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Euro Lotto Results shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of this website, including but not limited to reliance on lottery results displayed, use of prediction tools, or any financial decisions made based on our content. This includes damages for loss of profits, goodwill, data, or other intangible losses.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">10. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from or related to these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales. If any provision of these terms is found to be unenforceable, the remaining provisions shall continue in full force and effect.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">11. Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Changes will be effective immediately upon posting to this page. Your continued use of the website after changes are posted constitutes your acceptance of the updated terms. We recommend reviewing these terms regularly.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">12. Contact</h2>
          <p>If you have any questions about these Terms and Conditions, please contact us through our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
