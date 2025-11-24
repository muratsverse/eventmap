# ReCAPTCHA Spam Protection Setup

This guide explains how to enable ReCAPTCHA spam protection for event creation.

## Features Implemented

1. **Google ReCAPTCHA v2** - "I'm not a robot" checkbox
2. **Rate Limiting** - Maximum 5 event submissions per hour per user
3. **Graceful Degradation** - Works without ReCAPTCHA if not configured

## Setup Instructions

### 1. Get ReCAPTCHA Keys

1. Go to [Google ReCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" or "+" to register a new site
3. Fill in the form:
   - **Label**: EventMap (or your app name)
   - **reCAPTCHA type**: Select "reCAPTCHA v2" → "I'm not a robot" Checkbox
   - **Domains**: Add your domains:
     - `localhost` (for development)
     - Your production domain (e.g., `eventmap.com`)
   - Accept the terms
4. Click "Submit"
5. You'll receive two keys:
   - **Site Key** (public) - Used in frontend
   - **Secret Key** (private) - Used in backend verification

### 2. Add Site Key to Frontend

Add the site key to your `.env` file:

```bash
# .env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Important**: Only add the **Site Key** (not Secret Key) to the frontend `.env` file.

### 3. Backend Verification (Required for Production)

The frontend is already set up to call `/api/verify-recaptcha`. You need to implement this endpoint.

#### Option A: Supabase Edge Function

Create a Supabase Edge Function:

```bash
supabase functions new verify-recaptcha
```

Add this code to `supabase/functions/verify-recaptcha/index.ts`:

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RECAPTCHA_SECRET_KEY = Deno.env.get('RECAPTCHA_SECRET_KEY')!

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const { token } = await req.json()

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: 'No token provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify with Google
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    })

    const data = await response.json()

    return new Response(JSON.stringify({ success: data.success }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

Deploy the function:

```bash
supabase functions deploy verify-recaptcha --no-verify-jwt
```

Set the secret key:

```bash
supabase secrets set RECAPTCHA_SECRET_KEY=your_secret_key_here
```

#### Option B: Custom Backend

If you have your own backend, create a POST endpoint at `/api/verify-recaptcha`:

```javascript
// Express.js example
app.post('/api/verify-recaptcha', async (req, res) => {
  const { token } = req.body;

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  });

  const data = await response.json();
  res.json({ success: data.success });
});
```

### 4. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try to create an event:
   - If ReCAPTCHA is configured, you'll see the checkbox
   - If not configured, form will work without ReCAPTCHA (graceful degradation)

3. Test rate limiting:
   - Try creating 6 events in a row
   - After 5 events, you should see a rate limit message

## Rate Limiting Details

- **Limit**: 5 events per hour per user
- **Tracking**: By user ID (requires authentication)
- **Reset**: Automatically resets after 1 hour from the oldest submission
- **Message**: Shows remaining time in Turkish (e.g., "45 dakika", "1 saat 15 dakika")

## Security Best Practices

1. **Never expose Secret Key**: Only use it on the backend
2. **Always verify on backend**: Frontend ReCAPTCHA can be bypassed
3. **Combine with rate limiting**: ReCAPTCHA alone is not enough
4. **Monitor submissions**: Check for patterns of abuse
5. **Use HTTPS**: ReCAPTCHA requires secure connections in production

## Troubleshooting

### ReCAPTCHA not showing

1. Check `.env` file has `VITE_RECAPTCHA_SITE_KEY`
2. Restart the dev server after adding `.env` variables
3. Check browser console for errors

### Verification failing

1. Ensure backend endpoint is accessible
2. Check Secret Key is set correctly on backend
3. Verify CORS is configured properly
4. Check Google ReCAPTCHA admin console for error logs

### Rate limiting not working

1. Ensure user is authenticated (`user.id` must exist)
2. Check browser localStorage for rate limit data
3. Clear browser storage to reset for testing

## Production Checklist

- [ ] Register production domain in Google ReCAPTCHA console
- [ ] Add `VITE_RECAPTCHA_SITE_KEY` to production environment variables
- [ ] Deploy backend verification endpoint
- [ ] Set `RECAPTCHA_SECRET_KEY` in backend environment
- [ ] Test ReCAPTCHA on production domain
- [ ] Monitor ReCAPTCHA stats in Google Admin Console
- [ ] Set up alerts for high verification failure rates

## Optional: Customize ReCAPTCHA Theme

You can change the theme from "dark" to "light" in `CreateEventModal.tsx`:

```typescript
<ReCAPTCHA
  // ... other props
  theme="light" // or "dark"
/>
```

## Rate Limit Configuration

To change rate limits, edit `src/lib/recaptcha.ts`:

```typescript
const MAX_SUBMISSIONS_PER_HOUR = 5; // Change this number
const ONE_HOUR_MS = 60 * 60 * 1000; // Change time window
```

## Next Steps

1. Add database tracking for rate limits (currently uses in-memory Map)
2. Add IP-based rate limiting for non-authenticated users
3. Implement exponential backoff for repeated violations
4. Add admin dashboard to monitor and manage rate limits
5. Consider upgrading to reCAPTCHA v3 for invisible protection
