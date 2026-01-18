import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Globe, ShieldCheck, Sparkles } from 'lucide-react';

const highlights = [
  {
    title: 'Etkinlikleri Tek Yerde Topla',
    description: 'Konser, festival, spor, tiyatro ve daha fazlasini tek akistan kesfet.',
  },
  {
    title: 'Haritada Gez, Aninda Bul',
    description: 'Yakinindaki etkinlikleri harita uzerinden gorup hizlica katil.',
  },
  {
    title: 'Sinirsiz Etkinlik Paylas',
    description: 'Herkes istedigi kadar etkinlik olusturabilir ve paylasabilir.',
  },
];

const trustPoints = [
  'Sinirsiz etkinlik olusturma',
  'Etkinliklere katilanlari goruntule',
  'Kullanici verileri Supabase ile guvende',
];

export default function Landing() {
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[var(--accent-20)] blur-[120px]" />
          <div className="absolute top-20 left-0 h-72 w-72 rounded-full bg-[var(--accent-15)] blur-[140px]" />
        </div>

        <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--surface-2)] border border-[var(--border)]">
              <Sparkles className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Socia</p>
              <p className="text-lg font-semibold">Etkinlik Agi</p>
            </div>
          </div>
          <Link
            to="/app"
            className="hidden items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90 md:inline-flex"
          >
            Uygulamayi Ac
            <ArrowRight className="h-4 w-4" />
          </Link>
        </header>

        <section className="relative z-10 mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs uppercase tracking-[0.25em] text-[var(--muted)]">
              <Globe className="h-4 w-4" />
              Turkiye odakli etkinlik kesfi
            </div>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Sehirdeki en iyi etkinlikleri tek akista bul.
            </h1>
            <p className="text-base text-[var(--muted)] md:text-lg">
              Socia, Istanbul'dan Antalya'ya kadar konser, festival, spor ve kultur etkinliklerini
              modern bir arayuzle bir araya getirir. Ucretsiz katil, etkinlikleri kesfet.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Hemen Basla
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/terms"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface-2)]"
              >
                Sartlar ve Kosullar
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-[var(--muted)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Guvenli kullanici deneyimi
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1">
                PWA + Android destegi
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-lg">
            <div className="space-y-4">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-5">
                <p className="text-sm text-[var(--muted)]">Herkes Icin</p>
                <p className="text-4xl font-semibold">
                  Ucretsiz
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Tum kullanicilar icin sinirsiz etkinlik olusturma ve kesif.
                </p>
                <Link
                  to="/app"
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Uygulamayi Ac
                </Link>
              </div>
              <div className="space-y-3">
                {trustPoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-sm text-[var(--muted)]"
                  >
                    <CheckCircle className="mt-0.5 h-4 w-4 text-[#4fb07a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map((item) => (
            <div
              key={item.title}
              className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:bg-[var(--surface-2)]"
            >
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm text-[var(--muted)]">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-4xl border border-[var(--border)] bg-[var(--surface)] px-8 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">YASAL BILGILER</p>
              <h2 className="mt-2 text-2xl font-semibold">Guvenli ve seffaf bir deneyim</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                Iade, gizlilik ve kullanim sartlari net sekilde paylasilir. Detaylar icin ilgili
                sayfalari ziyaret edebilirsiniz.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/privacy"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                Gizlilik
              </Link>
              <Link
                to="/terms"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                Kullanim Sartlari
              </Link>
              <Link
                to="/refund"
                className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-5 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--surface)]"
              >
                Iade Politikasi
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pb-10 text-sm text-[var(--muted)] md:flex-row md:items-center md:justify-between">
        <p>© 2025 Socia. Tum haklari saklidir.</p>
        <p>
          Iletisim: <span className="text-[var(--text)]">sociaappsup@outlook.com</span>
        </p>
      </footer>
    </div>
  );
}
