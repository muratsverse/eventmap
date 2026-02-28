$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$csvData = @"
The Godfather OkumasÄ±;KÃ¼ltÃ¼r Sanat;AtÃ¶lye;15.02.2026 13:00;CerModern;Anafartalar Mah. AltÄ±nsoy Cad. No:3, SÄ±hhÄ±ye, AltÄ±ndaÄŸ;Ankara
Punch AtÃ¶lyesi;Hobi / Butik;AtÃ¶lye;15.02.2026 14:00;NOA Coffee & Art;Mustafa Kemal Mah. 2096. Sk. BarÄ±ÅŸ Sitesi No:28, Ã‡ankaya;Ankara
Niloya MÃ¼zikal;Aile Ä°Ã§in;Ã‡ocuk;15.02.2026 14:00;BergÃ¼zar Sahne;Ergazi Mah. BatÄ± BulvarÄ± 109/C, Yenimahalle;Ankara
Quiz Night: FB;Fanatiklere Ã–zel;YarÄ±ÅŸma;15.02.2026 15:00;GreyShake Coffee;BaÄŸlÄ±ca Mah. Etimesgut BulvarÄ± D:110, Etimesgut;Ankara
Bir Ä°dam Mahkumunun Son GÃ¼nÃ¼;Edebiyat UyarlamasÄ±;Tiyatro;15.02.2026 19:00;Tatbikat Sahnesi;GÃ¼venevler Mah. Farabi Sok. No:34, Ã‡ankaya;Ankara
KÃ¼Ã§Ã¼k Bir AÅŸk MasalÄ±;Devlet Tiyatrosu;Tiyatro;15.02.2026 20:00;CSO Ada Ankara;TalatpaÅŸa BulvarÄ±, No: 38 Opera, AltÄ±ndaÄŸ;Ankara
Shrek's Swamp Party;KostÃ¼mlÃ¼ / AbsÃ¼rt;Parti;15.02.2026 20:00;MÃ¼jgÃ¢n 100. YÄ±l;Ä°ÅŸÃ§i BloklarÄ± Mah. 1533. Sk. No:2/24, Ã‡ankaya;Ankara
Ceylan Ertem;PopÃ¼ler;Konser;15.02.2026 20:00;Jolly Joker Ankara;KavaklÄ±dere, KÄ±zÄ±lÄ±rmak Cad. No:14, Ã‡ankaya;Ankara
Uzi;Rap / GenÃ§;Konser;15.02.2026 20:00;Milyon Performance;BahÃ§elievler, Azerbaycan Cad. No:41, Ã‡ankaya;Ankara
Emre AydÄ±n;PopÃ¼ler Rock;Konser;15.02.2026 20:30;MEB Åura Salonu;Emniyet Mah. Gazeteci Yazar Muammer YaÅŸar BostancÄ± Cd., BeÅŸevler;Ankara
Sefa DoÄŸanay Show;Komedi;GÃ¶steri;15.02.2026 20:30;NazÄ±m Hikmet KM;Mehmet Akif Ersoy Mah. BaÄŸdat Cad. No:50, Yenimahalle;Ankara
ODTÃœ Komedi TopluluÄŸu;Ã–ÄŸrenci Dostu;Komedi;15.02.2026 20:30;EditÃ¶r DÃ¼kkan;AyrancÄ± Mah. AlaÃ§am Sok. No:17/B, Ã‡ankaya;Ankara
Faili MeÃ§hul;Butik;Talk Show;15.02.2026 20:30;Coffee UP;BahÃ§elievler Mah. Azerbaycan Cad. No:23, Ã‡ankaya;Ankara
Onurr;Yeni Nesil Pop;Konser;15.02.2026 21:00;Lola Kitchen;Kuzu Effect AVM, Oran Mah. ZÃ¼lfÃ¼ TiÄŸrel Cad., Ã‡ankaya;Ankara
Mikail Turan;Alternatif;Konser;15.02.2026 21:00;IF Performance Tunus;Tunus Cad. No:14/A, KavaklÄ±dere, Ã‡ankaya;Ankara
Trivia Night;Bilgi YarÄ±ÅŸmasÄ±;YarÄ±ÅŸma;16.02.2026 20:30;Coffee UP;BahÃ§elievler Mah. Azerbaycan Cad. No:23, Ã‡ankaya;Ankara
Lafazans Stand Up;GiriÅŸ Uygun;Komedi;17.02.2026 20:00;Berlin Cafe Pub;Selanik Cad. No:67/A, KÄ±zÄ±lay, Ã‡ankaya;Ankara
Cevdet BaÄŸca;Halk MÃ¼ziÄŸi;Konser;17.02.2026 20:00;Korkut Ata KM;AyyÄ±ldÄ±z Mah. Ahimesut BulvarÄ± No:16, Etimesgut;Ankara
DaÄŸÄ±nÄ±k;Alternatif Rock;Konser;17.02.2026 21:00;6:45 KK Ankara;Tunus Cad. No:66, KavaklÄ±dere, Ã‡ankaya;Ankara
Escape From Sirens;Caz / Butik;Konser;18.02.2026 20:30;ahzuita;ÃœskÃ¼p Cad. No:8 D:C, Ã‡ankaya;Ankara
Grails;Post-Rock;Konser;18.02.2026 20:30;MÃ¼jgÃ¢n BestekÃ¢r;Bestekar Cad. No:38 D:4, KavaklÄ±dere, Ã‡ankaya;Ankara
Ati242;Rap;Konser;18.02.2026 21:00;Jolly Joker Ankara;KÄ±zÄ±lÄ±rmak Cad. No:14, KavaklÄ±dere, Ã‡ankaya;Ankara
Kral Lear;Klasik;Tiyatro;19.02.2026 20:00;Ã‡ankaya Sahne;Paris Cad. No:49B, Ã‡ankaya;Ankara
Taha ErcoÅŸkun;Stand-up;Komedi;20.02.2026 20:30;FADE Stage;BÃ¼klÃ¼m Sok. No:3, KavaklÄ±dere, Ã‡ankaya;Ankara
Homecoming Party;Ã–ÄŸrenci;Parti;20.02.2026 21:00;100. YÄ±l Central Bar;Ä°ÅŸÃ§i BloklarÄ± Mah. 1536. Sok. No:7, Ã‡ankaya;Ankara
Ayenay (Reggae);EÄŸlenceli;Konser;20.02.2026 22:00;KulÃ¼p MÃ¼jgan;Bestekar Cad. No:38/A, KavaklÄ±dere, Ã‡ankaya;Ankara
Kalben;PopÃ¼ler;Konser;20.02.2026 22:00;Holly Stone TunalÄ±;BÃ¼klÃ¼m Cad. No:71, KavaklÄ±dere, Ã‡ankaya;Ankara
Seramik Workshop;Sanat;AtÃ¶lye;21.02.2026 14:00;Artun Sanat Merkezi;Ahmet Taner KÄ±ÅŸlalÄ± Mah. 2853. Cad. No:26, Ã‡ankaya;Ankara
KadÄ±nlar Filler ve Saireler;Devlet Tiyatrosu;Tiyatro;21.02.2026 15:00;CÃ¼neyt GÃ¶kÃ§er Sahnesi;Ahmet Taner KÄ±ÅŸlalÄ± Mah. 2432. Cad., Ã‡ayyolu;Ankara
Kahve AtÃ¶lyesi;TadÄ±m;AtÃ¶lye;21.02.2026 19:00;Bin 71 & Anka Pera;TunalÄ± Hilmi Cad. No:71, Ã‡ankaya;Ankara
Teoman;MÃ¼zikal Stand-up;Show;21.02.2026 20:30;Congresium Ankara;SÃ¶ÄŸÃ¼tÃ¶zÃ¼ Cad. No:1, Ã‡ankaya;Ankara
90's Pop Party;Retro;Parti;21.02.2026 20:30;ZÃ¼rafa PSM;Konur Sok. No:33, KÄ±zÄ±lay, Ã‡ankaya;Ankara
Euro-Party;YabancÄ± Hit;Parti;21.02.2026 21:00;Route Selanik;Selanik Cad. No:70, KÄ±zÄ±lay, Ã‡ankaya;Ankara
Brat + Addison;Modern;Parti;21.02.2026 21:00;Vortex Art Club;TunalÄ± Hilmi Cad. No:99, KavaklÄ±dere, Ã‡ankaya;Ankara
Quiz Night (BÃ¼klÃ¼m);Rezervasyon Åart;YarÄ±ÅŸma;17.02.2026 20:30;Last Penny BÃ¼klÃ¼m;BÃ¼klÃ¼m Cd No:41/A, Ã‡ankaya;Ankara
MÃ¼ze Konseri: Oda MÃ¼ziÄŸi;MÃ¼ze AmbiyansÄ±;Konser;17.02.2026 20:00;Erimtan Arkeoloji MÃ¼zesi;Kale Mah. GÃ¶zcÃ¼ Sk. No:10, AltÄ±ndaÄŸ;Ankara
Bir Delinin HatÄ±ra Defteri;Butik Tiyatro;Tiyatro;18.02.2026 20:00;Bambu Sahne;KÄ±zÄ±lay, Kumrular Cd. 20-A D:2, Ã‡ankaya;Ankara
80'ler & 90'lar Pop Gecesi;GiriÅŸ Ãœcretsiz;Parti;18.02.2026 21:00;June Pub;BahÃ§elievler, Azerbaycan Cd. No:115, Ã‡ankaya;Ankara
DÃ¶nÃ¼ÅŸÃ¼m (Kafka);Edebiyat UyarlamasÄ±;Tiyatro;19.02.2026 20:00;Farabi Sahnesi;Cinnah Cad. Farabi Sk. 17/A, Ã‡ankaya;Ankara
Akustik PerÅŸembe;Sakin/Sohbetlik;MÃ¼zik;19.02.2026 21:00;Tenedos Pub;GÃ¼venevler, GÃ¼neÅŸ Sk. 4/A, Ã‡ankaya;Ankara
Live Jazz Night;Ankara'nÄ±n En Ä°yi CazÄ±;MÃ¼zik;20.02.2026 21:30;Samm's Bistro;KazÄ±m Ã–zalp, UÄŸur Mumcu Cd. No:19, G.O.P.;Ankara
Rock & Metal Night;Sert MÃ¼zik;Konser;20.02.2026 22:00;Shelter Stage;Bestekar Cd No:38, Ã‡ankaya;Ankara
House & Techno Night;Elektronik MÃ¼zik;Parti;21.02.2026 23:00;Pixel;Tunus Cd No:66, Ã‡ankaya;Ankara
Electronic Music Event;Gece KulÃ¼bÃ¼;Parti;21.02.2026 23:00;Kite;GÃ¼venlik Cd. No:97, AyrancÄ±;Ankara
Pazar KahvaltÄ±sÄ±;Klasik;Keyif;22.02.2026 11:00;Liva Pastanesi (Ã‡ukurambar);KÄ±zÄ±lÄ±rmak Mah. Muhsin YazÄ±cÄ±oÄŸlu Cd. No:3;Ankara
AtatÃ¼rk Halk KoÅŸusu;Ãœcretsiz;Spor;15.02.2026 09:00;KÄ±zÄ±lkule MeydanÄ±;Ã‡arÅŸÄ± Mah. Ä°skele Cad., Alanya;Antalya
Sergi Turu;Merkez;Sergi;15.02.2026 13:00;Antalya KÃ¼ltÃ¼r Sanat;ElmalÄ± Mah. Åehit BinbaÅŸÄ± Cengiz ToytunÃ§ Cad. No:60, MuratpaÅŸa;Antalya
Umudunu Yitirmeyen SÄ±ÄŸÄ±rcÄ±k;DT;Ã‡ocuk;15.02.2026 14:00;HaÅŸim Ä°ÅŸcan KM;MuratpaÅŸa Mah. Evliya Ã‡elebi Cad., MuratpaÅŸa;Antalya
Hansel ile Gretel;Aile;Ã‡ocuk;15.02.2026 15:00;Mall of Antalya GM;AltÄ±nova Sinan Mah. Serik Cad. No:309, Kepez;Antalya
AkÅŸam SefasÄ±;Rock/Pop;MÃ¼zik;15.02.2026 19:00;Tudors Arena;SelÃ§uk Mah. Ä°skele Cad. No:18, KaleiÃ§i;Antalya
Sunday Jazz;Caz;MÃ¼zik;15.02.2026 21:00;Simurg Temple;KÄ±lÄ±nÃ§arslan Mah. YenikapÄ± Sok. No:12, KaleiÃ§i;Antalya
Soft Analog;Indie;Konser;15.02.2026 22:00;Sponge Pub KaleiÃ§i;SelÃ§uk Mah. Ä°zmirli Ali Efendi Sok., KaleiÃ§i;Antalya
Karaoke Night;Lara BÃ¶lgesi;Parti;15.02.2026 22:00;Golden Time Karaoke;Fener Mah. TekelioÄŸlu Cad., MuratpaÅŸa;Antalya
Endemik Ã‡iÃ§ekler;Ãœcretsiz;Sergi;16.02.2026 11:00;Olbia Sanat Galerisi;Akdeniz Ãœniversitesi KampÃ¼sÃ¼, KonyaaltÄ±;Antalya
Happy Hour;Ucuz Bira;Bar;16.02.2026 17:00;Varuna Gezgin;KÄ±lÄ±nÃ§arslan Mah. HesapÃ§Ä± Sok. No:2, KaleiÃ§i;Antalya
Sendromsuzluk Partisi;Ã–ÄŸrenci;Parti;16.02.2026 21:00;Holly Stone;SelÃ§uk Mah. Uzun Ã‡arÅŸÄ± Sok., KaleiÃ§i;Antalya
AÅŸk Ä°ksiri;Opera;Opera;17.02.2026 20:00;HaÅŸim Ä°ÅŸcan KM (Opera);MuratpaÅŸa Mah. Evliya Ã‡elebi Cad., MuratpaÅŸa;Antalya
CanlÄ± Rock;Rock Bar;MÃ¼zik;17.02.2026 22:00;Raven Pub;Tuzcular Mah. Ä°maret Sok. No:16, KaleiÃ§i;Antalya
MÃ¼ze Gezisi;MÃ¼zeKart;KÃ¼ltÃ¼r;18.02.2026 14:00;Antalya MÃ¼zesi;BahÃ§elievler Mah. KonyaaltÄ± Cad. No:88, MuratpaÅŸa;Antalya
Baba;Komedi;Tiyatro;18.02.2026 20:00;Mall of Antalya GM;AltÄ±nova Sinan Mah. Serik Cad. No:309, Kepez;Antalya
Akustik MÃ¼zik;IÅŸÄ±klar Cad.;MÃ¼zik;19.02.2026 20:00;Leman KÃ¼ltÃ¼r;Barbaros Mah. AtatÃ¼rk Cad. No:44, MuratpaÅŸa;Antalya
Quiz Night;Ã–dÃ¼llÃ¼;YarÄ±ÅŸma;19.02.2026 20:30;Sir Winston Pub;AltÄ±nkum Mah. AtatÃ¼rk BulvarÄ± No:168, KonyaaltÄ±;Antalya
R&B Night;Gece KulÃ¼bÃ¼;Parti;19.02.2026 22:00;Soho Club;ÅirinyalÄ± Mah. Lara Cad., MuratpaÅŸa;Antalya
Resim Sergisi;Eski Fabrika;Sergi;20.02.2026 16:00;DokumaPark;Fabrikalar Mah. NamÄ±k Kemal BulvarÄ± No:225, Kepez;Antalya
ADSO Konser;Senfoni;Konser;20.02.2026 20:30;AKM Aspendos Salonu;Meltem Mah. SakÄ±p SabancÄ± BulvarÄ±, MuratpaÅŸa;Antalya
DJ Performans;Elektronik;MÃ¼zik;20.02.2026 21:00;Roots Antalya;KÄ±lÄ±nÃ§arslan Mah. Tabakhane Sok., KaleiÃ§i;Antalya
Retro Night;HipHop;Parti;21.02.2026 22:00;Up Shot Bar;SelÃ§uk Mah. Ä°zmirli Ali Efendi Sok., KaleiÃ§i;Antalya
Techno Night;Elektronik;Parti;21.02.2026 23:00;Kite;ÅirinyalÄ± Mah. Lara Cad., MuratpaÅŸa;Antalya
KahvaltÄ± & Caz;Deniz Manzara;Keyif;22.02.2026 10:00;The Big Man;ÅirinyalÄ± Mah. Lara Cad. No:33, MuratpaÅŸa;Antalya
Sinema Keyfi;AVM;Sinema;22.02.2026 15:00;Cinemaximum Migros;Arapsuyu Mah. AtatÃ¼rk BulvarÄ± No:3, KonyaaltÄ±;Antalya
Tan TaÅŸÃ§Ä±;PopÃ¼ler Pop;Konser;17.02.2026 21:00;Jolly Joker Antalya;Fener Mah. TekelioÄŸlu Cad. No:4, MuratpaÅŸa;Antalya
BÃ¼lent Beyin Hikayesi;Komedi;Tiyatro;17.02.2026 20:00;TÃ¼rkan Åoray KÃ¼ltÃ¼r Merkezi;YeÅŸilbahÃ§e Mah. Ã‡Ä±narlÄ± Cad. No:13, MuratpaÅŸa;Antalya
Etik Nedir?;Felsefi Komedi;Tiyatro;18.02.2026 20:00;NazÄ±m Hikmet Kongre Merkezi;Liman Mah. BoÄŸaÃ§ayÄ± Cad., KonyaaltÄ±;Antalya
Salsa Night;Dans Gecesi;Dans;18.02.2026 21:00;Social Point;ÅirinyalÄ± Mah. Ä°smet GÃ¶kÅŸen Cad. No:76, MuratpaÅŸa;Antalya
CanlÄ± Rock: Zakkum;Sahil Åubesi;Konser;18.02.2026 22:00;Sponge Pub KonyaaltÄ±;AltÄ±nkum Mah. Akdeniz BulvarÄ± No:158, KonyaaltÄ±;Antalya
Senfoni ile NeÅŸet ErtaÅŸ;ADSO Ã–zel;Konser;19.02.2026 20:00;AKM Aspendos Salonu;Meltem Mah. SakÄ±p SabancÄ± BulvarÄ±, MuratpaÅŸa;Antalya
Akustik Performans;Rock Bar;MÃ¼zik;19.02.2026 21:00;The Roxx Pub;Tuzcular Mah. Ä°maret Sok. No:12, KaleiÃ§i;Antalya
Sunay AkÄ±n - GÃ¶rÃ§ek;Hikaye AnlatÄ±sÄ±;Show;20.02.2026 20:30;TÃ¼rkan Åoray KÃ¼ltÃ¼r Merkezi;YeÅŸilbahÃ§e Mah. Ã‡Ä±narlÄ± Cad. No:13, MuratpaÅŸa;Antalya
YÃ¼zyÃ¼zeyken KonuÅŸuruz;Alternatif;Konser;20.02.2026 21:00;Holly Stone Performance;SelÃ§uk Mah. Uzun Ã‡arÅŸÄ± Sok., KaleiÃ§i;Antalya
90'lar TÃ¼rkÃ§e Pop;Nostalji;Parti;20.02.2026 22:00;The Bar;Tuzcular Mah. PaÅŸa Cami Sok. No:9, KaleiÃ§i;Antalya
Terrarium AtÃ¶lyesi;Bitki AtÃ¶lyesi;AtÃ¶lye;21.02.2026 14:00;Cactus Garden (Lara);Ã‡aÄŸlayan Mah. BarÄ±naklar BulvarÄ±, MuratpaÅŸa;Antalya
Hakan Altun;Arabesk/Fantezi;Konser;21.02.2026 21:00;Jolly Joker Antalya;Fener Mah. TekelioÄŸlu Cad. No:4, MuratpaÅŸa;Antalya
Cem Adrian;Dev Sahne;Konser;21.02.2026 21:00;NazÄ±m Hikmet Kongre Merkezi;Liman Mah. BoÄŸaÃ§ayÄ± Cad., KonyaaltÄ±;Antalya
Dj Performans;Gece KulÃ¼bÃ¼;Parti;21.02.2026 22:00;Aura Club Kemer;Merkez Mah. Deniz Cad. No:3, Kemer;Antalya
Techno & House;Elektronik;Parti;21.02.2026 23:00;Pixel Night Club;Tuzcular Mah. KaleiÃ§i;Antalya
Serpme KahvaltÄ±;KÃ¶y KahvaltÄ±sÄ±;Keyif;22.02.2026 10:00;Ã‡akÄ±rlar KÃ¶y KahvaltÄ±sÄ±;BahtÄ±lÄ± Mah. Ã‡akÄ±rlar Yolu, KonyaaltÄ±;Antalya
Kum Heykel MÃ¼zesi;AÃ§Ä±k Hava MÃ¼zesi;Gezi;22.02.2026 14:00;Sandland;GÃ¼zeloba Mah. Lara Cad. (Lara PlajÄ±), MuratpaÅŸa;Antalya
Teleferik ile GÃ¼n BatÄ±mÄ±;Manzara;Gezi;22.02.2026 16:00;TÃ¼nektepe Teleferik;Liman Mah. Antalya-Kemer Yolu, KonyaaltÄ±;Antalya
KahvaltÄ± & Caz;Rezervasyon;Keyif;15.02.2026 11:00;Tamirane Akasya;Akasya AVM, Ã‡eÃ§en Sok. No:25, ÃœskÃ¼dar;Ä°stanbul
Sergi Turu;Merkez;Sergi;15.02.2026 13:00;Pera MÃ¼zesi;MeÅŸrutiyet Cad. No:65, TepebaÅŸÄ±, BeyoÄŸlu;Ä°stanbul
Alice MÃ¼zikali;Zincirlikuyu;MÃ¼zikal;15.02.2026 14:00;Zorlu PSM;LevazÄ±m Mah. Koru Sok. No:2, Zorlu Center, BeÅŸiktaÅŸ;Ä°stanbul
AÄŸaÃ§lar Ayakta Ã–lÃ¼r;BaÄŸdat Cad.;Tiyatro;15.02.2026 15:00;CKM (Caddebostan KM);Caddebostan Mah. BaÄŸdat Cad. No:321, KadÄ±kÃ¶y;Ä°stanbul
Zengin MutfaÄŸÄ±;AtaÅŸehir;Tiyatro;15.02.2026 15:00;DasDas;Barbaros Mah. Mor SÃ¼mbÃ¼l Sok. Watergarden AVM, AtaÅŸehir;Ä°stanbul
TuzBiber Stand-up;KadÄ±kÃ¶y;Komedi;15.02.2026 17:00;TuzBiber Sahne;CaferaÄŸa Mah. Nail Bey Sok. No:35, KadÄ±kÃ¶y;Ä°stanbul
Dolu Kadehi Ters Tut;BÃ¼yÃ¼k Sahne;Konser;15.02.2026 18:00;BostancÄ± GÃ¶steri Merkezi;BostancÄ± Mah. BaÄŸdat Cad., KadÄ±kÃ¶y;Ä°stanbul
Amadeus;Taksim;Tiyatro;15.02.2026 20:00;AKM TÃ¼rk Telekom;GÃ¼mÃ¼ÅŸsuyu Mah. Taksim MeydanÄ±, BeyoÄŸlu;Ä°stanbul
Feridun DÃ¼zaÄŸaÃ§;Ã‡arÅŸÄ± Ä°Ã§i;Konser;15.02.2026 20:00;IF Performance BeÅŸiktaÅŸ;CihannÃ¼ma Mah. AkmazfÄ±rÄ±n Sok. No:26, BeÅŸiktaÅŸ;Ä°stanbul
Sunday Jazz;Galata;MÃ¼zik;15.02.2026 21:00;Nardis Jazz Club;Bereketzade Mah. Galata Kulesi Sok. No:8, BeyoÄŸlu;Ä°stanbul
YÃ¼zyÃ¼zeyken KonuÅŸuruz;KadÄ±kÃ¶y;Konser;15.02.2026 21:30;Dorock XL KadÄ±kÃ¶y;CaferaÄŸa Mah. NeÅŸet Ã–mer Sok. No:3, KadÄ±kÃ¶y;Ä°stanbul
AÃ§Ä±k Mikrofon;BeÅŸiktaÅŸ;Komedi;16.02.2026 19:00;BKM Mutfak Ã‡arÅŸÄ±;SinanpaÅŸa Mah. HasfÄ±rÄ±n Cad. No:75, BeÅŸiktaÅŸ;Ä°stanbul
Sendromsuzluk;Barlar SokaÄŸÄ±;Konser;16.02.2026 20:00;Karga Bar;CaferaÄŸa Mah. Kadife Sok. No:16, KadÄ±kÃ¶y;Ä°stanbul
Bir Delinin HatÄ±ra..;Sahil;Tiyatro;16.02.2026 20:30;FiÅŸekhane;KazlÄ±Ã§eÅŸme Mah. Kennedy Cad. No:52, Zeytinburnu;Ä°stanbul
Evdeki Saat;Pera;Konser;16.02.2026 21:00;Blind;AsmalÄ± Mescit Mah. Åehbender Sok. No:3, BeyoÄŸlu;Ä°stanbul
MÃ¼ze Gezisi;Galataport;Sergi;17.02.2026 14:00;Ä°stanbul Modern;KÄ±lÄ±Ã§ali PaÅŸa Mah. Tophane Ä°skele Cad. No:1, BeyoÄŸlu;Ä°stanbul
Cyrano;Maslak;Tiyatro;17.02.2026 20:00;Maximum Uniq Hall;Huzur Mah. Maslak AyazaÄŸa Cad. No:4, SarÄ±yer;Ä°stanbul
BÃ¼yÃ¼k Ev Ablukada;Ä°stiklal;Konser;17.02.2026 20:30;Ses Tiyatrosu;Ä°stiklal Cad. Halep PasajÄ± No:62, BeyoÄŸlu;Ä°stanbul
SalÄ± SallanÄ±r;Nevizade;Parti;17.02.2026 22:00;Ritim Pera;HÃ¼seyinaÄŸa Mah. Sahne Sok., BeyoÄŸlu;Ä°stanbul
Mabel Matiz;Maslak;Konser;18.02.2026 20:30;Volkswagen Arena;Huzur Mah. Maslak AyazaÄŸa Cad. 4/A, SarÄ±yer;Ä°stanbul
Quiz Night;KadÄ±kÃ¶y;YarÄ±ÅŸma;18.02.2026 20:30;Arkaoda;CaferaÄŸa Mah. Kadife Sok. No:18, KadÄ±kÃ¶y;Ä°stanbul
GÃ¼neÅŸ;Taksim;Konser;18.02.2026 21:00;Dorock XL Venue;Ä°stiklal Cad. FitaÅŸ PasajÄ± No:12, BeyoÄŸlu;Ä°stanbul
Oldies But Goldies;Bomonti;Parti;18.02.2026 22:00;Babylon;Merkez Mah. SilahÅŸÃ¶r Cad. Bomonti Bira FabrikasÄ± No:1, ÅiÅŸli;Ä°stanbul
Arter Gezisi;Dolapdere;Sergi;19.02.2026 19:00;Arter;YeniÅŸehir Mah. Irmak Cad. No:13, BeyoÄŸlu;Ä°stanbul
Can Bonomo;Vadi AVM;Konser;19.02.2026 21:00;JJ Vadistanbul;AyazaÄŸa Mah. Cendere Cad. 109/C, SarÄ±yer;Ä°stanbul
Techno;Cihangir;Parti;19.02.2026 22:00;Klinik;HÃ¼seyinaÄŸa Mah. TopÃ§ekenler Sok., BeyoÄŸlu;Ä°stanbul
R&B Night;ManzaralÄ±;Parti;19.02.2026 23:00;360 Ä°stanbul;Ä°stiklal Cad. MÄ±sÄ±r Apt. No:163/8, BeyoÄŸlu;Ä°stanbul
Melike Åahin;BostancÄ±;Konser;20.02.2026 21:30;BostancÄ± GÃ¶steri Merkezi;BostancÄ± Mah. BaÄŸdat Cad., KadÄ±kÃ¶y;Ä°stanbul
House Night;Maslak;Parti;20.02.2026 23:00;Klein PhÃ¶nix;AtatÃ¼rk Sanayi Sitesi 1. KÄ±sÄ±m 43. Sok., SarÄ±yer (Maslak);Ä°stanbul
Dark Techno;Taksim;Parti;20.02.2026 23:59;RX Istanbul;Cihangir Mah. SÄ±raselviler Cad. No:33, BeyoÄŸlu;Ä°stanbul
Antika PazarÄ±;Bomonti;Gezi;21.02.2026 11:00;FerikÃ¶y PazarÄ±;Cumhuriyet Mah. Semt PazarÄ± No:8, ÅiÅŸli;Ä°stanbul
Kahve AtÃ¶lyesi;Maslak;AtÃ¶lye;21.02.2026 14:00;MSA;Maslak Meydan Sok. Beybi Giz Plaza, SarÄ±yer;Ä°stanbul
Motive;BayrampaÅŸa;Konser;21.02.2026 21:00;Ora Arena;AltÄ±ntepsi Mah. Bi Ä°stanbul Cad., BayrampaÅŸa;Ä°stanbul
Sabaha Kadar Dans;KarakÃ¶y;Parti;21.02.2026 23:59;Suma Han;Bankalar Cad. YanÄ±kkapÄ± Sok., BeyoÄŸlu;Ä°stanbul
MÃ¼ze Gazhane;HasanpaÅŸa;Sosyal;22.02.2026 13:00;MÃ¼ze Gazhane;HasanpaÅŸa Mah. KurbaÄŸalÄ±dere Cad. No:125, KadÄ±kÃ¶y;Ä°stanbul
KapanÄ±ÅŸ Partisi;KadÄ±kÃ¶y;EÄŸlence;22.02.2026 21:00;Mecra;CaferaÄŸa Mah. DumlupÄ±nar Sok. No:5, KadÄ±kÃ¶y;Ä°stanbul
Anadolu Efes - BSL MaÃ§Ä±;Basketbol SÃ¼per Ligi;Spor;15.02.2026 13:00;Sinan Erdem Spor Salonu;AtakÃ¶y 3-4-11. KÄ±sÄ±m Mah., BakÄ±rkÃ¶y;Ä°stanbul
Oda MÃ¼ziÄŸi Konseri;Tarihi Bina;Konser;15.02.2026 16:00;SÃ¼reyya OperasÄ±;CaferaÄŸa Mah. Bahariye Cad. No:29, KadÄ±kÃ¶y;Ä°stanbul
Bir Baba Hamlet;KapalÄ± GiÅŸe Efsane;Tiyatro;15.02.2026 20:30;Baba Sahne;CaferaÄŸa Mah. Bahariye Cad. No:17, KadÄ±kÃ¶y;Ä°stanbul
Film GÃ¶sterimi;Eski Fabrika;Sinema;16.02.2026 18:30;Beykoz Kundura Sinema;YalÄ±kÃ¶y Mah. SÃ¼reyya Ä°lmen Cad. No:1, Beykoz;Ä°stanbul
Jazz & Comedy;Caz KulÃ¼bÃ¼;Show;16.02.2026 21:00;TouchÃ© (Zorlu PSM);LevazÄ±m Mah. Koru Sok. Zorlu Center, BeÅŸiktaÅŸ;Ä°stanbul
Salt Galata Turu;Ãœcretsiz / Tarihi;Sergi;17.02.2026 11:00;Salt Galata;AzapkapÄ± Mah. Bankalar Cad. No:11, KarakÃ¶y;Ä°stanbul
BÃ¼tÃ¼n Ã‡Ä±lgÄ±nlar Sever Beni;Ä°liÅŸki Komedisi;Tiyatro;17.02.2026 20:30;Moda Sahnesi;CaferaÄŸa Mah. Halil Ethem Sok., KadÄ±kÃ¶y;Ä°stanbul
Borusan Quartet;Klasik MÃ¼zik;Konser;18.02.2026 20:00;ENKA Oditoryumu;Sadi GÃ¼lÃ§elik Spor Sitesi, Ä°stinye, SarÄ±yer;Ä°stanbul
Soft Analog;Indie Pop;Konser;18.02.2026 21:00;Salon Ä°KSV;Evliya Ã‡elebi Mah. MeÅŸrutiyet Cad. No:5, ÅiÅŸhane;Ä°stanbul
FenerbahÃ§e Beko - EuroLeague;Avrupa MaÃ§Ä±;Spor;19.02.2026 19:45;Ãœlker Sports Arena;Barbaros Mah. Ihlamur Sok., AtaÅŸehir;Ä°stanbul
Bar PsikoloÄŸu;Ä°nteraktif;Show;19.02.2026 21:00;BKM Mutfak KadÄ±kÃ¶y;CaferaÄŸa Mah. General AsÄ±m GÃ¼ndÃ¼z Cad. No:35, KadÄ±kÃ¶y;Ä°stanbul
House Set;KÃ¼lt Mekan;Parti;19.02.2026 22:00;Gizli BahÃ§e;Åehit Muhtar Mah. Nevizade Sok. No:27, BeyoÄŸlu;Ä°stanbul
Taxim (Baba Sahne);Kara Komedi;Tiyatro;20.02.2026 20:30;Baba Sahne;CaferaÄŸa Mah. Bahariye Cad. No:17, KadÄ±kÃ¶y;Ä°stanbul
Hey! Douglas (Live);Yeni Mekan;Konser;20.02.2026 21:00;Frankhan;KemankeÅŸ Karamustafa PaÅŸa, KemankeÅŸ Cad. No:49, KarakÃ¶y;Ä°stanbul
CanlÄ± Caz: Ferit Odman;Yemekli Caz;MÃ¼zik;20.02.2026 22:30;The Badau;AcÄ±badem Mah. Ã‡eÃ§en Sok. Akasya AVM, ÃœskÃ¼dar;Ä°stanbul
BoÄŸaz'da YÃ¼rÃ¼yÃ¼ÅŸ & KahvaltÄ±;Deniz KenarÄ±;Keyif;21.02.2026 10:00;Feriye;YÄ±ldÄ±z Mah. Ã‡Ä±raÄŸan Cad. No:44, OrtakÃ¶y/BeÅŸiktaÅŸ;Ä°stanbul
Kitap & Kahve;Tarihi KitapÃ§Ä±;Keyif;21.02.2026 14:00;Minoa Pera;MeÅŸrutiyet Cad. No:99, TepebaÅŸÄ±, BeyoÄŸlu;Ä°stanbul
Dolu Kadehi Ters Tut;Dev Sahne;Konser;21.02.2026 20:00;KÃ¼Ã§Ã¼kÃ‡iftlik Park (KapalÄ±);Harbiye Mah. KadÄ±rgalar Cad. No:4, MaÃ§ka;Ä°stanbul
BÃ¼yÃ¼k Ev Ablukada;Alternatif;Konser;21.02.2026 21:00;MÃ¼ze Gazhane;HasanpaÅŸa Mah. KurbaÄŸalÄ±dere Cad. No:125, KadÄ±kÃ¶y;Ä°stanbul
Kuzguncuk Turu;Nostaljik Semt;Gezi;22.02.2026 13:00;Kuzguncuk BostanÄ±;Kuzguncuk Mah. Ä°cadiye Cad., ÃœskÃ¼dar;Ä°stanbul
Notre Dame'Ä±n Kamburu;Klasik;MÃ¼zikal;22.02.2026 15:00;Trump Sahne;KuÅŸtepe Mah. MecidiyekÃ¶y Yolu Cad. No:12, ÅiÅŸli;Ä°stanbul
Galata Kulesi GÃ¼n BatÄ±mÄ±;Manzara;Gezi;22.02.2026 17:00;Galata Kulesi;Bereketzade Mah., BeyoÄŸlu;Ä°stanbul
"@

