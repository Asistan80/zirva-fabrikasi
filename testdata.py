# Saçma testler: her cevap bir sonuç anahtarına puan verir, en çok puan alan sonuç çıkar.
TESTS = {
 "padisah": {
  "title": "Hangi Osmanlı Padişahısın?",
  "emoji": "👑",
  "desc": "Bilimsel hiçbir dayanağı yok. Tarih hocası görürse ağlar.",
  "questions": [
   ("Pazar sabahı ilk işin?", [("Kahvaltı sofrasını kurmak", "fatih"), ("Yatakta 2 saat daha yatmak", "ibrahim"), ("Plan yapmak, liste çıkarmak", "kanuni"), ("Telefona bakıp kaybolmak", "ii_osman")]),
   ("Grup projesinde rolün?", [("Lider, herkes beni dinler", "fatih"), ("Sessizce işi bitiren", "kanuni"), ("Fikir veririm ama yapmam", "ibrahim"), ("Son güne kadar görünmem", "ii_osman")]),
   ("Maaş yattı, ne yaparsın?", [("Hemen yatırım düşünürüm", "kanuni"), ("Bir hafta içinde bitirmiş olurum", "ibrahim"), ("Büyük bir şey alırım", "fatih"), ("Kimseye söylemem, saklarım", "ii_osman")]),
   ("Arkadaşınla tartıştın:", [("Haklı olduğumu ispat ederim", "fatih"), ("Konuyu uzatmadan kapatırım", "kanuni"), ("Mesajı görmezden gelirim", "ii_osman"), ("Ertesi gün bir şey olmamış gibi yaparım", "ibrahim")]),
   ("Favori mekanın?", [("Büyük, gösterişli bir yer", "fatih"), ("Sessiz bir kütüphane", "kanuni"), ("Evim, battaniyem", "ibrahim"), ("Hiçbiri, ben dışarı çıkmam", "ii_osman")]),
  ],
  "results": {
   "fatih": ("Fatih Sultan Mehmed", "Hırslısın, hedefin büyük, engel tanımazsın. Çevrendekiler seni hem sever hem biraz yorulur."),
   "kanuni": ("Kanuni Sultan Süleyman", "Düzenli, planlı ve adaletlisin. Takvimi olan tek arkadaşsın, grup tatilini sen organize edersin."),
   "ibrahim": ("Sultan İbrahim", "Rahatına düşkünsün, anı yaşarsın. Hayat kısa, battaniye uzun diye düşünürsün."),
   "ii_osman": ("Genç Osman", "İçine kapanıksın ama aslında çok şey düşünüyorsun. Bazen herkese 'ben yokum' demek istersin."),
  }},
 "cay": {
  "title": "Hayatta Hangi Çay Bardağısın?",
  "emoji": "🍵",
  "desc": "İnce belli mi, kupa mı, termos mu? Cevap seni şaşırtabilir.",
  "questions": [
   ("Sabah alarmı çalınca?", [("Hemen kalkarım", "ince"), ("Üç kez ertelerim", "kupa"), ("Alarmı hiç duymam", "termos"), ("Kalkarım ama ruhum yatakta", "kagit")]),
   ("Sosyal ortamda?", [("Ortamın ışığıyım", "ince"), ("Sıcak ve samimiyim", "kupa"), ("Köşede izlerim", "termos"), ("Erken ayrılırım", "kagit")]),
   ("Stresli bir günde?", [("Sakin görünür, içten yanarım", "ince"), ("Biri bana sarılsın", "kupa"), ("Kimse bana ulaşamaz", "termos"), ("Dağılırım", "kagit")]),
   ("Enerji seviyen?", [("Dengeli ama hassas", "ince"), ("Bol ve sıcak", "kupa"), ("Uzun süre dayanırım", "termos"), ("Tek kullanımlık, sonra bitti", "kagit")]),
   ("Bir hafta sonu planın?", [("Misafir ağırlamak", "ince"), ("Dizi maratonu", "kupa"), ("Doğa yürüyüşü", "termos"), ("Plan yok, akışta", "kagit")]),
  ],
  "results": {
   "ince": ("İnce Belli Bardak", "Zarifsin, çevrene özen gösterirsin ama kırılgan olduğunu gizlersin. Seni dikkatli taşımak lazım."),
   "kupa": ("Büyük Kupa", "Sıcak, samimi, doyurucusun. Herkesin yanında rahat ettiği kişi sensin."),
   "termos": ("Termos", "Güvenilirsin, uzun süre dayanırsın. Kimse sana ihtiyaç duyduğunda sıcaklığını kaybetmediğini bilir."),
   "kagit": ("Kağıt Bardak", "Anlık, spontan, hafifsin. Pek plan yapmazsın ama herkesin acil durumunda yanındasın."),
  }},
 "toplanti": {
  "title": "Toplantıda Hangi Karaktersin?",
  "emoji": "💼",
  "desc": "Kamerası kapalı olan, 'sesim gelmiyor' diyen veya her şeyi not alan.",
  "questions": [
   ("Toplantı başlayınca?", [("Hemen not defterini açarım", "notcu"), ("Kamerayı kapatırım", "hayalet"), ("Bir şaka yaparım", "komik"), ("Soru sormak için hazırlanırım", "sorucu")]),
   ("Sana soru sorulunca?", [("Kısa ve net cevap", "notcu"), ("'Sesim gidiyor galiba'", "hayalet"), ("Esprili bir cevap", "komik"), ("Karşı soru sorarım", "sorucu")]),
   ("Toplantı uzayınca?", [("Gündem maddelerini işaretlerim", "notcu"), ("Başka sekmeye geçerim", "hayalet"), ("Mizahla havayı yumuşatırım", "komik"), ("Bu toplantı mail olabilirdi derim", "sorucu")]),
   ("Çalışma arkadaşların seni nasıl tanımlar?", [("Düzenli", "notcu"), ("Gizemli", "hayalet"), ("Eğlenceli", "komik"), ("Sorgulayan", "sorucu")]),
   ("Toplantı bitince?", [("Özet mail gönderirim", "notcu"), ("Hemen çıkarım", "hayalet"), ("Sohbet ederim", "komik"), ("Hâlâ aklımda sorular var", "sorucu")]),
  ],
  "results": {
   "notcu": ("Not Defteri Canavarı", "Her şeyi yazarsın. Takım senin notlarına güvenir, sen olmasan kimse neyin kararlaştırıldığını hatırlamaz."),
   "hayalet": ("Kamerası Kapalı Hayalet", "Varsın ama yoksun. Orada olduğun anlaşılsın diye ara sıra 'evet' dersin."),
   "komik": ("Toplantının Komedyeni", "Ortamı sen yumuşatırsın. Patron bile senin esprilerine gülmemek için kendini zor tutar."),
   "sorucu": ("Sürekli Soran", "Herkesin sormak istediği ama utandığı soruyu sorarsın. Takım sana minnettar, toplantılar biraz uzar."),
  }},
 "sehir": {
  "title": "Gerçekte Hangi Türk Şehrisin?",
  "emoji": "🏙️",
  "desc": "İstanbul trafiği gibi karmaşık mısın, yoksa Eskişehir gibi sakin mi?",
  "questions": [
   ("Hayat temponu nasıl tarif edersin?", [("Hızlı ve kalabalık", "istanbul"), ("Planlı, ritmik", "ankara"), ("Rahat, deniz kenarında", "izmir"), ("Sakin ve kendi halinde", "eskisehir")]),
   ("Hafta sonu ne yaparsın?", [("Her gün farklı bir şey", "istanbul"), ("Ev işleri ve dinlenme", "ankara"), ("Sahilde çay", "izmir"), ("Bisiklet turu", "eskisehir")]),
   ("Yemek konusunda?", [("Her şeyi denerim", "istanbul"), ("Ev yemeği", "ankara"), ("Zeytinyağlılar", "izmir"), ("Çibörek ve kahve", "eskisehir")]),
   ("Stresle başa çıkma yolun?", [("Yoğunluğa gömülürüm", "istanbul"), ("Liste yaparım", "ankara"), ("Denize bakarım", "izmir"), ("Müzik dinlerim", "eskisehir")]),
   ("Arkadaşların seni nasıl görür?", [("Enerjik, yorucu", "istanbul"), ("Güvenilir", "ankara"), ("Neşeli", "izmir"), ("Düşünceli", "eskisehir")]),
  ],
  "results": {
   "istanbul": ("İstanbul", "Kalabalık, hızlı, her şey bir arada. Seni tanımak zor, vazgeçmek daha da zor."),
   "ankara": ("Ankara", "Düzenli, güvenilir, çok yönlüsün. İlk bakışta ciddi görünürsün ama içinde sürprizler var."),
   "izmir": ("İzmir", "Neşeli, sıcakkanlı, ege esintili. Biri seninle konuşurken kendini iyi hisseder."),
   "eskisehir": ("Eskişehir", "Sakin, kültürlü, genç ruhlusun. Bisikletle yavaş yaşamayı bilirsin."),
  }},
}

