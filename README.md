# 💈 WO & MAN — Go'zallik Studiyasi & Barbershop Sayti

Rasm banneridan to'liq ilhomlangan holda yaratilgan zamonaviy, premium sartaroshxona va go'zallik studiyasi veb-loyihasi.

---

## 🎨 Dizayn Konsepsiyasi
- **Nom:** `WO & MAN` (Студия Красоты)
- **Ranglar uyg'unligi:** Mat qora foni (`#0b0c10`), jozibali neon pushti rang (**«WO»** — ayollar go'zallik saloni) hamda sof oq rang (**«MAN»** — erkaklar sartaroshxonasi / barbershop).
- **Barber uslubi:** Qora fon, 3D neon yozuvlar, barber pole animatsiyasi, shaffof oynasimon (glassmorphism) kartalar va zamonaviy tipografika.
- **Tillar:** O'zbekcha (UZ) va Ruscha (RU) tillariga bir marta bosish orqali lahzada o'tish imkoniyati.

---

## 🚀 Asosiy Imkoniyatlar

1. **Bosh Sahifa (Landing Page):**
   - Bannerdagi belgi asosida tayyorlangan 3D «WO & MAN» logotipi.
   - Haqiqiy banner rasmi bilan integratsiya qilingan blok.
   - Xizmatlar katalogi: Erkaklar (MAN) zal, Ayollar (WO) zal, Spa & parvarish.
   - Mohir ustalar (barberlar va vizajistlar) profili, reytingi va ularga to'g'ridan-to'g'ri navbat olish.
   - Ishlar galereyasi (portfolio).
   - Mijozlar sharhlari va studiya qulayliklari (PlayStation 5, sterilizatsiya, kofe bar).
   - Manzil, interaktiv xarita va aloqa telefonlari.

2. **Ariza qoldirish (Onlayn Navbatga Yozilish):**
   - Mijoz ismi va telefon raqami (`+998...`).
   - Xizmat turi va usta tanlash.
   - Narxni avtomatik hisoblash.
   - Qulay sana va soat tanlash (Time chip lari).
   - Ariza yuborilgach, unikal `#BK-...` raqami va to'liq ma'lumot beruvchi chiroyli oyna.

3. **Telegram Bot Integratsiyasi:**
   - Sayt orqali har bir yangi ariza tushganda, sozlangan Telegram botga chiroyli HTML formatida xabar yetib boradi:
     - Ariza raqami
     - Mijoz ismi va bosiladigan telefon raqami
     - Xizmat nomi va narxi
     - Tanlangan usta
     - Qulay sana va vaqt
     - Qo'shimcha izoh
   - Admin panelda **«Test xabar yuborish»** tugmasi orqali bot sozlamasini bir zumda tekshirish mumkin.

4. **Admin Panel (`/admin`):**
   - **Login & Parol:** `admin` / `admin123` (xohishga ko'ra panel ichida o'zgartirish mumkin).
   - **Statistika:** Jami arizalar, bugungi navbatlar, kutilayotganlar, tasdiqlanganlar va kutilayotgan tushum (so'mda).
   - **Arizalar boshqaruvi:** Ism yoki telefon bo'yicha qidiruv, statuslar bo'yicha filtrlash, bir marta bosish bilan tasdiqlash, yakunlash, bekor qilish yoki o'chirish. Mijozga to'g'ridan-to'g'ri qo'ng'iroq qilish tugmasi.
   - **Xizmatlar boshqaruvi:** Yangi xizmat qo'shish, narxini, davomiyligini va tavsifini tahrirlash/o'chirish.
   - **Ustalar boshqaruvi:** Xodimlarni qo'shish va tahrirlash.
   - **Telegram sozlamalari:** Bot Token va Chat ID kiritish, xabarlarni yoqish/o'chirish.

---

## 💻 Loyihani Ishga Tushirish

Loyiha papkasi: `D:\AI\woman-barbershop`

1. Terminalni oching:
```bash
cd "D:\AI\woman-barbershop"
```

2. Serverni ishga tushiring:
```bash
npm start
```
yoki
```bash
node server/index.js
```

3. Brauzerda oching:
- **Asosiy sayt:** [http://localhost:3000](http://localhost:3000)
- **Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - Standart login: `admin`
  - Standart parol: `admin123`

---

## 🤖 Telegram Botni Ulash Qo'llanmasi

1. Telegramda [@BotFather](https://t.me/BotFather) botiga o'ting va `/newbot` buyrug'ini yuboring.
2. Bot nomi va username berib, taqdim etilgan **Bot Token**ni nusxalang.
3. Chat ID olish uchun [@userinfobot](https://t.me/userinfobot) ga `/start` bosing va ID raqamingizni oling (masalan, `123456789`). Agar guruh yoki kanalga xabar bormoqchi bo'lsa, botni guruhga qo'shib admin qiling va kanal/guruh ID sini oling.
4. Saytingizning Admin paneliga kiring (`http://localhost:3000/admin`), **«Telegram & Sozlamalar»** bo'limiga o'ting.
5. Bot Token va Chat ID ni joylashtirib, **«Saqlash»** hamda **«Test xabar yuborish»** tugmasini bosing!