$creatorId = "b9a714fa-db62-47d4-b5d9-4e723646a3d5"
$organizer = "muratveozturk@gmail.com"
$baseTs = 1771100000000
$now = "2026-02-14 12:00:00+00"

# Image URL mapping by category
$imageMap = @{
    "Konser"   = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop"
    "Tiyatro"  = "https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&h=600&fit=crop"
    "Parti"    = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=600&fit=crop"
    "AtÃ¶lye"   = "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    "Komedi"   = "https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&h=600&fit=crop"
    "Sergi"    = "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?w=800&h=600&fit=crop"
    "MÃ¼zik"    = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&h=600&fit=crop"
    "Ã‡ocuk"    = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&h=600&fit=crop"
    "YarÄ±ÅŸma"  = "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&h=600&fit=crop"
    "Spor"     = "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=600&fit=crop"
    "GÃ¶steri"  = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
    "Show"     = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"
    "Keyif"    = "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop"
    "Gezi"     = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop"
    "MÃ¼zikal"  = "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&h=600&fit=crop"
    "Sinema"   = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600&fit=crop"
    "Opera"    = "https://images.unsplash.com/photo-1580809361436-42a7ec204889?w=800&h=600&fit=crop"
    "Dans"     = "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=800&h=600&fit=crop"
    "Bar"      = "https://images.unsplash.com/photo-1572116469696-31de0f17cc34?w=800&h=600&fit=crop"
    "Talk Show"= "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=600&fit=crop"
    "KÃ¼ltÃ¼r"   = "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800&h=600&fit=crop"
    "Sosyal"   = "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop"
    "EÄŸlence"  = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=600&fit=crop"
}
$defaultImage = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=600&fit=crop"

