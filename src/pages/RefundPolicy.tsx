export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Refund Policy</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Last updated: January 8, 2026</p>

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
            <p className="text-[var(--muted)] mb-4">
              We offer refunds under the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li><strong>Technical Issues:</strong> If you experience technical problems that prevent you from using Premium features and we are unable to resolve them within a reasonable timeframe</li>
              <li><strong>Billing Errors:</strong> If you were charged incorrectly due to a system error</li>
              <li><strong>First-Time Subscribers:</strong> If you request a refund within 7 days of your first subscription payment</li>
              <li><strong>Duplicate Charges:</strong> If you were accidentally charged multiple times for the same subscription period</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Non-Refundable Situations</h2>
            <p className="text-[var(--muted)] mb-2">Refunds will not be provided in the following cases:</p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>You did not use the Premium features during the billing period</li>
              <li>You changed your mind after the 7-day refund window</li>
              <li>Your account was suspended or terminated due to violation of our Terms of Service</li>
              <li>You forgot to cancel before the renewal date</li>
              <li>Partial refunds for unused portions of the subscription period (except in cases of technical issues)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. How to Request a Refund</h2>
            <p className="text-[var(--muted)] mb-4">
              To request a refund, please contact our support team with the following information:
            </p>
            <ul className="list-disc list-inside space-y-2 text-[var(--muted)] ml-4">
              <li>Your account email address</li>
              <li>Transaction ID or receipt</li>
              <li>Reason for the refund request</li>
              <li>Any relevant screenshots or documentation</li>
            </ul>
            <p className="text-[var(--muted)] mt-4">
              Send your refund request to: <strong>sociaappsup@outlook.com</strong>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Refund Processing Time</h2>
            <p className="text-[var(--muted)]">
              Approved refunds will be processed within 5-10 business days. The refund will be credited to the original
              payment method used for the purchase. Depending on your bank or payment provider, it may take an additional
              5-7 business days for the refund to appear in your account.
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
