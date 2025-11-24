/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_TICKETMASTER_API_KEY: string
  readonly VITE_EVENTBRITE_API_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_PRICE_MONTHLY: string
  readonly VITE_ADSENSE_CLIENT_ID: string
  readonly VITE_ADSENSE_SLOT_HORIZONTAL: string
  readonly VITE_ADSENSE_SLOT_SQUARE: string
  readonly VITE_RECAPTCHA_SITE_KEY: string
  readonly VITE_FACEBOOK_ACCESS_TOKEN: string
  readonly VITE_INSTAGRAM_ACCESS_TOKEN: string
  readonly VITE_GETYOURGUIDE_API_KEY: string
  readonly VITE_ETKINLIKIO_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
