import random, hashlib, datetime

KIME = ["patronuma", "eşime/sevgilime", "öğretmenime", "arkadaşıma", "ev sahibime", "anneme", "komşuma", "müdüre", "kuzenime", "takım arkadaşıma"]
NE = ["geç kaldım", "toplantıya gelemedim", "ödevi yapamadım", "sözümü tutamadım", "mesaja cevap veremedim", "davete gelemedim", "borcu ödeyemedim", "telefonu açamadım", "randevuyu kaçırdım", "yemeği yapamadım"]
TONLAR = {
    "inandirici": ("🙂", "İnandırıcı", "gündelik ve inandırıcı"),
    "absurt": ("🤪", "Absürt", "tamamen absürt ve abartılı"),
    "dramatik": ("🎭", "Dramatik", "aşırı dramatik, film sahnesi gibi"),
    "bilimsel": ("🔬", "Uydurma Bilimsel", "uydurma bilimsel terimlerle ciddi görünen"),
}

OFFLINE = {
 "inandirici": [
  "Yolda kaza vardı, trafik tamamen durdu ve telefonum da şarjsızdı.",
  "Alarm çalmamış, uyandığımda sabah çoktan olmuştu.",
  "Anahtarı içeride unutup kapıda kaldım, çilingir bekledim.",
  "Telefonum güncelleme yapmaya başladı ve tam 40 dakika hiçbir şeye dokunamadım.",
  "Servis yolda bozuldu, ortada kaldık.",
  "İnternet gitti, bildirimlerin hiçbiri bana ulaşmadı.",
  "Asansör arızalandı, bina görevlisini beklemek zorunda kaldım.",
  "Apartmanda su kesildi, bütün planım altüst oldu.",
 ],
 "absurt": [
  "Kapıdan çıkarken kedim bana 'bugün gitme' diye baktı, kıyamadım.",
  "Asansörde bir kuş ailesiyle mahsur kaldım, hepsini yuvaya götürmem gerekti.",
  "Pantolonumun cebinde küçük bir portal açıldı, çıkış yolunu aradım.",
  "Çaydanlık bana mesaj attı, gidersem küseceğini söyledi.",
  "Sokakta bir güvercin bana iş teklif etti, pazarlık uzadı.",
  "Gölgem yarı yolda dönmek istedi, ikna etmem saatler sürdü.",
  "Buzdolabı gece yarısı konuşmaya başladı, sabaha kadar dinledim.",
  "Çorabımın teki başka bir boyuta kaçtı, onu aradım.",
 ],
 "dramatik": [
  "O sabah güneş doğmadan önce hayatın anlamını sorguladım ve zaman benden kayıp gitti.",
  "Sokağın ucunda bir martı bana baktı ve artık hiçbir şey eskisi gibi olmadı.",
  "Hayat bazen bir otobüs durağında seni durdurur, ben de orada durdum.",
  "Kapıyı açtım ve gökyüzü o kadar güzeldi ki, kendimi tutamadım.",
  "Yağmur başladı ve içimdeki bütün eski hatıralar dışarı döküldü.",
  "Çay demlenirken bir şey fark ettim: hepimiz geçiciyiz. Sonrasını biliyorsun.",
  "Telefonum çaldığında ben kaderle yüzleşiyordum, açamadım.",
 ],
 "bilimsel": [
  "Sirkadiyen ritmim bu sabah galaktik bir kaymaya uğradı, bu durum bilimsel olarak kanıtlanmıştır.",
  "Kuantum belirsizliği yüzünden iki yerde birden olamadım, bu yüzden hiçbirinde olamadım.",
  "Hava basıncındaki ani dalgalanma motivasyon enzimlerimi geç aktifleştirdi.",
  "Beyin dalgalarım Wi-Fi sinyaliyle çakıştı, geçici bir senkron hatası yaşadım.",
  "Ay'ın evresi tam sabah 08.00'de cesaret hormonumu düşürdü.",
  "Serotonin seviyem 'beklemeye al' moduna geçti, laboratuvar sonuçları yarın çıkacak.",
  "Yer çekimi bu sabah normalden %3 fazlaydı, yataktan kalkmak imkânsızdı.",
 ],
}
CLOSERS = ["Umarım anlayış gösterirsin.", "Bir daha olmayacak, söz.", "Kendimi çok kötü hissediyorum ama işte böyle oldu.", "Telafi etmek için elimden geleni yapacağım.", "Lütfen kızma, kalbim kırılgan.", "Gerçekten, yemin ederim doğru söylüyorum."]
OPENERS = {"geç kaldım": "geç kaldım", "toplantıya gelemedim": "toplantıya gelemedim", "ödevi yapamadım": "ödevi yapamadım"}

def make_offline(kime, ne, ton, detail="", extras=None):
    pool = list(OFFLINE.get(ton, OFFLINE["inandirici"])) + list((extras or {}).get(ton, []))
    base = random.choice(pool)
    out = f"{base} Bu yüzden {ne}."
    if detail:
        out += f" Ayrıca {detail.strip().rstrip('.')}."
    return out + " " + random.choice(CLOSERS)

def believability(text):
    h = int(hashlib.md5(text.encode("utf-8")).hexdigest()[:6], 16)
    return 31 + h % 68

