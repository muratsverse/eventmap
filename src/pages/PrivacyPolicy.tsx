export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: January 8, 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
            <p className="text-[var(--muted)] mb-4">
              We collect information you provide directly to us when you create an account, create events, or use our services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li><strong>Account Information:</strong> Email address, name, profile picture</li>
              <li><strong>Event Information:</strong> Event details, descriptions, locations, images</li>
              <li><strong>Usage Information:</strong> Events attended, created events, search history</li>
              <li><strong>Location Data:</strong> Approximate location for event discovery (with your permission)</li>
              <li><strong>Payment Information:</strong> Processed securely through Paddle (we do not store credit card details)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
            <p className="text-[var(--muted)] mb-2">We use the collected information to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and manage subscriptions</li>
              <li>Send you notifications about events and service updates</li>
              <li>Personalize your experience and show relevant events</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
            <p className="text-[var(--muted)] mb-4">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li><strong>Public Events:</strong> Event information you create is visible to other users</li>
              <li><strong>Service Providers:</strong> Third-party services that help us operate (e.g., Supabase for hosting, Paddle for payments)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
            <p className="text-[var(--muted)]">
              We implement industry-standard security measures to protect your personal information. However, no method of
              transmission over the internet is 100% secure. We use encryption, secure authentication, and regularly update
              our security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Your Rights and Choices</h2>
            <p className="text-[var(--muted)] mb-2">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>Access and review your personal information</li>
              <li>Update or correct your information through account settings</li>
              <li>Delete your account and associated data</li>
              <li>Opt-out of marketing communications</li>
              <li>Request a copy of your data</li>
              <li>Object to certain data processing activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
            <p className="text-[var(--muted)]">
              We use cookies and similar technologies to improve your experience, analyze usage patterns, and personalize
              content. You can control cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Third-Party Services</h2>
            <p className="text-[var(--muted)] mb-2">We use the following third-party services:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li><strong>Supabase:</strong> Database and authentication hosting</li>
              <li><strong>Paddle:</strong> Payment processing and subscription management</li>
              <li><strong>Google OAuth:</strong> Optional sign-in authentication</li>
              <li><strong>OpenStreetMap:</strong> Map and location services</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
            <p className="text-[var(--muted)]">
              Socia is not intended for users under 13 years of age. We do not knowingly collect personal information from
              children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. International Data Transfers</h2>
            <p className="text-[var(--muted)]">
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Policy</h2>
            <p className="text-[var(--muted)]">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by email
              or through the Service. Your continued use after such changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p className="text-[var(--muted)]">
              For questions or concerns about this Privacy Policy or our data practices, please contact us at:
              sociaapp@outlook.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <a href="/" className="text-[var(--accent)] hover:underline">
            ← Back to Socia
          </a>
        </div>
      </div>
    </div>
  );
}
