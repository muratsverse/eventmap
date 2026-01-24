export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: January 11, 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. 14-Day Refund Window</h2>
            <p className="text-[var(--muted)]">
              You may request a refund within <strong>14 days</strong> of your initial purchase. The 14-day period starts
              on the day after your purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Refund Process</h2>
            <p className="text-[var(--muted)]">
              Approved refunds are returned to the original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. How to Request a Refund</h2>
            <p className="text-[var(--muted)] mb-4">
              To request a refund, please contact our support team with your account email address and transaction
              details.
            </p>
            <p className="text-[var(--muted)] mt-4">
              Send your refund request to: <strong>sociaappsup@outlook.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Processing Time</h2>
            <p className="text-[var(--muted)]">
              Approved refunds are typically processed within 5-10 business days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Contact Information</h2>
            <p className="text-[var(--muted)]">
              For questions about this Refund Policy or to request a refund, please contact us at:
              <br />
              <strong>Email:</strong> sociaappsup@outlook.com
              <br />
              <strong>Response Time:</strong> We aim to respond to all refund requests within 24-48 hours
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
