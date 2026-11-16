from collections import OrderedDict

GAMES = OrderedDict([
 ("kelime", dict(title="Zırva Kelime", emoji="🔤", grad=("#34d399", "#4c8dff"),
    desc="5 harfli günün kelimesini 6 denemede bul.",
    rules=["Her gün yeni bir 5 harfli Türkçe kelime saklanır.", "6 denemen var. Her tahminden sonra harfler renklenir.",
           "🟩 doğru harf, doğru yer · 🟨 harf var ama yeri yanlış · ⬛ kelimede yok.", "Klavyeden veya ekrandaki tuşlardan yazabilirsin."])),
 ("kodkir", dict(title="Kod Kır", emoji="🎯", grad=("#a56bff", "#ff5c7a"),
    desc="Gizli 4 renkli kodu 8 denemede çöz.",
    rules=["Gizli kod 4 renkten oluşur, renkler tekrar edebilir.", "Renkleri seç, Dene'ye bas.", "⚫ renk de yer de doğru · ⚪ renk doğru ama yeri yanlış.", "8 denemede kodu bul."])),
 ("hedef24", dict(title="Hedef 24", emoji="🧮", grad=("#f59e0b", "#ef4444"),
    desc="4 sayıyla dört işlem yap, sonucu 24 yap.",
    rules=["4 sayı verilir, hepsini kullanmalısın.", "Bir sayı seç, işlem seç, ikinci sayıyı seç.", "Sonuç yeni bir sayı olur. Tek sayı kalınca 24 olmalı.", "Her bulmacanın en az bir çözümü vardır."])),
 ("kaydir", dict(title="Kaydırmalı", emoji="🧩", grad=("#4c8dff", "#a56bff"),
    desc="Sayıları sıraya diz, boşluğu kullanarak kaydır.",
    rules=["Karışık sayıları 1'den başlayarak sıraya diz.", "Boşluğa komşu bir taşa tıkla veya ok tuşlarını kullan.", "Pratik modda 4x4 boyutunu da deneyebilirsin."])),
 ("hafiza", dict(title="Hafıza Kartları", emoji="🃏", grad=("#ec4899", "#f59e0b"),
    desc="Eş kartları en az hamlede bul.",
    rules=["Kartları çevirip aynı emojili çiftleri bul.", "Eşleşmeyenler tekrar kapanır.", "Ne kadar az hamle, o kadar çok yıldız."])),
 ("emoji", dict(title="Emoji Bilmece", emoji="🤔", grad=("#10b981", "#f59e0b"),
    desc="Emojilerden hangi şey olduğunu tahmin et.",
    rules=["Her soruda emojiler bir şeyi anlatır.", "4 şıktan doğrusunu seç.", "5 soruda en az 3 doğru yaparsan kazanırsın."])),
])