# Coordinate lookup by venue name (lat, lon)
$venueCoords = @{
    # ANKARA
    "CerModern"                    = @(39.9334, 32.8540)
    "NOA Coffee & Art"             = @(39.9120, 32.8370)
    "BergÃ¼zar Sahne"               = @(39.9650, 32.7900)
    "GreyShake Coffee"             = @(39.9400, 32.6750)
    "Tatbikat Sahnesi"             = @(39.9080, 32.8520)
    "CSO Ada Ankara"               = @(39.9420, 32.8600)
    "MÃ¼jgÃ¢n 100. YÄ±l"             = @(39.9000, 32.8350)
    "Jolly Joker Ankara"           = @(39.9080, 32.8586)
    "Milyon Performance"           = @(39.9220, 32.8310)
    "MEB Åura Salonu"              = @(39.9270, 32.8360)
    "NazÄ±m Hikmet KM"              = @(39.9680, 32.8050)
    "EditÃ¶r DÃ¼kkan"                = @(39.9030, 32.8640)
    "Coffee UP"                    = @(39.9220, 32.8290)
    "Lola Kitchen"                 = @(39.8850, 32.8100)
    "IF Performance Tunus"         = @(39.9075, 32.8600)
    "Berlin Cafe Pub"              = @(39.9210, 32.8550)
    "Korkut Ata KM"                = @(39.9460, 32.6820)
    "6:45 KK Ankara"               = @(39.9085, 32.8610)
    "ahzuita"                      = @(39.9070, 32.8560)
    "MÃ¼jgÃ¢n BestekÃ¢r"              = @(39.9097, 32.8586)
    "Ã‡ankaya Sahne"                = @(39.9060, 32.8530)
    "FADE Stage"                   = @(39.9075, 32.8590)
    "100. YÄ±l Central Bar"         = @(39.8990, 32.8340)
    "KulÃ¼p MÃ¼jgan"                 = @(39.9097, 32.8586)
    "Holly Stone TunalÄ±"           = @(39.9060, 32.8600)
    "Artun Sanat Merkezi"          = @(39.8720, 32.7500)
    "CÃ¼neyt GÃ¶kÃ§er Sahnesi"        = @(39.8700, 32.7450)
    "Bin 71 & Anka Pera"           = @(39.9050, 32.8600)
    "Congresium Ankara"            = @(39.9050, 32.8050)
    "ZÃ¼rafa PSM"                   = @(39.9200, 32.8540)
    "Route Selanik"                = @(39.9210, 32.8560)
    "Vortex Art Club"              = @(39.9060, 32.8610)
    "Last Penny BÃ¼klÃ¼m"            = @(39.9070, 32.8595)
    "Erimtan Arkeoloji MÃ¼zesi"     = @(39.9410, 32.8640)
    "Bambu Sahne"                  = @(39.9200, 32.8540)
    "June Pub"                     = @(39.9225, 32.8300)
    "Farabi Sahnesi"               = @(39.9070, 32.8530)
    "Tenedos Pub"                  = @(39.9085, 32.8510)
    "Samm's Bistro"                = @(39.9150, 32.8600)
    "Shelter Stage"                = @(39.9097, 32.8586)
    "Pixel"                        = @(39.9085, 32.8610)
    "Kite"                         = @(39.9030, 32.8650)
    "Liva Pastanesi (Ã‡ukurambar)"  = @(39.9100, 32.8200)
    # ANTALYA
    "KÄ±zÄ±lkule MeydanÄ±"            = @(36.5450, 31.9950)
    "Antalya KÃ¼ltÃ¼r Sanat"         = @(36.8870, 30.7100)
    "HaÅŸim Ä°ÅŸcan KM"               = @(36.8860, 30.7080)
    "Mall of Antalya GM"           = @(36.9300, 30.7200)
    "Tudors Arena"                 = @(36.8840, 30.7040)
    "Simurg Temple"                = @(36.8850, 30.7060)
    "Sponge Pub KaleiÃ§i"           = @(36.8845, 30.7045)
    "Golden Time Karaoke"          = @(36.8550, 30.7480)
    "Olbia Sanat Galerisi"         = @(36.8930, 30.6350)
    "Varuna Gezgin"                = @(36.8850, 30.7055)
    "Holly Stone"                  = @(36.8840, 30.7050)
    "HaÅŸim Ä°ÅŸcan KM (Opera)"      = @(36.8860, 30.7080)
    "Raven Pub"                    = @(36.8855, 30.7065)
    "Antalya MÃ¼zesi"               = @(36.8850, 30.6830)
    "Leman KÃ¼ltÃ¼r"                 = @(36.8870, 30.7050)
    "Sir Winston Pub"              = @(36.8750, 30.6500)
    "Soho Club"                    = @(36.8560, 30.7480)
    "DokumaPark"                   = @(36.9250, 30.7100)
    "AKM Aspendos Salonu"          = @(36.8680, 30.6700)
    "Roots Antalya"                = @(36.8850, 30.7050)
    "Up Shot Bar"                  = @(36.8845, 30.7045)
    "The Big Man"                  = @(36.8560, 30.7490)
    "Cinemaximum Migros"           = @(36.8700, 30.6400)
    "Jolly Joker Antalya"          = @(36.8560, 30.7500)
    "TÃ¼rkan Åoray KÃ¼ltÃ¼r Merkezi"  = @(36.8800, 30.6800)
    "NazÄ±m Hikmet Kongre Merkezi"  = @(36.8680, 30.6550)
    "Social Point"                 = @(36.8560, 30.7470)
    "Sponge Pub KonyaaltÄ±"        = @(36.8730, 30.6480)
    "The Roxx Pub"                 = @(36.8855, 30.7060)
    "Holly Stone Performance"      = @(36.8840, 30.7050)
    "The Bar"                      = @(36.8850, 30.7060)
    "Cactus Garden (Lara)"         = @(36.8600, 30.7450)
    "Aura Club Kemer"              = @(36.5970, 30.5570)
    "Pixel Night Club"             = @(36.8850, 30.7065)
    "Ã‡akÄ±rlar KÃ¶y KahvaltÄ±sÄ±"      = @(36.9100, 30.5800)
    "Sandland"                     = @(36.8520, 30.7600)
    "TÃ¼nektepe Teleferik"          = @(36.8870, 30.6200)
    # Ä°STANBUL
    "Tamirane Akasya"              = @(41.0050, 29.0400)
    "Pera MÃ¼zesi"                  = @(41.0320, 28.9740)
    "Zorlu PSM"                    = @(41.0690, 29.0170)
    "CKM (Caddebostan KM)"        = @(40.9660, 29.0620)
    "DasDas"                       = @(40.9870, 29.1100)
    "TuzBiber Sahne"               = @(40.9900, 29.0260)
    "BostancÄ± GÃ¶steri Merkezi"     = @(40.9600, 29.0700)
    "AKM TÃ¼rk Telekom"             = @(41.0370, 28.9850)
    "IF Performance BeÅŸiktaÅŸ"      = @(41.0430, 29.0050)
    "Nardis Jazz Club"             = @(41.0260, 28.9740)
    "Dorock XL KadÄ±kÃ¶y"            = @(40.9900, 29.0270)
    "BKM Mutfak Ã‡arÅŸÄ±"            = @(41.0430, 29.0060)
    "Karga Bar"                    = @(40.9900, 29.0280)
    "FiÅŸekhane"                    = @(41.0040, 28.9060)
    "Blind"                        = @(41.0330, 28.9760)
    "Ä°stanbul Modern"              = @(41.0260, 28.9830)
    "Maximum Uniq Hall"            = @(41.1080, 29.0200)
    "Ses Tiyatrosu"                = @(41.0340, 28.9780)
    "Ritim Pera"                   = @(41.0340, 28.9770)
    "Volkswagen Arena"             = @(41.1090, 29.0210)
    "Arkaoda"                      = @(40.9905, 29.0280)
    "Dorock XL Venue"              = @(41.0340, 28.9770)
    "Babylon"                      = @(41.0550, 28.9800)
    "Arter"                        = @(41.0400, 28.9780)
    "JJ Vadistanbul"               = @(41.1050, 29.0150)
    "Klinik"                       = @(41.0340, 28.9770)
    "360 Ä°stanbul"                 = @(41.0340, 28.9760)
    "Klein PhÃ¶nix"                 = @(41.1100, 29.0200)
    "RX Istanbul"                  = @(41.0340, 28.9830)
    "FerikÃ¶y PazarÄ±"               = @(41.0560, 28.9810)
    "MSA"                          = @(41.1080, 29.0220)
    "Ora Arena"                    = @(41.0500, 28.9000)
    "Suma Han"                     = @(41.0230, 28.9740)
    "MÃ¼ze Gazhane"                 = @(40.9920, 29.0350)
    "Mecra"                        = @(40.9900, 29.0260)
    "Sinan Erdem Spor Salonu"      = @(40.9800, 28.8520)
    "SÃ¼reyya OperasÄ±"              = @(40.9910, 29.0260)
    "Baba Sahne"                   = @(40.9910, 29.0260)
    "Beykoz Kundura Sinema"        = @(41.1300, 29.1000)
    "TouchÃ© (Zorlu PSM)"           = @(41.0690, 29.0170)
    "Salt Galata"                  = @(41.0220, 28.9740)
    "Moda Sahnesi"                 = @(40.9870, 29.0290)
    "ENKA Oditoryumu"              = @(41.1100, 29.0550)
    "Salon Ä°KSV"                   = @(41.0280, 28.9720)
    "Ãœlker Sports Arena"           = @(40.9870, 29.1100)
    "BKM Mutfak KadÄ±kÃ¶y"          = @(40.9900, 29.0280)
    "Gizli BahÃ§e"                  = @(41.0340, 28.9780)
    "Frankhan"                     = @(41.0230, 28.9770)
    "The Badau"                    = @(41.0050, 29.0400)
    "Feriye"                       = @(41.0480, 29.0280)
    "Minoa Pera"                   = @(41.0320, 28.9750)
    "KÃ¼Ã§Ã¼kÃ‡iftlik Park (KapalÄ±)"  = @(41.0460, 28.9940)
    "Kuzguncuk BostanÄ±"            = @(41.0280, 29.0370)
    "Trump Sahne"                  = @(41.0640, 28.9910)
    "Galata Kulesi"                = @(41.0256, 28.9741)
    "Melike Åahin"                 = @(40.9600, 29.0700)
}

