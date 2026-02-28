const fs = require('fs');
const path = require('path');

const csvData = `Doğa Yürüyüşü & Bisiklet;Spor;Spor;15.02.2026 11:00;Eymir Gölü;Oran Mahallesi, ODTÜ Arazisi, Gölbaşı;Ankara
Çocuk Oyunu: Bremen Mızıkacıları;Çocuk;Çocuk;15.02.2026 14:00;Panora Sanat Merkezi;Turan Güneş Blv. No:182 (Panora AVM), Oran;Ankara
Sahaf Gezisi & Plak Avı;Nostaljik Kitaplar;Gezi;15.02.2026 15:00;Kızılay Kitapçılar Çarşısı;Atatürk Bulvarı, Zafer Çarşısı Yanı, Kızılay;Ankara
Başka Sinema: "Kuru Otlar Üstüne";Bağımsız Sinema;Sinema;16.02.2026 18:30;Büyülü Fener Kızılay;Kızılay Mah. Hatay Sok. No:18, Çankaya;Ankara
Canlı Caz & Blues;Ankara Klasiği;Müzik;16.02.2026 20:00;Manhattan Bar;Kavaklıdere Mah. Çevre Sok. No:7, Çankaya;Ankara
Bernarda Alba'nın Evi;Devlet Tiyatrosu;Tiyatro;17.02.2026 20:00;Akün Sahnesi;Atatürk Bulvarı No:227, Kavaklıdere, Çankaya;Ankara
Stand-up: Açık Mikrofon;Amatör Komedyenler;Komedi;17.02.2026 20:30;Route Ankara;Meşrutiyet Mah. Selanik Cad. No:70, Kızılay;Ankara
Sergi: Çağdaş Yansımalar;Butik Galeri;Sergi;18.02.2026 14:00;Atlas Sanat Galerisi;Cinnah Cad. No:19, Çankaya;Ankara
Canlı Blues Performansı;Blues Sevenlere;Müzik;18.02.2026 21:30;The Muddy Waters;Güvenevler Mah. Güvenlik Cad. No:95, Ayrancı;Ankara
Memleketimden İnsan Manzaraları;Büyük Oyun;Tiyatro;19.02.2026 20:00;Şinasi Sahnesi;Kavaklıdere Mah. Tunus Cad., Çankaya;Ankara
Nostalji Gecesi (45'likler);Teras Katı;Parti;19.02.2026 21:00;Nefes Bar;Kızılay Mah. Konur Sok. No:43, Çankaya;Ankara
Oda Tiyatrosu: "Sırça Kümes";Butik Tiyatro;Tiyatro;20.02.2026 20:30;Kulis Sanat;Bahçelievler Mah. 69. Sok. No:9, Çankaya;Ankara
DJ Set & Elektronik;Kült Mekan;Parti;20.02.2026 22:00;Siyah Beyaz;Kavaklıdere Mah. Şili Meydanı No:3, Çankaya;Ankara
Heykel & Seramik Atölyesi;Sanat;Atölye;21.02.2026 13:00;Galeri Siyah Beyaz;Kavaklıdere Mah. Şili Meydanı No:3, Çankaya;Ankara
Alternatif Rock Konseri;Genç Kitle;Konser;21.02.2026 21:00;Telwe Performance;Meşrutiyet Mah. Konur Sok. No:19, Kızılay;Ankara
Fasıl Gecesi;Rakı & Müzik;Müzik;21.02.2026 21:00;Meyhane Aşina;Kavaklıdere Mah. Bestekar Cad. No:36, Çankaya;Ankara
Pazar Yürüyüşü;Köpek Dostu;Spor;22.02.2026 10:00;Seğmenler Parkı;Çankaya Mah. Atatürk Bulvarı, Çankaya;Ankara
Modern Sanat Turu;Şehir Dışı;Sergi;22.02.2026 15:00;Müze Evliyagil;İncek Mah. Turgut Özal Bulvarı Şevket Evliyagil Sok. No:1, Gölbaşı;Ankara
Rahmi Koç Müzesi Gezisi;Tarihi Atmosfer;Müze;15.02.2026 11:00;Çengelhan Rahmi M. Koç Müzesi;Kale Mah. Depo Sok. No:1, Altındağ (Kale Karşısı);Ankara
Voodoo Blues Night;Ankara'nın En Eski Blues Barı;Müzik;16.02.2026 21:00;Voodoo Blues;Kavaklıdere Mah. Tunus Cad. No:50, Çankaya;Ankara
Güneşin Sofrası;AVM İçi Tiyatro;Tiyatro;17.02.2026 20:00;Arcadium Sahne;Koru Mah. 2432. Cad. Arcadium AVM, Çayyolu;Ankara
Underground Rock Party;Salaş & Samimi;Parti;18.02.2026 21:00;Haymatlos Mekan;Kızılay Mah. Konur Sok. No:73, Çankaya;Ankara
Akustik Söyleşi & Sergi;Fotoğraf Sanatı;Sanat;19.02.2026 19:30;Ka Atölye;Güvenevler Mah. Cinnah Cad. No:57, Çankaya;Ankara
Yıldız Tilbe (Gala);Lüks Yemekli Sahne;Konser;20.02.2026 22:00;Winner İncek;İncek Mah. Turgut Özal Bulv. No:53, Gölbaşı;Ankara
Madrigal;Açık Hava Sahnesi;Konser;21.02.2026 21:00;IF Performance Armada;Eskişehir Yolu 6.Km Armada AVM Hayat Sokağı, Söğütözü;Ankara
Caz & Şarap Gecesi;Kitap Kafe;Müzik;21.02.2026 20:30;Kakule Kahve;Kızılay Mah. Kızılırmak Cad. No:17, Çankaya;Ankara
Köy Havası & Kahvaltı;Şehir İçinde Köy;Gezi;22.02.2026 10:00;Altınköy Açık Hava Müzesi;Beşikkaya Mah. 2044. Sok., Altındağ;Ankara`;