_N = [
 ("kelimeavi","Kelime Avı","🔎",("#14b8a6","#4c8dff"),"kelime","Harf tablosunda gizlenmiş temalı kelimeleri bul.",["Tabloda 8 yönde (ters de dahil) kelimeler saklı.","Parmağınla veya fareyle sürükle; ya da ilk ve son harfe sırayla dokun.","Liste kısmındaki tüm kelimeleri bul.","💡 İpucu bir kelimenin ilk harfini gösterir ama bir yıldız götürür."]),
 ("passaparola","Passaparola","🎡",("#a56bff","#ec4899"),"kelime","270 saniyede 28 harfin tamamının ipucunu çöz.",["Çemberdeki 28 harfin her biri için ipucu verilir; cevap o harfle başlar.","Bilemezsen Pas de, sıra sonra tekrar gelir.","Türkçe karakter yazmak zorunda değilsin (ş yerine s olur).","270 saniyede en az 14 doğru yaparsan kazanırsın."]),
 ("adamasmaca","Adam Asmaca","🪢",("#ef4444","#f59e0b"),"kelime","6 hatadan önce gizli kelimeyi bul.",["Kategori verilir, harf tahmin edersin.","Yanlış harf adamı bir parça çizer, 6 hatada kaybedersin.","Klavyeden veya ekrandaki tuşlardan oynayabilirsin."]),
 ("anagram","Harf Karıştır","🔀",("#f59e0b","#34d399"),"kelime","Karışık harflerden kelimeyi çıkar.",["5 kelime, her biri için 40 saniye.","Harflere sırayla dokunarak kelimeyi kur.","💡 İpucu sıradaki harfi koyar ama 8 saniye götürür.","En az 3 kelime çözersen kazanırsın."]),
 ("baglanti","Bağlantı","🧶",("#4c8dff","#a56bff"),"mantik","16 kelimeyi ortak özelliğe göre 4 gruba ayır.",["16 kelime 4'erli 4 gruba aittir.","4 kelime seç ve Gönder'e bas.","4 yanlış hakkın var.","Ses ipucu: 3 doğru bir yanlışsa farklı bir ses duyarsın."]),
 ("dogruyanlis","Doğru mu Zırva mı","⚖️",("#10b981","#4c8dff"),"mantik","10 bilgiden hangisi gerçek, hangisi zırva?",["Her ifade için Doğru ya da Zırva seç.","Cevaptan sonra kısa açıklama çıkar.","10 sorudan 7 doğru yaparsan kazanırsın."]),
 ("mayin","Mayın Tarlası","💣",("#64748b","#ef4444"),"sayi","8x8 tarlada 10 mayına basmadan tüm güvenli kareleri aç.",["Sayı, çevresindeki 8 kareden kaçında mayın olduğunu gösterir.","Bayrak için sağ tık, uzun basma ya da Bayrak modu.","İlk dokunuş her zaman güvenlidir."]),
 ("g2048","2048","🔢",("#f59e0b","#ef4444"),"sayi","Aynı sayıları kaydırıp birleştir, 256'ya ulaş.",["Ok tuşları veya kaydırma ile tüm kareler hareket eder.","Aynı sayılar çarpışınca birleşir.","256'ya ulaşırsan kazanırsın; hamle kalmayınca ya da Bitir ile sonuç hesaplanır."]),
 ("sudoku","Mini Sudoku","🧮",("#4c8dff","#34d399"),"sayi","6x6 tabloyu 1-6 rakamlarıyla doldur.",["Her satırda, sütunda ve 2x3'lük kutuda 1-6 birer kez olmalı.","Bir kutu seç, rakam tuşuna bas.","Çakışan rakamlar kırmızı yanar."]),
 ("isiklar","Işıklar Sönsün","💡",("#fbbf24","#a56bff"),"mantik","Bir kareye basınca kendisi ve komşuları ters döner. Hepsini söndür.",["Dokunduğun kare ve 4 komşusu açılıp kapanır.","Amaç tüm ışıkları söndürmek.","En az hamleyle bitirirsen en çok yıldız."]),
 ("dizi","Sayı Dizisi","📈",("#ec4899","#a56bff"),"sayi","Dizideki kuralı çöz, eksik sayıyı bul.",["Her soruda 5 sayı verilir, 6.'yı bulursun.","4 şıktan doğrusunu seç.","6 sorudan 4 doğru yaparsan kazanırsın."]),
 ("carpim","Çarpım Hızı","⚡",("#ef4444","#f59e0b"),"sayi","60 saniyede en çok çarpmayı çöz.",["Çarpma sorusunun cevabını 4 şıktan seç.","Her yanlış 3 saniye götürür.","12 doğru yaparsan kazanırsın."]),
 ("simon","Renk Dizisi","🎹",("#34d399","#4c8dff"),"refleks","Yanan renkleri aynı sırayla tekrar et.",["Renkler sırayla yanar, sonra sıra sende.","Her turda dizi bir uzar, 8 seviye hedef.","2 canın var."]),
]
for s,t,e,g,c,d,r in _N:
    GAMES[s] = dict(title=t, emoji=e, grad=g, desc=d, rules=r, cat=c)
