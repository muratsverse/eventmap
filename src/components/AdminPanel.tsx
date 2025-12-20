import { useState } from 'react';
import { RefreshCw, Download, Database, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useEventSync } from '@/hooks/useEventSync';
import { useScraper } from '@/hooks/useScraper';

interface SyncSource {
  id: string;
  name: string;
  enabled: boolean;
  description: string;
  status?: 'success' | 'error' | 'pending';
}

const availableSources: SyncSource[] = [
  {
    id: 'ticketmaster',
    name: 'Ticketmaster',
    enabled: true,
    description: 'Global event platform',
  },
  {
    id: 'eventbrite',
    name: 'Eventbrite',
    enabled: true,
    description: 'Event management platform',
  },
  {
    id: 'etkinlikio',
    name: 'Etkinlik.io',
    enabled: false,
    description: 'Turkish event aggregator',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    enabled: false,
    description: 'Social media events',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    enabled: false,
    description: 'Social media events',
  },
];

export default function AdminPanel() {
  const { syncAll, syncSources, isSyncing, stats } = useEventSync();
  const { scrapeEvents, isScraping, result: scrapeResult } = useScraper();

  const [selectedSources, setSelectedSources] = useState<string[]>(
    availableSources.filter((s) => s.enabled).map((s) => s.id)
  );
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const toggleSource = (sourceId: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleSyncAll = async () => {
    try {
      const result = await syncAll();
      setLastSync(new Date());
      alert(`✅ ${result.total} etkinlik eklendi!\n\nDetaylar:\n${result.results.map(r => `${r.source}: ${r.count}`).join('\n')}`);
    } catch (error) {
      alert('❌ Sync hatası: ' + (error as Error).message);
    }
  };

  const handleSyncSelected = async () => {
    if (selectedSources.length === 0) {
      alert('Lütfen en az bir kaynak seçin');
      return;
    }

    try {
      const result = await syncSources(selectedSources);
      setLastSync(new Date());
      alert(`✅ ${result.total} etkinlik eklendi!`);
    } catch (error) {
      alert('❌ Sync hatası: ' + (error as Error).message);
    }
  };

  const handleScrape = async () => {
    try {
      const result = await scrapeEvents();
      alert(`✅ Web scraping tamamlandı!\n${result.stats?.successful} etkinlik eklendi.`);
    } catch (error) {
      alert('❌ Scraping hatası: ' + (error as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl flex items-center justify-center">
            <Database className="w-6 h-6 text-[var(--text)]" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-[var(--text)]">Admin Panel</h2>
            <p className="text-[var(--muted)] text-sm">Etkinlik yönetimi ve senkronizasyon</p>
          </div>
        </div>

        {lastSync && (
          <div className="text-sm text-[var(--muted)] flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Son sync: {lastSync.toLocaleString('tr-TR')}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)]">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Hızlı İşlemler</h3>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="rounded-xl p-4 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-6 h-6 text-[var(--accent)] mb-2 ${isSyncing ? 'animate-spin' : ''}`} />
            <div className="text-[var(--text)] font-medium text-sm">Tümünü Sync Et</div>
            <div className="text-[var(--muted)] text-xs mt-1">Tüm kaynaklar</div>
          </button>

          <button
            onClick={handleScrape}
            disabled={isScraping}
            className="rounded-xl p-4 bg-[var(--surface)] border border-[var(--border)] hover:bg-[var(--surface-2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className={`w-6 h-6 text-[var(--accent)] mb-2 ${isScraping ? 'animate-bounce' : ''}`} />
            <div className="text-[var(--text)] font-medium text-sm">Web Scraping</div>
            <div className="text-[var(--muted)] text-xs mt-1">Biletix, Bubilet</div>
          </button>
        </div>
      </div>

      {/* Source Selection */}
      <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--text)]">Etkinlik Kaynakları</h3>
          <button
            onClick={handleSyncSelected}
            disabled={isSyncing || selectedSources.length === 0}
            className="px-4 py-2 bg-[var(--accent)] rounded-xl text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Seçilenleri Sync Et
          </button>
        </div>

        <div className="space-y-3">
          {availableSources.map((source) => (
            <button
              key={source.id}
              onClick={() => toggleSource(source.id)}
              className={`w-full rounded-xl p-4 text-left transition-all border ${
                selectedSources.includes(source.id)
                  ? 'border-[var(--accent)] bg-[var(--accent-10)]'
                  : 'bg-[var(--surface)] border-[var(--border)] hover:bg-[var(--surface-2)]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      selectedSources.includes(source.id)
                        ? 'bg-[var(--accent)]'
                        : 'bg-[var(--surface-2)] border border-[var(--border)]'
                    }`}
                  >
                    {selectedSources.includes(source.id) ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      <XCircle className="w-5 h-5 text-[var(--muted)]" />
                    )}
                  </div>
                  <div>
                    <div className="text-[var(--text)] font-medium">{source.name}</div>
                    <div className="text-[var(--muted)] text-xs">{source.description}</div>
                  </div>
                </div>

                {!source.enabled && (
                  <span className="text-xs text-[#d3a253] bg-[#d3a253]/15 px-2 py-1 rounded-lg">
                    API Key Gerekli
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Son Sync İstatistikleri</h3>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-[var(--text)]">{stats.total}</div>
              <div className="text-[var(--muted)] text-xs">Toplam</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-[#4fb07a]">{stats.successful}</div>
              <div className="text-[var(--muted)] text-xs">Başarılı</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-red-300">{stats.failed}</div>
              <div className="text-[var(--muted)] text-xs">Başarısız</div>
            </div>
          </div>

          <div className="space-y-2">
            {stats.results.map((result) => (
              <div
                key={result.source}
                className="flex items-center justify-between p-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-xl"
              >
                <span className="text-[var(--text)] text-sm">{result.source}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--muted)] text-sm">{result.count} etkinlik</span>
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-[#4fb07a]" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 text-center text-[var(--muted)] text-xs">
            Süre: {stats.duration}ms
          </div>
        </div>
      )}

      {/* Scraper Result */}
      {scrapeResult && (
        <div className="rounded-2xl p-6 bg-[var(--surface)] border border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Scraping Sonucu</h3>
          <div className="text-[var(--muted)] text-sm">
            <p>{scrapeResult.message}</p>
            {scrapeResult.stats && (
              <div className="mt-2 text-[var(--muted)]">
                Toplam: {scrapeResult.stats.total} |
                Başarılı: {scrapeResult.stats.successful} |
                Başarısız: {scrapeResult.stats.failed}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Warning */}
      <div className="rounded-2xl p-6 border-l-4 border-[#d3a253] bg-[var(--surface)] border border-[var(--border)]">
        <p className="text-[var(--muted)] text-sm">
          ⚠️ <strong>Önemli:</strong> API key'leri .env dosyasına eklemeyi unutmayın.
          Detaylar için <code className="text-[var(--accent)]">API_SETUP_GUIDE.md</code> dosyasına bakın.
        </p>
      </div>
    </div>
  );
}
