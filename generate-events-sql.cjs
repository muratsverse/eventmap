const fs = require('fs');
const path = require('path');

const csvData = `The Godfather Okuması;Kültür Sanat;Atölye;15.02.2026 13:00;CerModern;Anafartalar Mah. Altınsoy Cad. No:3, Sıhhıye, Altındağ;Ankara
Punch Atölyesi;Hobi / Butik;Atölye;15.02.2026 14:00;NOA Coffee & Art;Mustafa Kemal Mah. 2096. Sk. Barış Sitesi No:28, Çankaya;Ankara
Niloya Müzikal;Aile İçin;Çocuk;15.02.2026 14:00;Bergüzar Sahne;Ergazi Mah. Batı Bulvarı 109/C, Yenimahalle;Ankara
Quiz Night: FB;Fanatiklere Özel;Yarışma;15.02.2026 15:00;GreyShake Coffee;Bağlıca Mah. Etimesgut Bulvarı D:110, Etimesgut;Ankara
Bir İdam Mahkumunun Son Günü;Edebiyat Uyarlaması;Tiyatro;15.02.2026 19:00;Tatbikat Sahnesi;Güvenevler Mah. Farabi Sok. No:34, Çankaya;Ankara
Küçük Bir Aşk Masalı;Devlet Tiyatrosu;Tiyatro;15.02.2026 20:00;CSO Ada Ankara;Talatpaşa Bulvarı, No: 38 Opera, Altındağ;Ankara
Shrek's Swamp Party;Kostümlü / Absürt;Parti;15.02.2026 20:00;Müjgân 100. Yıl;İşçi Blokları Mah. 1533. Sk. No:2/24, Çankaya;Ankara
Ceylan Ertem;Popüler;Konser;15.02.2026 20:00;Jolly Joker Ankara;Kavaklıdere, Kızılırmak Cad. No:14, Çankaya;Ankara
Uzi;Rap / Genç;Konser;15.02.2026 20:00;Milyon Performance;Bahçelievler, Azerbaycan Cad. No:41, Çankaya;Ankara
Emre Aydın;Popüler Rock;Konser;15.02.2026 20:30;MEB Şura Salonu;Emniyet Mah. Gazeteci Yazar Muammer Yaşar Bostancı Cd., Beşevler;Ankara
Sefa Doğanay Show;Komedi;Gösteri;15.02.2026 20:30;Nazım Hikmet KM;Mehmet Akif Ersoy Mah. Bağdat Cad. No:50, Yenimahalle;Ankara
ODTÜ Komedi Topluluğu;Öğrenci Dostu;Komedi;15.02.2026 20:30;Editör Dükkan;Ayrancı Mah. Alaçam Sok. No:17/B, Çankaya;Ankara
Faili Meçhul;Butik;Talk Show;15.02.2026 20:30;Coffee UP;Bahçelievler Mah. Azerbaycan Cad. No:23, Çankaya;Ankara
Onurr;Yeni Nesil Pop;Konser;15.02.2026 21:00;Lola Kitchen;Kuzu Effect AVM, Oran Mah. Zülfü Tiğrel Cad., Çankaya;Ankara
Mikail Turan;Alternatif;Konser;15.02.2026 21:00;IF Performance Tunus;Tunus Cad. No:14/A, Kavaklıdere, Çankaya;Ankara
Trivia Night;Bilgi Yarışması;Yarışma;16.02.2026 20:30;Coffee UP;Bahçelievler Mah. Azerbaycan Cad. No:23, Çankaya;Ankara
Lafazans Stand Up;Giriş Uygun;Komedi;17.02.2026 20:00;Berlin Cafe Pub;Selanik Cad. No:67/A, Kızılay, Çankaya;Ankara
Cevdet Bağca;Halk Müziği;Konser;17.02.2026 20:00;Korkut Ata KM;Ayyıldız Mah. Ahimesut Bulvarı No:16, Etimesgut;Ankara
Dağınık;Alternatif Rock;Konser;17.02.2026 21:00;6:45 KK Ankara;Tunus Cad. No:66, Kavaklıdere, Çankaya;Ankara
Escape From Sirens;Caz / Butik;Konser;18.02.2026 20:30;ahzuita;Üsküp Cad. No:8 D:C, Çankaya;Ankara
Grails;Post-Rock;Konser;18.02.2026 20:30;Müjgân Bestekâr;Bestekar Cad. No:38 D:4, Kavaklıdere, Çankaya;Ankara
Ati242;Rap;Konser;18.02.2026 21:00;Jolly Joker Ankara;Kızılırmak Cad. No:14, Kavaklıdere, Çankaya;Ankara
Kral Lear;Klasik;Tiyatro;19.02.2026 20:00;Çankaya Sahne;Paris Cad. No:49B, Çankaya;Ankara
Taha Ercoşkun;Stand-up;Komedi;20.02.2026 20:30;FADE Stage;Büklüm Sok. No:3, Kavaklıdere, Çankaya;Ankara
Homecoming Party;Öğrenci;Parti;20.02.2026 21:00;100. Yıl Central Bar;İşçi Blokları Mah. 1536. Sok. No:7, Çankaya;Ankara
Ayenay (Reggae);Eğlenceli;Konser;20.02.2026 22:00;Kulüp Müjgan;Bestekar Cad. No:38/A, Kavaklıdere, Çankaya;Ankara
Kalben;Popüler;Konser;20.02.2026 22:00;Holly Stone Tunalı;Büklüm Cad. No:71, Kavaklıdere, Çankaya;Ankara
Seramik Workshop;Sanat;Atölye;21.02.2026 14:00;Artun Sanat Merkezi;Ahmet Taner Kışlalı Mah. 2853. Cad. No:26, Çankaya;Ankara
Kadınlar Filler ve Saireler;Devlet Tiyatrosu;Tiyatro;21.02.2026 15:00;Cüneyt Gökçer Sahnesi;Ahmet Taner Kışlalı Mah. 2432. Cad., Çayyolu;Ankara
Kahve Atölyesi;Tadım;Atölye;21.02.2026 19:00;Bin 71 & Anka Pera;Tunalı Hilmi Cad. No:71, Çankaya;Ankara
Teoman;Müzikal Stand-up;Show;21.02.2026 20:30;Congresium Ankara;Söğütözü Cad. No:1, Çankaya;Ankara
90's Pop Party;Retro;Parti;21.02.2026 20:30;Zürafa PSM;Konur Sok. No:33, Kızılay, Çankaya;Ankara
Euro-Party;Yabancı Hit;Parti;21.02.2026 21:00;Route Selanik;Selanik Cad. No:70, Kızılay, Çankaya;Ankara
Brat + Addison;Modern;Parti;21.02.2026 21:00;Vortex Art Club;Tunalı Hilmi Cad. No:99, Kavaklıdere, Çankaya;Ankara
Quiz Night (Büklüm);Rezervasyon Şart;Yarışma;17.02.2026 20:30;Last Penny Büklüm;Büklüm Cd No:41/A, Çankaya;Ankara
Müze Konseri: Oda Müziği;Müze Ambiyansı;Konser;17.02.2026 20:00;Erimtan Arkeoloji Müzesi;Kale Mah. Gözcü Sk. No:10, Altındağ;Ankara
Bir Delinin Hatıra Defteri;Butik Tiyatro;Tiyatro;18.02.2026 20:00;Bambu Sahne;Kızılay, Kumrular Cd. 20-A D:2, Çankaya;Ankara
80'ler & 90'lar Pop Gecesi;Giriş Ücretsiz;Parti;18.02.2026 21:00;June Pub;Bahçelievler, Azerbaycan Cd. No:115, Çankaya;Ankara
Dönüşüm (Kafka);Edebiyat Uyarlaması;Tiyatro;19.02.2026 20:00;Farabi Sahnesi;Cinnah Cad. Farabi Sk. 17/A, Çankaya;Ankara
Akustik Perşembe;Sakin/Sohbetlik;Müzik;19.02.2026 21:00;Tenedos Pub;Güvenevler, Güneş Sk. 4/A, Çankaya;Ankara
Live Jazz Night;Ankara'nın En İyi Cazı;Müzik;20.02.2026 21:30;Samm's Bistro;Kazım Özalp, Uğur Mumcu Cd. No:19, G.O.P.;Ankara
Rock & Metal Night;Sert Müzik;Konser;20.02.2026 22:00;Shelter Stage;Bestekar Cd No:38, Çankaya;Ankara
House & Techno Night;Elektronik Müzik;Parti;21.02.2026 23:00;Pixel;Tunus Cd No:66, Çankaya;Ankara
Electronic Music Event;Gece Kulübü;Parti;21.02.2026 23:00;Kite;Güvenlik Cd. No:97, Ayrancı;Ankara
Pazar Kahvaltısı;Klasik;Keyif;22.02.2026 11:00;Liva Pastanesi (Çukurambar);Kızılırmak Mah. Muhsin Yazıcıoğlu Cd. No:3;Ankara
Atatürk Halk Koşusu;Ücretsiz;Spor;15.02.2026 09:00;Kızılkule Meydanı;Çarşı Mah. İskele Cad., Alanya;Antalya
Sergi Turu;Merkez;Sergi;15.02.2026 13:00;Antalya Kültür Sanat;Elmalı Mah. Şehit Binbaşı Cengiz Toytunç Cad. No:60, Muratpaşa;Antalya
Umudunu Yitirmeyen Sığırcık;DT;Çocuk;15.02.2026 14:00;Haşim İşcan KM;Muratpaşa Mah. Evliya Çelebi Cad., Muratpaşa;Antalya
Hansel ile Gretel;Aile;Çocuk;15.02.2026 15:00;Mall of Antalya GM;Altınova Sinan Mah. Serik Cad. No:309, Kepez;Antalya
Akşam Sefası;Rock/Pop;Müzik;15.02.2026 19:00;Tudors Arena;Selçuk Mah. İskele Cad. No:18, Kaleiçi;Antalya
Sunday Jazz;Caz;Müzik;15.02.2026 21:00;Simurg Temple;Kılınçarslan Mah. Yenikapı Sok. No:12, Kaleiçi;Antalya
Soft Analog;Indie;Konser;15.02.2026 22:00;Sponge Pub Kaleiçi;Selçuk Mah. İzmirli Ali Efendi Sok., Kaleiçi;Antalya
Karaoke Night;Lara Bölgesi;Parti;15.02.2026 22:00;Golden Time Karaoke;Fener Mah. Tekelioğlu Cad., Muratpaşa;Antalya
Endemik Çiçekler;Ücretsiz;Sergi;16.02.2026 11:00;Olbia Sanat Galerisi;Akdeniz Üniversitesi Kampüsü, Konyaaltı;Antalya
Happy Hour;Ucuz Bira;Bar;16.02.2026 17:00;Varuna Gezgin;Kılınçarslan Mah. Hesapçı Sok. No:2, Kaleiçi;Antalya
Sendromsuzluk Partisi;Öğrenci;Parti;16.02.2026 21:00;Holly Stone;Selçuk Mah. Uzun Çarşı Sok., Kaleiçi;Antalya
Aşk İksiri;Opera;Opera;17.02.2026 20:00;Haşim İşcan KM (Opera);Muratpaşa Mah. Evliya Çelebi Cad., Muratpaşa;Antalya
Canlı Rock;Rock Bar;Müzik;17.02.2026 22:00;Raven Pub;Tuzcular Mah. İmaret Sok. No:16, Kaleiçi;Antalya
Müze Gezisi;MüzeKart;Kültür;18.02.2026 14:00;Antalya Müzesi;Bahçelievler Mah. Konyaaltı Cad. No:88, Muratpaşa;Antalya
Baba;Komedi;Tiyatro;18.02.2026 20:00;Mall of Antalya GM;Altınova Sinan Mah. Serik Cad. No:309, Kepez;Antalya
Akustik Müzik;Işıklar Cad.;Müzik;19.02.2026 20:00;Leman Kültür;Barbaros Mah. Atatürk Cad. No:44, Muratpaşa;Antalya
Quiz Night;Ödüllü;Yarışma;19.02.2026 20:30;Sir Winston Pub;Altınkum Mah. Atatürk Bulvarı No:168, Konyaaltı;Antalya
R&B Night;Gece Kulübü;Parti;19.02.2026 22:00;Soho Club;Şirinyalı Mah. Lara Cad., Muratpaşa;Antalya
Resim Sergisi;Eski Fabrika;Sergi;20.02.2026 16:00;DokumaPark;Fabrikalar Mah. Namık Kemal Bulvarı No:225, Kepez;Antalya
ADSO Konser;Senfoni;Konser;20.02.2026 20:30;AKM Aspendos Salonu;Meltem Mah. Sakıp Sabancı Bulvarı, Muratpaşa;Antalya
DJ Performans;Elektronik;Müzik;20.02.2026 21:00;Roots Antalya;Kılınçarslan Mah. Tabakhane Sok., Kaleiçi;Antalya
Retro Night;HipHop;Parti;21.02.2026 22:00;Up Shot Bar;Selçuk Mah. İzmirli Ali Efendi Sok., Kaleiçi;Antalya
Techno Night;Elektronik;Parti;21.02.2026 23:00;Kite;Şirinyalı Mah. Lara Cad., Muratpaşa;Antalya
Kahvaltı & Caz;Deniz Manzara;Keyif;22.02.2026 10:00;The Big Man;Şirinyalı Mah. Lara Cad. No:33, Muratpaşa;Antalya
Sinema Keyfi;AVM;Sinema;22.02.2026 15:00;Cinemaximum Migros;Arapsuyu Mah. Atatürk Bulvarı No:3, Konyaaltı;Antalya
Tan Taşçı;Popüler Pop;Konser;17.02.2026 21:00;Jolly Joker Antalya;Fener Mah. Tekelioğlu Cad. No:4, Muratpaşa;Antalya
Bülent Beyin Hikayesi;Komedi;Tiyatro;17.02.2026 20:00;Türkan Şoray Kültür Merkezi;Yeşilbahçe Mah. Çınarlı Cad. No:13, Muratpaşa;Antalya
Etik Nedir?;Felsefi Komedi;Tiyatro;18.02.2026 20:00;Nazım Hikmet Kongre Merkezi;Liman Mah. Boğaçayı Cad., Konyaaltı;Antalya
Salsa Night;Dans Gecesi;Dans;18.02.2026 21:00;Social Point;Şirinyalı Mah. İsmet Gökşen Cad. No:76, Muratpaşa;Antalya
Canlı Rock: Zakkum;Sahil Şubesi;Konser;18.02.2026 22:00;Sponge Pub Konyaaltı;Altınkum Mah. Akdeniz Bulvarı No:158, Konyaaltı;Antalya
Senfoni ile Neşet Ertaş;ADSO Özel;Konser;19.02.2026 20:00;AKM Aspendos Salonu;Meltem Mah. Sakıp Sabancı Bulvarı, Muratpaşa;Antalya
Akustik Performans;Rock Bar;Müzik;19.02.2026 21:00;The Roxx Pub;Tuzcular Mah. İmaret Sok. No:12, Kaleiçi;Antalya
Sunay Akın - Görçek;Hikaye Anlatısı;Show;20.02.2026 20:30;Türkan Şoray Kültür Merkezi;Yeşilbahçe Mah. Çınarlı Cad. No:13, Muratpaşa;Antalya
Yüzyüzeyken Konuşuruz;Alternatif;Konser;20.02.2026 21:00;Holly Stone Performance;Selçuk Mah. Uzun Çarşı Sok., Kaleiçi;Antalya
90'lar Türkçe Pop;Nostalji;Parti;20.02.2026 22:00;The Bar;Tuzcular Mah. Paşa Cami Sok. No:9, Kaleiçi;Antalya
Terrarium Atölyesi;Bitki Atölyesi;Atölye;21.02.2026 14:00;Cactus Garden (Lara);Çağlayan Mah. Barınaklar Bulvarı, Muratpaşa;Antalya
Hakan Altun;Arabesk/Fantezi;Konser;21.02.2026 21:00;Jolly Joker Antalya;Fener Mah. Tekelioğlu Cad. No:4, Muratpaşa;Antalya
Cem Adrian;Dev Sahne;Konser;21.02.2026 21:00;Nazım Hikmet Kongre Merkezi;Liman Mah. Boğaçayı Cad., Konyaaltı;Antalya
Dj Performans;Gece Kulübü;Parti;21.02.2026 22:00;Aura Club Kemer;Merkez Mah. Deniz Cad. No:3, Kemer;Antalya
Techno & House;Elektronik;Parti;21.02.2026 23:00;Pixel Night Club;Tuzcular Mah. Kaleiçi;Antalya
Serpme Kahvaltı;Köy Kahvaltısı;Keyif;22.02.2026 10:00;Çakırlar Köy Kahvaltısı;Bahtılı Mah. Çakırlar Yolu, Konyaaltı;Antalya
Kum Heykel Müzesi;Açık Hava Müzesi;Gezi;22.02.2026 14:00;Sandland;Güzeloba Mah. Lara Cad. (Lara Plajı), Muratpaşa;Antalya
Teleferik ile Gün Batımı;Manzara;Gezi;22.02.2026 16:00;Tünektepe Teleferik;Liman Mah. Antalya-Kemer Yolu, Konyaaltı;Antalya
Kahvaltı & Caz;Rezervasyon;Keyif;15.02.2026 11:00;Tamirane Akasya;Akasya AVM, Çeçen Sok. No:25, Üsküdar;İstanbul
Sergi Turu;Merkez;Sergi;15.02.2026 13:00;Pera Müzesi;Meşrutiyet Cad. No:65, Tepebaşı, Beyoğlu;İstanbul
Alice Müzikali;Zincirlikuyu;Müzikal;15.02.2026 14:00;Zorlu PSM;Levazım Mah. Koru Sok. No:2, Zorlu Center, Beşiktaş;İstanbul
Ağaçlar Ayakta Ölür;Bağdat Cad.;Tiyatro;15.02.2026 15:00;CKM (Caddebostan KM);Caddebostan Mah. Bağdat Cad. No:321, Kadıköy;İstanbul
Zengin Mutfağı;Ataşehir;Tiyatro;15.02.2026 15:00;DasDas;Barbaros Mah. Mor Sümbül Sok. Watergarden AVM, Ataşehir;İstanbul
TuzBiber Stand-up;Kadıköy;Komedi;15.02.2026 17:00;TuzBiber Sahne;Caferağa Mah. Nail Bey Sok. No:35, Kadıköy;İstanbul
Dolu Kadehi Ters Tut;Büyük Sahne;Konser;15.02.2026 18:00;Bostancı Gösteri Merkezi;Bostancı Mah. Bağdat Cad., Kadıköy;İstanbul
Amadeus;Taksim;Tiyatro;15.02.2026 20:00;AKM Türk Telekom;Gümüşsuyu Mah. Taksim Meydanı, Beyoğlu;İstanbul
Feridun Düzağaç;Çarşı İçi;Konser;15.02.2026 20:00;IF Performance Beşiktaş;Cihannüma Mah. Akmazfırın Sok. No:26, Beşiktaş;İstanbul
Sunday Jazz;Galata;Müzik;15.02.2026 21:00;Nardis Jazz Club;Bereketzade Mah. Galata Kulesi Sok. No:8, Beyoğlu;İstanbul
Yüzyüzeyken Konuşuruz;Kadıköy;Konser;15.02.2026 21:30;Dorock XL Kadıköy;Caferağa Mah. Neşet Ömer Sok. No:3, Kadıköy;İstanbul
Açık Mikrofon;Beşiktaş;Komedi;16.02.2026 19:00;BKM Mutfak Çarşı;Sinanpaşa Mah. Hasfırın Cad. No:75, Beşiktaş;İstanbul
Sendromsuzluk;Barlar Sokağı;Konser;16.02.2026 20:00;Karga Bar;Caferağa Mah. Kadife Sok. No:16, Kadıköy;İstanbul
Bir Delinin Hatıra..;Sahil;Tiyatro;16.02.2026 20:30;Fişekhane;Kazlıçeşme Mah. Kennedy Cad. No:52, Zeytinburnu;İstanbul
Evdeki Saat;Pera;Konser;16.02.2026 21:00;Blind;Asmalı Mescit Mah. Şehbender Sok. No:3, Beyoğlu;İstanbul
Müze Gezisi;Galataport;Sergi;17.02.2026 14:00;İstanbul Modern;Kılıçali Paşa Mah. Tophane İskele Cad. No:1, Beyoğlu;İstanbul
Cyrano;Maslak;Tiyatro;17.02.2026 20:00;Maximum Uniq Hall;Huzur Mah. Maslak Ayazağa Cad. No:4, Sarıyer;İstanbul
Büyük Ev Ablukada;İstiklal;Konser;17.02.2026 20:30;Ses Tiyatrosu;İstiklal Cad. Halep Pasajı No:62, Beyoğlu;İstanbul
Salı Sallanır;Nevizade;Parti;17.02.2026 22:00;Ritim Pera;Hüseyinağa Mah. Sahne Sok., Beyoğlu;İstanbul
Mabel Matiz;Maslak;Konser;18.02.2026 20:30;Volkswagen Arena;Huzur Mah. Maslak Ayazağa Cad. 4/A, Sarıyer;İstanbul
Quiz Night;Kadıköy;Yarışma;18.02.2026 20:30;Arkaoda;Caferağa Mah. Kadife Sok. No:18, Kadıköy;İstanbul
Güneş;Taksim;Konser;18.02.2026 21:00;Dorock XL Venue;İstiklal Cad. Fitaş Pasajı No:12, Beyoğlu;İstanbul
Oldies But Goldies;Bomonti;Parti;18.02.2026 22:00;Babylon;Merkez Mah. Silahşör Cad. Bomonti Bira Fabrikası No:1, Şişli;İstanbul
Arter Gezisi;Dolapdere;Sergi;19.02.2026 19:00;Arter;Yenişehir Mah. Irmak Cad. No:13, Beyoğlu;İstanbul
Can Bonomo;Vadi AVM;Konser;19.02.2026 21:00;JJ Vadistanbul;Ayazağa Mah. Cendere Cad. 109/C, Sarıyer;İstanbul
Techno;Cihangir;Parti;19.02.2026 22:00;Klinik;Hüseyinağa Mah. Topçekenler Sok., Beyoğlu;İstanbul
R&B Night;Manzaralı;Parti;19.02.2026 23:00;360 İstanbul;İstiklal Cad. Mısır Apt. No:163/8, Beyoğlu;İstanbul
Melike Şahin;Bostancı;Konser;20.02.2026 21:30;Bostancı Gösteri Merkezi;Bostancı Mah. Bağdat Cad., Kadıköy;İstanbul
House Night;Maslak;Parti;20.02.2026 23:00;Klein Phönix;Atatürk Sanayi Sitesi 1. Kısım 43. Sok., Sarıyer (Maslak);İstanbul
Dark Techno;Taksim;Parti;20.02.2026 23:59;RX Istanbul;Cihangir Mah. Sıraselviler Cad. No:33, Beyoğlu;İstanbul
Antika Pazarı;Bomonti;Gezi;21.02.2026 11:00;Feriköy Pazarı;Cumhuriyet Mah. Semt Pazarı No:8, Şişli;İstanbul
Kahve Atölyesi;Maslak;Atölye;21.02.2026 14:00;MSA;Maslak Meydan Sok. Beybi Giz Plaza, Sarıyer;İstanbul
Motive;Bayrampaşa;Konser;21.02.2026 21:00;Ora Arena;Altıntepsi Mah. Bi İstanbul Cad., Bayrampaşa;İstanbul
Sabaha Kadar Dans;Karaköy;Parti;21.02.2026 23:59;Suma Han;Bankalar Cad. Yanıkkapı Sok., Beyoğlu;İstanbul
Müze Gazhane;Hasanpaşa;Sosyal;22.02.2026 13:00;Müze Gazhane;Hasanpaşa Mah. Kurbağalıdere Cad. No:125, Kadıköy;İstanbul
Kapanış Partisi;Kadıköy;Eğlence;22.02.2026 21:00;Mecra;Caferağa Mah. Dumlupınar Sok. No:5, Kadıköy;İstanbul
Anadolu Efes - BSL Maçı;Basketbol Süper Ligi;Spor;15.02.2026 13:00;Sinan Erdem Spor Salonu;Ataköy 3-4-11. Kısım Mah., Bakırköy;İstanbul
Oda Müziği Konseri;Tarihi Bina;Konser;15.02.2026 16:00;Süreyya Operası;Caferağa Mah. Bahariye Cad. No:29, Kadıköy;İstanbul
Bir Baba Hamlet;Kapalı Gişe Efsane;Tiyatro;15.02.2026 20:30;Baba Sahne;Caferağa Mah. Bahariye Cad. No:17, Kadıköy;İstanbul
Film Gösterimi;Eski Fabrika;Sinema;16.02.2026 18:30;Beykoz Kundura Sinema;Yalıköy Mah. Süreyya İlmen Cad. No:1, Beykoz;İstanbul
Jazz & Comedy;Caz Kulübü;Show;16.02.2026 21:00;Touché (Zorlu PSM);Levazım Mah. Koru Sok. Zorlu Center, Beşiktaş;İstanbul
Salt Galata Turu;Ücretsiz / Tarihi;Sergi;17.02.2026 11:00;Salt Galata;Azapkapı Mah. Bankalar Cad. No:11, Karaköy;İstanbul
Bütün Çılgınlar Sever Beni;İlişki Komedisi;Tiyatro;17.02.2026 20:30;Moda Sahnesi;Caferağa Mah. Halil Ethem Sok., Kadıköy;İstanbul
Borusan Quartet;Klasik Müzik;Konser;18.02.2026 20:00;ENKA Oditoryumu;Sadi Gülçelik Spor Sitesi, İstinye, Sarıyer;İstanbul
Soft Analog;Indie Pop;Konser;18.02.2026 21:00;Salon İKSV;Evliya Çelebi Mah. Meşrutiyet Cad. No:5, Şişhane;İstanbul
Fenerbahçe Beko - EuroLeague;Avrupa Maçı;Spor;19.02.2026 19:45;Ülker Sports Arena;Barbaros Mah. Ihlamur Sok., Ataşehir;İstanbul
Bar Psikoloğu;İnteraktif;Show;19.02.2026 21:00;BKM Mutfak Kadıköy;Caferağa Mah. General Asım Gündüz Cad. No:35, Kadıköy;İstanbul
House Set;Kült Mekan;Parti;19.02.2026 22:00;Gizli Bahçe;Şehit Muhtar Mah. Nevizade Sok. No:27, Beyoğlu;İstanbul
Taxim (Baba Sahne);Kara Komedi;Tiyatro;20.02.2026 20:30;Baba Sahne;Caferağa Mah. Bahariye Cad. No:17, Kadıköy;İstanbul
Hey! Douglas (Live);Yeni Mekan;Konser;20.02.2026 21:00;Frankhan;Kemankeş Karamustafa Paşa, Kemankeş Cad. No:49, Karaköy;İstanbul
Canlı Caz: Ferit Odman;Yemekli Caz;Müzik;20.02.2026 22:30;The Badau;Acıbadem Mah. Çeçen Sok. Akasya AVM, Üsküdar;İstanbul
Boğaz'da Yürüyüş & Kahvaltı;Deniz Kenarı;Keyif;21.02.2026 10:00;Feriye;Yıldız Mah. Çırağan Cad. No:44, Ortaköy/Beşiktaş;İstanbul
Kitap & Kahve;Tarihi Kitapçı;Keyif;21.02.2026 14:00;Minoa Pera;Meşrutiyet Cad. No:99, Tepebaşı, Beyoğlu;İstanbul
Dolu Kadehi Ters Tut;Dev Sahne;Konser;21.02.2026 20:00;KüçükÇiftlik Park (Kapalı);Harbiye Mah. Kadırgalar Cad. No:4, Maçka;İstanbul
Büyük Ev Ablukada;Alternatif;Konser;21.02.2026 21:00;Müze Gazhane;Hasanpaşa Mah. Kurbağalıdere Cad. No:125, Kadıköy;İstanbul
Kuzguncuk Turu;Nostaljik Semt;Gezi;22.02.2026 13:00;Kuzguncuk Bostanı;Kuzguncuk Mah. İcadiye Cad., Üsküdar;İstanbul
Notre Dame'ın Kamburu;Klasik;Müzikal;22.02.2026 15:00;Trump Sahne;Kuştepe Mah. Mecidiyeköy Yolu Cad. No:12, Şişli;İstanbul
Galata Kulesi Gün Batımı;Manzara;Gezi;22.02.2026 17:00;Galata Kulesi;Bereketzade Mah., Beyoğlu;İstanbul`;