# ---- v2: 4 yeni test ----
TESTS.update({
 "zombi": {
  "title": "Zombi Kıyametinde Rolün Ne Olurdu?",
  "emoji": "🧟",
  "desc": "İlk gün mü hayatta kalırsın, yoksa ilk gün mü gidersin? Hadi bakalım.",
  "questions": [
   ("Sirenler çaldı, ilk hamlen?", [("Herkesi toplayıp plan yaparım", "lider"), ("Yiyecek stoklarım", "kasif"), ("Haber kaynağını araştırırım", "bilimci"), ("Dolaba saklanırım", "sakli")]),
   ("Silah olarak ne seçersin?", [("Beyzbol sopası", "lider"), ("Ne bulursam", "kasif"), ("Kimyasal karışım", "bilimci"), ("Hiçbiri, sessiz olurum", "sakli")]),
   ("Grupta rolün?", [("Karar veren", "lider"), ("Keşfe çıkan", "kasif"), ("Çözüm üreten", "bilimci"), ("Moral veren (ama gizlenen)", "sakli")]),
   ("Zombilerle ilgili en büyük korkun?", [("Yönetememek", "lider"), ("Yiyecek bitmesi", "kasif"), ("Salgının kaynağını bulamamak", "bilimci"), ("Beni bulmaları", "sakli")]),
   ("Kıyamet sonrası hayalin?", [("Yeni bir toplum kurmak", "lider"), ("Dünyayı gezmek", "kasif"), ("Aşıyı bulmak", "bilimci"), ("Rahatça uyumak", "sakli")]),
  ],
  "results": {
   "lider": ("Grup Lideri", "Herkes seni dinler, sen de kimse seni dinlemezse sinirlenirsin. Hayatta kalma şansın yüksek ama ilk gün çok yoruluyorsun."),
   "kasif": ("Kâşif", "Hep yeni bir kapı açarsın. İlk gün en çok sen risk alırsın, ama hikâyesini en güzel sen anlatırsın."),
   "bilimci": ("Bilim İnsanı", "Plan yapıyorsun, formül çıkarıyorsun. Zombiler sana öfkeli çünkü zaten anlamayacaklar."),
   "sakli": ("Saklanma Ustası", "Sessiz ve sakin. Zombiler seni bulamıyor, bulduğunda da sıkılıp gidiyor."),
  }},
 "yemek": {
  "title": "Hangi Anadolu Yemeğisin?",
  "emoji": "🍲",
  "desc": "Mantı gibi karmaşık mısın, menemen gibi hızlı mı?",
  "questions": [
   ("Hazırlanma süren?", [("Saatler (özenli)", "manti"), ("5 dakika", "menemen"), ("Orta, tatlı hazırlık", "baklava"), ("Hep birlikte, uzun", "pide")]),
   ("Bir ortama girdiğinde?", [("Dikkatle bakarım", "manti"), ("Hemen konuşurum", "menemen"), ("Herkese tatlı davranırım", "baklava"), ("Herkesi toplarım", "pide")]),
   ("En büyük özelliğin?", [("Detaycılık", "manti"), ("Hız", "menemen"), ("Yumuşaklık", "baklava"), ("Paylaşımcılık", "pide")]),
   ("Stresli bir gün için?", [("Düzen kurarım", "manti"), ("Hemen çözerim", "menemen"), ("Biri bana tatlı getirsin", "baklava"), ("Dışarı çıkıp kalabalığa karışırım", "pide")]),
   ("Arkadaşların seni nasıl tarif eder?", [("Titiz", "manti"), ("Pratik", "menemen"), ("Sevimli", "baklava"), ("Cömert", "pide")]),
  ],
  "results": {
   "manti": ("Mantı", "Karmaşık ve zahmetlisin ama kimse bu emeği hak etmez... Hak eder tabii, çünkü sonuç harika."),
   "menemen": ("Menemen", "Hızlı, pratik, her zaman işe yarar. 'Soğanlı mı soğansız mı' tartışmasının ortasındaki kişisin."),
   "baklava": ("Baklava", "Tatlı, katmanlı, bayram havası. İnsanlar seni sever ama fazla yedirirsen bayılırlar."),
   "pide": ("Pide", "Cömert, sıcak, paylaşımcı. Sofranın ortasında senin olduğun an herkes mutlu."),
  }},
 "tembel": {
  "title": "Tembellik Seviyeni Ölç",
  "emoji": "🛋️",
  "desc": "Enerjik misin, koala mı? Gerçek seviye bu testte ortaya çıkıyor.",
  "questions": [
   ("Sabah alarmı çalınca?", [("Kalkarım", "enerjik"), ("5 dakika daha", "dengeli"), ("Üç alarm kurdum", "tembel"), ("Alarm mı? Hangi alarm?", "koala")]),
   ("Hafta sonu planı?", [("Spor ve gezi", "enerjik"), ("Biraz dışarı, biraz ev", "dengeli"), ("Dizi", "tembel"), ("Yatak, battaniye, telefon", "koala")]),
   ("Yemek yapma durumun?", [("Kendim yaparım", "enerjik"), ("Bazen yaparım", "dengeli"), ("Sipariş verirsem iyi", "tembel"), ("Yemek yok, uyku var", "koala")]),
   ("Spor?", [("Her gün", "enerjik"), ("Haftada birkaç gün", "dengeli"), ("Yarın başlarım", "tembel"), ("Spor = başka bir dil", "koala")]),
   ("Telefon açma durumun?", [("Hemen açarım", "enerjik"), ("Uygun olunca", "dengeli"), ("Mesaj atsınlar", "tembel"), ("Ses kapalı", "koala")]),
  ],
  "results": {
   "enerjik": ("Enerji Küpü", "Durmak bilmiyorsun. Çevrendekiler seni izlerken yoruluyor."),
   "dengeli": ("Dengeli Tembel", "Ne fazla çalışır ne de fazla dinlenirsin. Hayatın ortasında huzurlusun."),
   "tembel": ("Profesyonel Tembel", "Konforunu bilirsin ve ondan vazgeçmezsin. Yatak seni çok sever."),
   "koala": ("Koala", "Günde 20 saat uyku, kalan zamanda dinlenme. Hayat felsefen: 'Yarın da bir gün.'"),
  }},
 "ofis": {
  "title": "Hangi Ofis Eşyasısın?",
  "emoji": "📎",
  "desc": "Zımba mı, kahve makinesi mi, yoksa o bozuk yazıcı mı?",
  "questions": [
   ("İş yerindeki rolün?", [("Herkesi bir arada tutan", "zimba"), ("Herkesin enerjisi", "kahve"), ("Beklenmedik anlarda ortaya çıkan", "yazici"), ("Sessizce işleyen", "ekran")]),
   ("En iyi özelliğin?", [("Bağlayıcılık", "zimba"), ("Sıcaklık", "kahve"), ("Sürpriz", "yazici"), ("Güvenilirlik", "ekran")]),
   ("En kötü özelliğin?", [("Bazen sıkışırım", "zimba"), ("Yanıma yaklaşmak zor", "kahve"), ("Tam lazımken bozulurum", "yazici"), ("Gece uyumam", "ekran")]),
   ("Toplantılarda?", [("Notları birleştiririm", "zimba"), ("Herkese kahve getiririm", "kahve"), ("Tam sunum anında hata veririm", "yazici"), ("Sessizce izlerim", "ekran")]),
   ("Çalışma arkadaşların seni ne kadar sever?", [("Çok, birleştiriyorum", "zimba"), ("Sabahları bayılırlar", "kahve"), ("Karışık duygular", "yazici"), ("Fark edilmem ama gerekliyim", "ekran")]),
  ],
  "results": {
   "zimba": ("Zımba", "Dağınık kağıtları bir araya getirirsin. Takımın görünmez yapıştırıcısısın."),
   "kahve": ("Kahve Makinesi", "Sabah enerjisinin kaynağı sensin. Herkes seni özler, tabii çalışırken."),
   "yazici": ("Bozuk Yazıcı", "Tam lazım olduğunda 'kağıt sıkıştı' dersin. İnsanlar senden korkar ama seni de merak eder."),
   "ekran": ("İkinci Ekran", "Sessiz, büyük, işe yarar. Seni kullanmayanlar ne kaçırdıklarını bilmiyor."),
  }},
})

