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