const creatorId = 'b9a714fa-db62-47d4-b5d9-4e723646a3d5';
const organizer = 'muratveozturk@gmail.com';
const baseTs = 1771100000000;
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
};
const defaultImage = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop';

const venueCoords = {
  // ANKARA
  'CerModern': [39.9334, 32.8540],
  'NOA Coffee & Art': [39.9120, 32.8370],
  'Bergüzar Sahne': [39.9650, 32.7900],
  'GreyShake Coffee': [39.9400, 32.6750],
  'Tatbikat Sahnesi': [39.9080, 32.8520],
  'CSO Ada Ankara': [39.9420, 32.8600],
  'Müjgân 100. Yıl': [39.9000, 32.8350],
  'Jolly Joker Ankara': [39.9080, 32.8586],
  'Milyon Performance': [39.9220, 32.8310],
  'MEB Şura Salonu': [39.9270, 32.8360],
  'Nazım Hikmet KM': [39.9680, 32.8050],
  'Editör Dükkan': [39.9030, 32.8640],
  'Coffee UP': [39.9220, 32.8290],
  'Lola Kitchen': [39.8850, 32.8100],
  'IF Performance Tunus': [39.9075, 32.8600],
  'Berlin Cafe Pub': [39.9210, 32.8550],
  'Korkut Ata KM': [39.9460, 32.6820],
  '6:45 KK Ankara': [39.9085, 32.8610],
  'ahzuita': [39.9070, 32.8560],
  'Müjgân Bestekâr': [39.9097, 32.8586],
  'Çankaya Sahne': [39.9060, 32.8530],
  'FADE Stage': [39.9075, 32.8590],
  '100. Yıl Central Bar': [39.8990, 32.8340],
  'Kulüp Müjgan': [39.9097, 32.8586],
  'Holly Stone Tunalı': [39.9060, 32.8600],
  'Artun Sanat Merkezi': [39.8720, 32.7500],
  'Cüneyt Gökçer Sahnesi': [39.8700, 32.7450],
  'Bin 71 & Anka Pera': [39.9050, 32.8600],
  'Congresium Ankara': [39.9050, 32.8050],
  'Zürafa PSM': [39.9200, 32.8540],
  'Route Selanik': [39.9210, 32.8560],
  'Vortex Art Club': [39.9060, 32.8610],
  'Last Penny Büklüm': [39.9070, 32.8595],
  'Erimtan Arkeoloji Müzesi': [39.9410, 32.8640],
  'Bambu Sahne': [39.9200, 32.8540],
  'June Pub': [39.9225, 32.8300],
  'Farabi Sahnesi': [39.9070, 32.8530],
  'Tenedos Pub': [39.9085, 32.8510],
  "Samm's Bistro": [39.9150, 32.8600],
  'Shelter Stage': [39.9097, 32.8586],
  'Pixel': [39.9085, 32.8610],
  'Kite': [39.9030, 32.8650],
  'Liva Pastanesi (Çukurambar)': [39.9100, 32.8200],
  // ANTALYA
  'Kızılkule Meydanı': [36.5450, 31.9950],
  'Antalya Kültür Sanat': [36.8870, 30.7100],
  'Haşim İşcan KM': [36.8860, 30.7080],
  'Mall of Antalya GM': [36.9300, 30.7200],
  'Tudors Arena': [36.8840, 30.7040],
  'Simurg Temple': [36.8850, 30.7060],
  'Sponge Pub Kaleiçi': [36.8845, 30.7045],
  'Golden Time Karaoke': [36.8550, 30.7480],
  'Olbia Sanat Galerisi': [36.8930, 30.6350],
  'Varuna Gezgin': [36.8850, 30.7055],
  'Holly Stone': [36.8840, 30.7050],
  'Haşim İşcan KM (Opera)': [36.8860, 30.7080],
  'Raven Pub': [36.8855, 30.7065],
  'Antalya Müzesi': [36.8850, 30.6830],
  'Leman Kültür': [36.8870, 30.7050],
  'Sir Winston Pub': [36.8750, 30.6500],
  'Soho Club': [36.8560, 30.7480],
  'DokumaPark': [36.9250, 30.7100],
  'AKM Aspendos Salonu': [36.8680, 30.6700],
  'Roots Antalya': [36.8850, 30.7050],
  'Up Shot Bar': [36.8845, 30.7045],
  'The Big Man': [36.8560, 30.7490],
  'Cinemaximum Migros': [36.8700, 30.6400],
  'Jolly Joker Antalya': [36.8560, 30.7500],
  'Türkan Şoray Kültür Merkezi': [36.8800, 30.6800],
  'Nazım Hikmet Kongre Merkezi': [36.8680, 30.6550],
  'Social Point': [36.8560, 30.7470],
  'Sponge Pub Konyaaltı': [36.8730, 30.6480],
  'The Roxx Pub': [36.8855, 30.7060],
  'Holly Stone Performance': [36.8840, 30.7050],
  'The Bar': [36.8850, 30.7060],
  'Cactus Garden (Lara)': [36.8600, 30.7450],
  'Aura Club Kemer': [36.5970, 30.5570],
  'Pixel Night Club': [36.8850, 30.7065],
  'Çakırlar Köy Kahvaltısı': [36.9100, 30.5800],
  'Sandland': [36.8520, 30.7600],
  'Tünektepe Teleferik': [36.8870, 30.6200],
  // İSTANBUL
  'Tamirane Akasya': [41.0050, 29.0400],
  'Pera Müzesi': [41.0320, 28.9740],
  'Zorlu PSM': [41.0690, 29.0170],
  'CKM (Caddebostan KM)': [40.9660, 29.0620],
  'DasDas': [40.9870, 29.1100],
  'TuzBiber Sahne': [40.9900, 29.0260],
  'Bostancı Gösteri Merkezi': [40.9600, 29.0700],
  'AKM Türk Telekom': [41.0370, 28.9850],
  'IF Performance Beşiktaş': [41.0430, 29.0050],
  'Nardis Jazz Club': [41.0260, 28.9740],
  'Dorock XL Kadıköy': [40.9900, 29.0270],
  'BKM Mutfak Çarşı': [41.0430, 29.0060],
  'Karga Bar': [40.9900, 29.0280],
  'Fişekhane': [41.0040, 28.9060],
  'Blind': [41.0330, 28.9760],
  'İstanbul Modern': [41.0260, 28.9830],
  'Maximum Uniq Hall': [41.1080, 29.0200],
  'Ses Tiyatrosu': [41.0340, 28.9780],
  'Ritim Pera': [41.0340, 28.9770],
  'Volkswagen Arena': [41.1090, 29.0210],
  'Arkaoda': [40.9905, 29.0280],
  'Dorock XL Venue': [41.0340, 28.9770],
  'Babylon': [41.0550, 28.9800],
  'Arter': [41.0400, 28.9780],
  'JJ Vadistanbul': [41.1050, 29.0150],
  'Klinik': [41.0340, 28.9770],
  '360 İstanbul': [41.0340, 28.9760],
  'Klein Phönix': [41.1100, 29.0200],
  'RX Istanbul': [41.0340, 28.9830],
  'Feriköy Pazarı': [41.0560, 28.9810],
  'MSA': [41.1080, 29.0220],
  'Ora Arena': [41.0500, 28.9000],
  'Suma Han': [41.0230, 28.9740],
  'Müze Gazhane': [40.9920, 29.0350],
  'Mecra': [40.9900, 29.0260],
  'Sinan Erdem Spor Salonu': [40.9800, 28.8520],
  'Süreyya Operası': [40.9910, 29.0260],
  'Baba Sahne': [40.9910, 29.0260],
  'Beykoz Kundura Sinema': [41.1300, 29.1000],
  'Touché (Zorlu PSM)': [41.0690, 29.0170],
  'Salt Galata': [41.0220, 28.9740],
  'Moda Sahnesi': [40.9870, 29.0290],
  'ENKA Oditoryumu': [41.1100, 29.0550],
  'Salon İKSV': [41.0280, 28.9720],
  'Ülker Sports Arena': [40.9870, 29.1100],
  'BKM Mutfak Kadıköy': [40.9900, 29.0280],
  'Gizli Bahçe': [41.0340, 28.9780],
  'Frankhan': [41.0230, 28.9770],
  'The Badau': [41.0050, 29.0400],
  'Feriye': [41.0480, 29.0280],
  'Minoa Pera': [41.0320, 28.9750],
  'KüçükÇiftlik Park (Kapalı)': [41.0460, 28.9940],
  'Kuzguncuk Bostanı': [41.0280, 29.0370],
  'Trump Sahne': [41.0640, 28.9910],
  'Galata Kulesi': [41.0256, 28.9741],
};

const cityFallback = {
  'Ankara': [39.9208, 32.8541],
  'Antalya': [36.8870, 30.7100],
  'İstanbul': [41.0082, 28.9784],
};

function esc(str) {
  return str.replace(/'/g, "''");
}

const lines = csvData.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const sqlLines = [];

sqlLines.push(`-- Batch Event Insert - Generated 2026-02-14`);
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

const outputPath = path.join(__dirname, 'events_batch_insert.sql');
fs.writeFileSync(outputPath, sqlLines.join('\n'), 'utf8');

console.log(`SQL file generated: ${outputPath}`);
console.log(`Total events: ${lines.length}`);