GRADS = {
 "padisah": ("#f6a623", "#ff5c7a"), "cay": ("#10b981", "#4c8dff"), "toplanti": ("#4c8dff", "#a56bff"), "sehir": ("#ff5c7a", "#a56bff"),
 "zombi": ("#34d399", "#065f46"), "yemek": ("#fb923c", "#ef4444"), "tembel": ("#a56bff", "#4c8dff"), "ofis": ("#f59e0b", "#ec4899"),
}
for _k, _g in GRADS.items():
    TESTS[_k]["grad"] = _g


# --- v7: ek sorular ve yeni testler (testdata_extra.py) ---
from testdata_extra import EXTRA_Q, NEW_TESTS as _NEW

def _rot(keys, i, answers):
    n = len(keys)
    return [(a, keys[(j + i) % n]) for j, a in enumerate(answers)]

for _k, _qs in EXTRA_Q.items():
    _t = TESTS[_k]; _keys = list(_t["results"].keys())
    for _n, (_q, _a) in enumerate(_qs):
        _t["questions"].append((_q, _rot(_keys, len(_t["questions"]), _a)))
for _k, _t in _NEW.items():
    _keys = list(_t["results"].keys())
    TESTS[_k] = {"title": _t["title"], "emoji": _t["emoji"], "desc": _t["desc"], "grad": tuple(_t["grad"]), "results": _t["results"],
                 "questions": [(_q, _rot(_keys, _i, _a)) for _i, (_q, _a) in enumerate(_t["q"])]}