const creatorId = 'b9a714fa-db62-47d4-b5d9-4e723646a3d5';
const organizer = 'muratveozturk@gmail.com';
const baseTs = 1771100000146; // Continue from previous batch
const now = '2026-02-14 12:00:00+00';

const imageMap = {
  'Konser': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
  'Tiyatro': 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=600&fit=crop',
  'Parti': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop',
  'Atölye': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop',
  'Komedi': 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop',
  'Sergi': 'https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop',
  'Müzik': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop',
  'Çocuk': 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop',
  'Yarışma': 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=600&fit=crop',
  'Spor': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop',
  'Gösteri': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
  'Show': 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop',
  'Keyif': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop',
  'Gezi': 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop',
  'Müzikal': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop',
  'Sinema': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop',
  'Opera': 'https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=800&h=600&fit=crop',
  'Dans': 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop',
  'Bar': 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop',
  'Talk Show': 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop',
  'Kültür': 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop',
  'Sosyal': 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
  'Eğlence': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop',
  'Müze': 'https://images.unsplash.com/photo-1565006248897-fe6d25ccf01f?w=800&h=600&fit=crop',
  'Sanat': 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=600&fit=crop',
};
const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop';

const venueCoords = {
  'Eymir Gölü': [39.7850, 32.7800],
  'Panora Sanat Merkezi': [39.8900, 32.8000],
  'Kızılay Kitapçılar Çarşısı': [39.9200, 32.8540],
  'Büyülü Fener Kızılay': [39.9210, 32.8550],
  'Manhattan Bar': [39.9080, 32.8580],
  'Akün Sahnesi': [39.9100, 32.8590],
  'Route Ankara': [39.9210, 32.8560],
  'Atlas Sanat Galerisi': [39.9070, 32.8540],
  'The Muddy Waters': [39.9030, 32.8650],
  'Şinasi Sahnesi': [39.9080, 32.8600],
  'Nefes Bar': [39.9200, 32.8550],
  'Kulis Sanat': [39.9220, 32.8310],
  'Siyah Beyaz': [39.9090, 32.8570],
  'Galeri Siyah Beyaz': [39.9090, 32.8570],
  'Telwe Performance': [39.9200, 32.8545],
  'Meyhane Aşina': [39.9097, 32.8585],
  'Seğmenler Parkı': [39.9150, 32.8550],
  'Müze Evliyagil': [39.8500, 32.8300],
  'Çengelhan Rahmi M. Koç Müzesi': [39.9420, 32.8630],
  'Voodoo Blues': [39.9080, 32.8610],
  'Arcadium Sahne': [39.8700, 32.7450],
  'Haymatlos Mekan': [39.9200, 32.8550],
  'Ka Atölye': [39.9070, 32.8540],
  'Winner İncek': [39.8500, 32.8350],
  'IF Performance Armada': [39.8850, 32.8100],
  'Kakule Kahve': [39.9200, 32.8580],
  'Altınköy Açık Hava Müzesi': [39.9550, 32.8720],
};

