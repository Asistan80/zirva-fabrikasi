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
