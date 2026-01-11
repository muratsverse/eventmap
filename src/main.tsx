import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import App from './App.tsx'
import Landing from './pages/Landing.tsx'
import PremiumSuccessView from './components/views/PremiumSuccessView.tsx'
import PremiumCancelledView from './components/views/PremiumCancelledView.tsx'
import AuthCallbackView from './components/views/AuthCallbackView.tsx'
import TermsOfService from './pages/TermsOfService.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import RefundPolicy from './pages/RefundPolicy.tsx'
import './index.css'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/app" element={<App />} />
            <Route path="/auth/callback" element={<AuthCallbackView />} />
            <Route path="/premium-success" element={<PremiumSuccessView />} />
            <Route path="/premium-cancelled" element={<PremiumCancelledView />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/refund" element={<RefundPolicy />} />
            {/* Catch-all route: Tüm bilinmeyen path'leri ana sayfaya yönlendir */}
            <Route path="*" element={<App />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
