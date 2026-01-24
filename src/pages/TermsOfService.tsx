export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: January 11, 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Business Information</h2>
            <p className="text-[var(--muted)]">
              Legal business name: <strong>muratsverse</strong>. Happenin is operated by muratsverse.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-[var(--muted)]">
              By accessing and using Happenin ("the Service"), you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
            <p className="text-[var(--muted)]">
              Happenin is a social event discovery and management platform that allows users to create, share, and join local events.
              The service is currently provided free of charge.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
            <p className="text-[var(--muted)] mb-2">
              To access certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Free Access</h2>
            <p className="text-[var(--muted)]">
              Happenin is currently provided free of charge. All users can create and share events without limits.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. User Content</h2>
            <p className="text-[var(--muted)]">
              You retain ownership of any content you post on Happenin. By posting content, you grant us a worldwide, non-exclusive,
              royalty-free license to use, display, and distribute your content in connection with the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Prohibited Activities</h2>
            <p className="text-[var(--muted)] mb-2">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>Post false, misleading, or fraudulent event information</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any laws or regulations</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Use the Service for any commercial purposes without our permission</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Termination</h2>
            <p className="text-[var(--muted)]">
              We reserve the right to suspend or terminate your account at any time for violations of these Terms of Service.
              You may delete your account at any time through your account settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-[var(--muted)]">
              Happenin is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use
              of the Service, including but not limited to direct, indirect, incidental, or consequential damages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-[var(--muted)]">
              We reserve the right to modify these terms at any time. We will notify users of any material changes via email
              or through the Service. Continued use of the Service after such changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-[var(--muted)]">
              For questions about these Terms of Service, please contact us at: sociaappsup@outlook.com
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border)]">
          <a href="/" className="text-[var(--accent)] hover:underline">
            ← Back to Happenin
          </a>
        </div>
      </div>
    </div>
  );
}