# City center fallback coords
$cityFallback = @{
    "Ankara"    = @(39.9208, 32.8541)
    "Antalya"   = @(36.8870, 30.7100)
    "Ä°stanbul"  = @(41.0082, 28.9784)
}

$lines = $csvData -split "`n" | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine("-- Batch Event Insert - Generated $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
[void]$sb.AppendLine("-- Total events: $($lines.Count)")
[void]$sb.AppendLine("")

$counter = 0
foreach ($line in $lines) {
    $parts = $line -split ";"
    if ($parts.Count -lt 7) { continue }

    $title       = $parts[0].Trim()
    $description = $parts[1].Trim()
    $category    = $parts[2].Trim()
    $dateTimeStr = $parts[3].Trim()
    $location    = $parts[4].Trim()
    $address     = $parts[5].Trim()
    $city        = $parts[6].Trim()

    # Parse date/time
    $dtParts = $dateTimeStr -split " "
    $dateParts = $dtParts[0] -split "\."
    $dateVal = "$($dateParts[2])-$($dateParts[1])-$($dateParts[0])"
    $timeVal = $dtParts[1]

    # Generate unique ID
    $id = "user-$creatorId-$($baseTs + $counter)"
    $counter++

    # Get image URL
    $imageUrl = $imageMap[$category]
    if (-not $imageUrl) { $imageUrl = $defaultImage }

    # Get coordinates
    $coords = $venueCoords[$location]
    if (-not $coords) {
        $coords = $cityFallback[$city]
        if (-not $coords) { $coords = @(39.9208, 32.8541) }
        # Add small offset to avoid exact overlap
        $coords = @($coords[0] + ([System.Math]::Round(($counter * 0.0003) % 0.01, 6)), $coords[1] + ([System.Math]::Round(($counter * 0.0002) % 0.01, 6)))
    }
    $lat = $coords[0].ToString("F8").Replace(",", ".")
    $lon = $coords[1].ToString("F8").Replace(",", ".")

    # Escape single quotes in strings
    $titleEsc = $title.Replace("'", "''")
    $descEsc  = $description.Replace("'", "''")
    $catEsc   = $category.Replace("'", "''")
    $locEsc   = $location.Replace("'", "''")
    $addrEsc  = $address.Replace("'", "''")
    $cityEsc  = $city.Replace("'", "''")

    $insert = @"
INSERT INTO "public"."events" ("id", "created_at", "updated_at", "title", "description", "category", "image_url", "date", "time", "location", "city", "price_min", "price_max", "organizer", "attendees", "latitude", "longitude", "location_point", "is_premium", "source", "creator_id", "address", "end_time", "status", "rejection_reason", "submitted_at", "reviewed_at", "reviewed_by", "report_count", "max_attendees", "hidden_at") VALUES ('$id', '$now', '$now', '$titleEsc', '$descEsc', '$catEsc', '$imageUrl', '$dateVal', '$timeVal', '$locEsc', '$cityEsc', '0', '0', '$organizer', '0', '$lat', '$lon', ST_SetSRID(ST_MakePoint($lon, $lat), 4326), 'false', 'user-created', '$creatorId', '$addrEsc', null, 'approved', null, '$now', '$now', '$creatorId', '0', null, null);
"@

    [void]$sb.AppendLine($insert)
}

[void]$sb.AppendLine("")
[void]$sb.AppendLine("-- Update location_point for all inserted events (fallback if ST_MakePoint not available)")
[void]$sb.AppendLine("-- UPDATE public.events SET location_point = ST_SetSRID(ST_MakePoint(longitude::float, latitude::float), 4326) WHERE location_point IS NULL AND source = 'user-created';")

$outputPath = Join-Path $PSScriptRoot "events_batch_insert.sql"
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($outputPath, $sb.ToString(), $utf8NoBom)
Write-Host "SQL file generated: $outputPath"
Write-Host "Total events: $($lines.Count)"