const cityFallback = {
  'Ankara': [39.9208, 32.8541],
};

function esc(str) {
  return str.replace(/'/g, "''");
}

const lines = csvData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const sqlLines = [];

sqlLines.push(`-- Extra Events Batch Insert - Generated 2026-02-14`);
sqlLines.push(`-- Total events: ${lines.length}`);
sqlLines.push('');

lines.forEach((line, i) => {
  const parts = line.split(';');
  if (parts.length < 7) return;

  const title = parts[0].trim();
  const description = parts[1].trim();
  const category = parts[2].trim();
  const dateTimeStr = parts[3].trim();
  const location = parts[4].trim();
  const address = parts[5].trim();
  const city = parts[6].trim();

  // Parse date/time: DD.MM.YYYY HH:MM -> YYYY-MM-DD
  const dtParts = dateTimeStr.split(' ');
  const dateParts = dtParts[0].split('.');
  const dateVal = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  const timeVal = dtParts[1];

  // Generate unique ID
  const id = `user-${creatorId}-${baseTs + i}`;

  // Get image URL
  const imageUrl = imageMap[category] || defaultImage;

  // Get coordinates
  let coords = venueCoords[location];
  if (!coords) {
    const fallback = cityFallback[city] || [39.9208, 32.8541];
    coords = [
      fallback[0] + ((i * 0.0003) % 0.01),
      fallback[1] + ((i * 0.0002) % 0.01),
    ];
  }
  const lat = coords[0].toFixed(8);
  const lon = coords[1].toFixed(8);

  const sql = `INSERT INTO "public"."events" ("id", "created_at", "updated_at", "title", "description", "category", "image_url", "date", "time", "location", "city", "price_min", "price_max", "organizer", "attendees", "latitude", "longitude", "location_point", "is_premium", "source", "creator_id", "address", "end_time", "status", "rejection_reason", "submitted_at", "reviewed_at", "reviewed_by", "report_count", "max_attendees", "hidden_at") VALUES ('${id}', '${now}', '${now}', '${esc(title)}', '${esc(description)}', '${esc(category)}', '${imageUrl}', '${dateVal}', '${timeVal}', '${esc(location)}', '${esc(city)}', '0', '0', '${organizer}', '0', '${lat}', '${lon}', ST_SetSRID(ST_MakePoint(${lon}, ${lat}), 4326), 'false', 'user-created', '${creatorId}', '${esc(address)}', null, 'approved', null, '${now}', '${now}', '${creatorId}', '0', null, null);`;

  sqlLines.push(sql);
});

sqlLines.push('');
sqlLines.push('-- Update location_point for all inserted events (fallback if ST_MakePoint not available inline)');
sqlLines.push("-- UPDATE public.events SET location_point = ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326) WHERE location_point IS NULL AND source = 'user-created';");

const outputPath = path.join(__dirname, 'events_extra_batch.sql');
fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf8');

console.log(`SQL file generated: ${outputPath}`);
console.log(`Total events: ${lines.length}`);
