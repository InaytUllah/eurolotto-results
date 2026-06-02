import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — How We Protect Your Data',
  description: 'Read our privacy policy to understand how Euro Lotto Results collects, uses, and protects your personal data when you use our European lottery results service.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Last updated: March 2026</p>

      <div className="prose dark:prose-dark max-w-none space-y-6 text-gray-700 dark:text-gray-300">
        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">1. Introduction</h2>
          <p>Euro Lotto Results (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. We provide European lottery results including EuroMillions, EuroJackpot, UK Lotto, Thunderball, Set for Life, Irish Lotto, French Loto, La Primitiva, German Lotto 6aus49, and Italian SuperEnalotto. Please read this policy carefully. By using our website, you consent to the practices described below.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">2. Information We Collect</h2>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Automatically Collected Information</h3>
          <p>When you visit our website, we may automatically collect certain information about your device, including your IP address, browser type, operating system, referring URLs, pages visited, and the dates and times of visits. This information is collected through standard web server logs and analytics tools.</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Cookies and Tracking Technologies</h3>
          <p>We use cookies and similar tracking technologies to enhance your browsing experience. Cookies are small text files stored on your device that help us understand how visitors interact with our site, remember preferences, and improve our service. You can control cookies through your browser settings. Disabling cookies may limit certain features of our website.</p>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-2">Information You Provide</h3>
          <p>If you contact us through our contact page, we collect any information you voluntarily provide, such as your name and email address. We only use this information to respond to your inquiry.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">3. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Operate and maintain our website</li>
            <li>Improve user experience and website performance</li>
            <li>Analyse website traffic and usage patterns</li>
            <li>Display relevant lottery results and content</li>
            <li>Respond to your enquiries and support requests</li>
            <li>Detect and prevent technical issues or security threats</li>
            <li>Comply with applicable laws and regulations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">4. Third-Party Services</h2>
          <p>We may use the following third-party services that collect, monitor, and analyse data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google Analytics:</strong> To understand website traffic and user behaviour. Google Analytics uses cookies to collect anonymous data about page views, session duration, and demographics.</li>
            <li><strong>Google AdSense:</strong> To display relevant advertisements. AdSense may use cookies to serve ads based on your browsing history across the web.</li>
            <li><strong>Vercel:</strong> Our hosting provider, which processes server-side requests and may collect access logs.</li>
          </ul>
          <p className="mt-3">Each third-party service has its own privacy policy governing the use of your information. We encourage you to review their policies.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">5. Your Rights Under GDPR</h2>
          <p>If you are located in the European Economic Area (EEA) or the United Kingdom, you have certain rights under the General Data Protection Regulation (GDPR), including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Right of access:</strong> You can request copies of your personal data</li>
            <li><strong>Right to rectification:</strong> You can request correction of inaccurate data</li>
            <li><strong>Right to erasure:</strong> You can request deletion of your personal data</li>
            <li><strong>Right to restrict processing:</strong> You can request limitation of data processing</li>
            <li><strong>Right to object:</strong> You can object to data processing in certain circumstances</li>
            <li><strong>Right to data portability:</strong> You can request transfer of your data</li>
          </ul>
          <p className="mt-3">To exercise any of these rights, please contact us through our contact page. We will respond within 30 days.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">6. Data Security</h2>
          <p>We implement appropriate technical and organisational measures to protect your information against unauthorised access, alteration, disclosure, or destruction. However, no method of transmission over the internet or method of electronic storage is completely secure, and we cannot guarantee absolute security.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">7. Children&apos;s Privacy</h2>
          <p>Our website is not intended for individuals under the age of 18. We do not knowingly collect personal information from minors. If you believe we have inadvertently collected information from a child, please contact us immediately.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">8. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically to stay informed about how we protect your information.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">9. Contact Us</h2>
          <p>If you have questions or concerns about this Privacy Policy or our data practices, please contact us through our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
