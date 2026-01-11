export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: January 11, 2026</p>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Subscription Cancellation</h2>
            <p className="text-[var(--muted)]">
              You may cancel your Socia Premium subscription at any time through your account settings or by contacting
              our support team. Upon cancellation, you will continue to have access to Premium features until the end
              of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Refund Eligibility</h2>
            <p className="text-[var(--muted)]">
              You may request a refund within <strong>14 days</strong> of your initial subscription purchase. This 14-day
              refund window applies to first-time subscriptions only and is measured from the day after the purchase.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Refund Process</h2>
            <p className="text-[var(--muted)]">
              Refunds are processed by Paddle, our payment provider. If your refund request is approved, the payment
              will be returned to your original payment method.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
            <p className="text-[var(--muted)] mb-4">
              To request a refund, please contact our support team with your account email address and transaction
              details.
            </p>
            <p className="text-[var(--muted)] mt-4">
              Send your refund request to: <strong>sociaappsup@outlook.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Refund Processing Time</h2>
            <p className="text-[var(--muted)]">
              Approved refunds are typically processed within 5-10 business days. Depending on your bank, it may take
              additional time for the refund to appear in your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Auto-Renewal and Reminders</h2>
            <p className="text-[var(--muted)]">
              Premium subscriptions automatically renew each month. We will send you a reminder email 3 days before your
              renewal date. You can cancel at any time to prevent future charges, and your Premium access will continue
              until the end of your current billing period.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Payment Disputes</h2>
            <p className="text-[var(--muted)]">
              If you have any concerns about a charge, please contact us before initiating a chargeback with your bank.
              Chargebacks may result in suspension of your account. We are committed to resolving all payment issues fairly
              and promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Changes to This Policy</h2>
            <p className="text-[var(--muted)]">
              We reserve the right to modify this Refund Policy at any time. Any changes will be posted on this page with
              an updated revision date. Your continued use of the Service after such changes constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Contact Information</h2>
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
            ← Back to Socia
          </a>
        </div>
      </div>
    </div>
  );
}