def daily_excuse(extras=None):
    d = datetime.date.today().isoformat()
    rnd = random.Random(d)
    ton = rnd.choice(list(OFFLINE))
    pool = list(OFFLINE[ton]) + list((extras or {}).get(ton, []))
    return ton, rnd.choice(pool)

# ---- Kızartma Odası (yedek) ----
ROAST_LEVELS = {1: ("Hafif", "çok hafif ve sevimli"), 2: ("Orta", "esprili ve biraz iğneleyici ama sevecen"), 3: ("Acı", "keskin, zekice ve abartılı ama kırıcı olmayan")}
ROAST_OFFLINE = {
 1: ["“{x}” demişsin, cesaretini takdir ediyorum. Planın biraz fazla iyimser ama sevimli.",
     "{x}: Bunu ciddi ciddi düşünüyor olman bile başlı başına bir enerji."],
 2: ["“{x}”... Bunu yazarken yüz ifadeni görmek isterdim, eminim çok kendinden emindin.",
     "{x} mi? Güzel plan, uygulayacak kişi dışında her şey hazır."],
 3: ["“{x}”: Bu cümle bir yaşam tarzı değil, bir itiraf. Mikrofon bırakılmalı.",
     "{x}. Bilimsel olarak bu seviyede özgüvene ancak internet bağlantısı olmayan insanlar sahip olabilir."],
}
def roast_offline(text, level, extras=None):
    pool = ROAST_OFFLINE.get(level, ROAST_OFFLINE[2]) + list(extras or [])
    x = text.strip()[:120]
    t = random.choice(pool)
    return t.replace("{x}", x) if "{x}" in t else t

# ---- Burç parodisi ----
SIGNS = [("koc", "Koç", "♈"), ("boga", "Boğa", "♉"), ("ikizler", "İkizler", "♊"), ("yengec", "Yengeç", "♋"), ("aslan", "Aslan", "♌"), ("basak", "Başak", "♍"),
         ("terazi", "Terazi", "♎"), ("akrep", "Akrep", "♏"), ("yay", "Yay", "♐"), ("oglak", "Oğlak", "♑"), ("kova", "Kova", "♒"), ("balik", "Balık", "♓")]
BURC = {
 "genel": ["Bugün evren sana göz kırpıyor ama gözüne bir şey kaçmış olabilir.", "Bugün büyük kararlar için uygun değil, ne yiyeceğine karar vermen bile yeterli.", "Gökyüzü karışık: Merkür ile Mars tartışıyor, sen sadece ortada kalıyorsun.", "Bugün biri sana bir tavsiye verecek, sen de hiç dinlemeyeceksin.", "Enerjin yüksek, odağın düşük. Klasik sen.", "Bugün en iyi hamlen: hiçbir şey yapmamak ve bunu stratejik diye adlandırmak."],
 "ask": ["Aşkta bugün mesajına geç cevap gelirse üzülme, o da senin gibi telefonu kaybetmiş olabilir.", "Bir tanıdık seni aklında tutuyor, muhtemelen borcu olduğu için.", "Kalbinde bir kıpırdanma var, büyük ihtimalle kahve fazla gelmiştir.", "Bugün flört için uygun değilsin, o gün aynaya bile dikkatli bak.", "Eski biri aklına gelecek. Cevap verme, o seni unutmuş bile."],
 "is": ["İşte bugün toplantı mail olabilirdi, sen yine de katılacaksın.", "Patronun ruh halini erkenden kontrol et, bugün hava dalgalı.", "Terfi senin için henüz uzak ama kahve makinesi sana sadık.", "Bugün yapman gereken bir şey ertelenecek ve yine de dünya dönmeye devam edecek.", "Mesai bitmeden son bir e-posta gelecek, bilerek öyle yapacak."],
 "sanssiz": ["çorabın teki", "otobüs kaçırmak", "telefon şarjı %1", "yanlış kişiye gönderilen mesaj", "kapıda unutulan anahtar", "dilini yakan çay", "asansörde kalan tek kişi olmak"],
 "tavsiye": ["Su iç, hayat güzel.", "Bugün kimseye mesaj atma.", "Kahveyi çift yap.", "Dolabı bir kez daha kontrol et.", "Yürüyüşe çık, düşünceler orada kalır.", "Planlarını erteleme, ertelemeyi planla."],
 "renk": ["Pembe", "Mor", "Turkuaz", "Turuncu", "Lacivert", "Yeşil", "Altın"],
}
def horoscope(slug, day=None):
    day = day or datetime.date.today().isoformat()
    rnd = random.Random(f"{day}-{slug}")
    return {
        "genel": rnd.choice(BURC["genel"]), "ask": rnd.choice(BURC["ask"]), "is": rnd.choice(BURC["is"]),
        "sanssiz": rnd.choice(BURC["sanssiz"]), "tavsiye": rnd.choice(BURC["tavsiye"]),
        "renk": rnd.choice(BURC["renk"]), "sayi": rnd.randint(1, 99),
        "puan": {"ask": rnd.randint(1, 5), "is": rnd.randint(1, 5), "enerji": rnd.randint(1, 5)},
    }