_N2 = [
 ("sesli","Sesli Harf Kaçtı","🔇",("#6366f1","#ec4899"),"kelime","Sesli harfleri silinmiş kelimeyi tahmin et.",["Kelimenin sesli harfleri nokta (•) olmuş.","4 şıktan doğru kelimeyi seç.","8 sorudan 5 doğru yaparsan kazanırsın."]),
 ("atasozu","Atasözü Tamamla","📜",("#b45309","#f59e0b"),"kelime","Yarım kalan atasözlerini doğru bitir.",["Atasözünün ilk yarısı verilir.","4 şıktan doğru devamı seç.","8 sorudan 5 doğru yaparsan kazanırsın."]),
 ("farkli","Hangisi Farklı","🕵️",("#0ea5e9","#6366f1"),"mantik","Dört kelimeden gruba uymayanı bul.",["3 kelime aynı gruptan, 1 tanesi farklı.","Farklı olanı seç, gizli grubu açıklamada gör.","8 sorudan 5 doğru yaparsan kazanırsın."]),
 ("baskent","Başkent Bilmece","🌍",("#10b981","#0ea5e9"),"kelime","Ülkenin başkentini bul.",["10 ülke, her biri için 4 şık.","7 doğru yaparsan kazanırsın."]),
 ("stroop","Renk Şaşırtmaca","🎨",("#ef4444","#a855f7"),"refleks","Yazının RENGİNİ seç, ne yazdığına kanma!",["Ekranda bir renk adı farklı bir renkle yazılır.","Yazının rengini gösteren butona bas.","Yanlış cevap 2 saniye götürür.","30 saniyede 15 doğru yaparsan kazanırsın."]),
 ("hanoi","Hanoi Kulesi","🗼",("#f59e0b","#ef4444"),"mantik","4 diski ilk çubuktan üçüncüye taşı.",["Bir seferde tek disk taşınır.","Büyük disk küçüğün üstüne konamaz.","En az hamle 15."]),
 ("nonogram","Nonogram","🖼️",("#8b5cf6","#ec4899"),"mantik","Sayı ipuçlarına göre gizli resmi boya.",["Satır ve sütun başındaki sayılar, art arda dolu karelerin uzunluğunu gösterir.","Kareye dokun: dolu → ✕ → boş.","Tüm ipuçları sağlanınca çözülür."]),
 ("flood","Boya Taşması","🌊",("#06b6d4","#a855f7"),"mantik","Sol üstten boyayarak tahtayı tek renk yap.",["Alttaki renklerden birini seç, sol üst bölge o renge dönüşür.","Komşu aynı renkli kareler katılır.","20 hamlede tüm tahtayı tek renk yap."]),
 ("dortgelsin","Dört Gelsin","🔴",("#2563eb","#facc15"),"mantik","Bilgisayara karşı yan yana 4 taşı diz.",["Bir sütuna dokun, taş aşağı düşer.","Yatay, dikey veya çapraz 4 taş dizersen kazanırsın.","Bilgisayar da seni engellemeye çalışır."]),
 ("kostebek","Köstebek Avı","🐹",("#84cc16","#f59e0b"),"refleks","30 saniyede köstebeklere vur, bombalardan kaç.",["🐹 +1, ⭐ +3, 💣 −3 puan.","Delikten çıkanlara hızlıca dokun.","20 puan yaparsan kazanırsın."]),
 ("yilan","Yılan","🐍",("#16a34a","#14b8a6"),"refleks","12 elma ye, duvara ve kendine çarpma.",["Ok tuşları veya kaydırma ile yön ver.","Her elma seni uzatır.","12 elmaya ulaşırsan kazanırsın."]),
 ("susirala","Su Sıralama","🧪",("#3b82f6","#34d399"),"mantik","Renkli suları aynı renkler bir tüpte olacak şekilde sırala.",["Bir tüpe, sonra hedef tüpe dokun.","Üstteki renk aynı renge ya da boş tüpe dökülür.","Her tüp tek renk olunca biter. Geri al düğmesi var."]),
]
for s,t,e,g,c,d,r in _N2:
    GAMES[s] = dict(title=t, emoji=e, grad=g, desc=d, rules=r, cat=c)
for _s in ("kelime","kodkir","hedef24","kaydir","hafiza","emoji"):
    GAMES[_s].setdefault("cat", {"kelime":"kelime","kodkir":"mantik","hedef24":"sayi","kaydir":"mantik","hafiza":"refleks","emoji":"mantik"}[_s])
CATS = [("hepsi","🎲 Hepsi"),("kelime","🔤 Kelime"),("sayi","🔢 Sayı"),("mantik","🧠 Mantık"),("refleks","⚡ Refleks")]
