import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FIREBASE_PROJECT_ID = Deno.env.get("FIREBASE_PROJECT_ID")!;
const FIREBASE_CLIENT_EMAIL = Deno.env.get("FIREBASE_CLIENT_EMAIL")!;
const FIREBASE_PRIVATE_KEY = Deno.env.get("FIREBASE_PRIVATE_KEY")!.replace(
  /\\n/g,
  "\n"
);

// Generate JWT for Firebase OAuth2
async function getFirebaseAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: FIREBASE_CLIENT_EMAIL,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

  const headerB64 = encode(header);
  const payloadB64 = encode(payload);
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const pemContents = FIREBASE_PRIVATE_KEY.replace(
    /-----BEGIN PRIVATE KEY-----/,
    ""
  )
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s/g, "");

  const binaryKey = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));

  const key = await crypto.subtle.importKey(
    "pkcs8",
    binaryKey,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(unsignedToken)
  );

  const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const jwt = `${unsignedToken}.${signatureB64}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  const tokenData = await tokenRes.json();
  return tokenData.access_token;
}

// Send FCM v1 message
async function sendFCM(
  accessToken: string,
  deviceToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  const url = `https://fcm.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/messages:send`;

  const message: any = {
    message: {
      token: deviceToken,
      notification: { title, body },
      android: {
        priority: "high",
        notification: {
          channel_id: "default",
          sound: "default",
        },
      },
    },
  };

  if (data) {
    message.message.data = data;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error(`FCM error for token ${deviceToken.slice(0, 10)}...:`, error);
    return { success: false, error };
  }

  return { success: true };
}

Deno.serve(async (req) => {
  try {
    // Verify request (webhook from Supabase or manual call)
    const body = await req.json();

    // If called by database webhook, event data is in body.record
    // If called manually, expect { title, body, event_id }
    let title: string;
    let notifBody: string;
    let eventId: string | undefined;

    if (body.record && body.record.status === "approved") {
      // Database webhook: event was just approved
      title = "Yeni Etkinlik! 🎉";
      notifBody = body.record.title;
      eventId = body.record.id;
    } else if (body.title && body.body) {
      // Manual call
      title = body.title;
      notifBody = body.body;
      eventId = body.event_id;
    } else {
      return new Response(JSON.stringify({ message: "No action needed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get all push tokens
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: tokens, error } = await supabase
      .from("push_tokens")
      .select("token");

    if (error) throw error;
    if (!tokens || tokens.length === 0) {
      return new Response(
        JSON.stringify({ message: "No tokens found", sent: 0 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get Firebase access token
    const accessToken = await getFirebaseAccessToken();

    // Send to all devices
    const results = await Promise.allSettled(
      tokens.map((t) =>
        sendFCM(accessToken, t.token, title, notifBody, eventId ? { eventId } : undefined)
      )
    );

    const sent = results.filter(
      (r) => r.status === "fulfilled" && r.value.success
    ).length;
    const failed = results.length - sent;

    console.log(`Push notifications: ${sent} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ message: "Done", sent, failed, total: tokens.length }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
