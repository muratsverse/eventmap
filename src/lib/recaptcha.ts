// ReCAPTCHA Configuration
// For production, set this in your .env file: VITE_RECAPTCHA_SITE_KEY

export const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

// Check if ReCAPTCHA is configured
export const isRecaptchaConfigured = () => {
  return Boolean(RECAPTCHA_SITE_KEY);
};

// Verify ReCAPTCHA token on the backend
export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  try {
    // In production, this should call your backend API
    // which then verifies the token with Google's API
    // Backend verification prevents exposing your secret key

    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('ReCAPTCHA verification error:', error);
    return false;
  }
}

// Rate limiting: Track submissions by IP or user
const submissionTimestamps: Map<string, number[]> = new Map();
const MAX_SUBMISSIONS_PER_HOUR = 5;
const ONE_HOUR_MS = 60 * 60 * 1000;

export function checkRateLimit(userId: string): { allowed: boolean; remainingTime?: number } {
  const now = Date.now();
  const userSubmissions = submissionTimestamps.get(userId) || [];

  // Remove submissions older than 1 hour
  const recentSubmissions = userSubmissions.filter(timestamp => now - timestamp < ONE_HOUR_MS);

  if (recentSubmissions.length >= MAX_SUBMISSIONS_PER_HOUR) {
    const oldestSubmission = Math.min(...recentSubmissions);
    const remainingTime = ONE_HOUR_MS - (now - oldestSubmission);
    return { allowed: false, remainingTime };
  }

  // Add current submission
  recentSubmissions.push(now);
  submissionTimestamps.set(userId, recentSubmissions);

  return { allowed: true };
}

export function formatRemainingTime(ms: number): string {
  const minutes = Math.ceil(ms / 60000);
  if (minutes < 60) {
    return `${minutes} dakika`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} saat`;
  }
  return `${hours} saat ${remainingMinutes} dakika`;
}
