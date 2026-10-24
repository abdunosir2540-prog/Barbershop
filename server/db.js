const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

const INITIAL_DATA = {
  settings: {
    salon_name: "WO & MAN",
    salon_subtitle_uz: "Go'zallik Studiyasi & Barbershop",
    salon_subtitle_ru: "Студия Красоты & Barbershop",
    admin_username: "admin",
    admin_password: "admin123",
    telegram_bot_token: "",
    telegram_chat_id: "",
    telegram_notifications_enabled: true,
    phone_primary: "+998 90 123 45 67",
    phone_secondary: "+998 97 765 43 21",
    address_uz: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi 108",
    address_ru: "г. Ташкент, Юнусабадский район, пр-т Амира Темура 108",
    working_hours_uz: "Dushanba - Yakshanba: 09:00 - 22:00",
    working_hours_ru: "Понедельник - Воскресенье: 09:00 - 22:00",
    instagram_url: "https://instagram.com",
    telegram_url: "https://t.me",
    banner_image: "/images/banner.png"
  },
  services: [
    {
      id: "srv-1",
      category: "men",
      name_uz: "Erkaklar klassik soch turmagi",
      name_ru: "Мужская классическая стрижка",
      desc_uz: "Bosh yuvish, individual uslub tanlash, styling va parvarish",
      desc_ru: "Мытье головы, индивидуальный подбор стиля, премиум укладка",
      price: 80000,
      duration_min: 40,
      popular: true,
      badge_uz: "Mashhur",
      badge_ru: "Популярно"
    },
    {
      id: "srv-2",
      category: "men",
      name_uz: "Fade & Zamonaviy turmaklash",
      name_ru: "Стрижка Fade (Low/Mid/High)",
      desc_uz: "Mukammal tekis o'tish (fade), qirqish va zamonaviy stil",
      desc_ru: "Идеальный плавный переход, четкие контуры и текстурный стайлинг",
      price: 100000,
      duration_min: 50,
      popular: true,
      badge_uz: "TOP",
      badge_ru: "Хит"
    },
    {
      id: "srv-3",
      category: "men",
      name_uz: "Soqol dizayni va qaynoq sochiq",
      name_ru: "Моделирование бороды и горячее полотенце",
      desc_uz: "Xavfsiz ustara bilan qirqish, moy bilan massaj va bug'li parvarish",
      desc_ru: "Опасная бритва, контуринг, распаривание и уход арома-маслами",
      price: 70000,
      duration_min: 35,
      popular: false
    },
    {
      id: "srv-4",
      category: "men",
      name_uz: "Kompleks: Soch + Soqol VIP",
      name_ru: "Комплекс: Стрижка + Борода VIP",
      desc_uz: "Barcha bosqichlar: soch, soqol dizayni, qora niqob va yuz massaji",
      desc_ru: "Полный комплекс: стильная стрижка, моделирование бороды, маска и уход",
      price: 150000,
      duration_min: 75,
      popular: true,
      badge_uz: "VIP",
      badge_ru: "VIP"
    },
    {
      id: "srv-5",
      category: "men",
      name_uz: "Bolalar soch turmagi (12 yoshgacha)",
      name_ru: "Детская модельная стрижка (до 12 лет)",
      desc_uz: "Kichkintoylar uchun ehtiyotkor va zamonaviy soch olish",
      desc_ru: "Бережная стрижка для юных джентльменов в комфортной атмосфере",
      price: 60000,
      duration_min: 30,
      popular: false
    },
    {
      id: "srv-6",
      category: "men",
      name_uz: "Oq sochlarni yashirish (Kamuflyaj)",
      name_ru: "Камуфляж седины и бороды",
      desc_uz: "Tabiiy ko'rinish beruvchi tezkor bo'yash (10 daqiqa)",
      desc_ru: "Естественное тонирование седины за 10 минут без эффекта окрашенности",
      price: 90000,
      duration_min: 25,
      popular: false
    },
    {
      id: "srv-7",
      category: "women",
      name_uz: "Ayollar soch turmagi va fenlash",
      name_ru: "Женская стрижка + Брашинг укладка",
      desc_uz: "Yuz shakliga mos professional qirqish va hajm beruvchi turmak",
      desc_ru: "Индивидуальный подбор формы под тип лица, мытье и объемная укладка",
      price: 120000,
      duration_min: 60,
      popular: true,
      badge_uz: "Tavsiya",
      badge_ru: "Рекомендуем"
    },
    {
      id: "srv-8",
      category: "women",
      name_uz: "Murakkab bo'yash (AirTouch, Balayaj)",
      name_ru: "Сложное окрашивание (AirTouch, Балаяж)",
      desc_uz: "Italiya va Germaniya bo'yoqlari bilan nozik va yorqin ranglar",
      desc_ru: "Премиальные красители, плавные переходы, защита структуры волос",
      price: 350000,
      duration_min: 180,
      popular: true,
      badge_uz: "Premium",
      badge_ru: "Премиум"
    },
    {
      id: "srv-9",
      category: "women",
      name_uz: "Keratinli to'g'irlash & Botoks",
      name_ru: "Кератиновое выпрямление и ботокс",
      desc_uz: "Sochlarni 6 oygacha ipakdek tekis va yaltiroq holatga keltirish",
      desc_ru: "Глубокое восстановление, зеркальный блеск и гладкость до 6 месяцев",
      price: 380000,
      duration_min: 150,
      popular: false
    },
    {
      id: "srv-10",
      category: "women",
      name_uz: "Kechki va to'y soch turmagi",
      name_ru: "Вечерняя и свадебная прическа",
      desc_uz: "Bayramlar, fotosessiya va to'ylar uchun nafis soch turmaklari",
      desc_ru: "Элегантные прически для торжеств, свадеб и фотосессий любой сложности",
      price: 200000,
      duration_min: 75,
      popular: false
    },
    {
      id: "srv-11",
      category: "unisex",
      name_uz: "Bosh terisi va yuz Spa parvarishi",
      name_ru: "Spa-уход для лица и кожи головы",
      desc_uz: "Skrab, chuqur tozalash, oziqlantiruvchi niqob va yuz massaji",
      desc_ru: "Глубокий пилинг, распаривание, маска детокс и тонизирующий массаж",
      price: 90000,
      duration_min: 45,
      popular: false
    }
  ],
  masters: [
    {
      id: "mst-1",
      name: "Sardor Mirzayev",
      specialty_uz: "Top Barber & Fade mutaxassisi",
      specialty_ru: "Топ-барбер & Мастер фейда",
      category: "men",
      experience_uz: "8 yil tajriba",
      experience_ru: "8 лет опыта",
      rating: 4.95,
      reviews_count: 240,
      photo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80",
      description_uz: "Klassik va zamonaviy fade, soqol shakllantirish bo'yicha shahar chempioni",
      description_ru: "Специалист по безупречному фейду, моделированию бороды и королевскому бритью"
    },
    {
      id: "mst-2",
      name: "Doniyor Qodirov",
      specialty_uz: "Erkaklar Sartaroshi & Barber",
      specialty_ru: "Барбер-стилист",
      category: "men",
      experience_uz: "5 yil tajriba",
      experience_ru: "5 лет опыта",
      rating: 4.88,
      reviews_count: 165,
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
      description_uz: "Yoshlar uslubi, krop, pompadur va har qanday murakkablikdagi dizaynlar",
      description_ru: "Мастер креативных стрижек (Crop, Pompadour), камуфляжа и ухода за кожей"
    },
    {
      id: "mst-3",
      name: "Malika Karimova",
      specialty_uz: "Bosh Kolorist & Stilist",
      specialty_ru: "Главный колорист & Стилист",
      category: "women",
      experience_uz: "9 yil tajriba",
      experience_ru: "9 лет опыта",
      rating: 4.98,
      reviews_count: 310,
      photo: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=80",
      description_uz: "AirTouch, balayaj va murakkab sochlarni tiklash ustalari orasida yetakchi",
      description_ru: "Эксперт сложных техник окрашивания (AirTouch, шатуш) и восстановления волос"
    },
    {
      id: "mst-4",
      name: "Zarina Alimova",
      specialty_uz: "Ayollar Sartaroshi & Vizajist",
      specialty_ru: "Мастер женских причесок & Визажист",
      category: "women",
      experience_uz: "6 yil tajriba",
      experience_ru: "6 лет опыта",
      rating: 4.92,
      reviews_count: 190,
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80",
      description_uz: "To'y va marosimlar uchun mukammal soch turmaklari va professional obraz yaratish",
      description_ru: "Свадебные и вечерние образы, трендовые женские стрижки и ламинирование"
    }
  ],
  bookings: [
    {
      id: "BK-1001",
      client_name: "Azizbek Rahmonov",
      client_phone: "+998 90 123 45 67",
      service_id: "srv-2",
      service_name_uz: "Fade & Zamonaviy turmaklash",
      service_name_ru: "Стрижка Fade (Low/Mid/High)",
      service_price: 100000,
      master_id: "mst-1",
      master_name: "Sardor Mirzayev",
      date: "2026-10-25",
      time: "14:00",
      notes: "Sochni yonini qisqa olish kerak",
      status: "confirmed",
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      telegram_status: "sent"
    },
    {
      id: "BK-1002",
      client_name: "Nilufar Xoliqova",
      client_phone: "+998 93 987 65 43",
      service_id: "srv-7",
      service_name_uz: "Ayollar soch turmagi va fenlash",
      service_name_ru: "Женская стрижка + Брашинг укладка",
      service_price: 120000,
      master_id: "mst-2",
      master_name: "Malika Karimova",
      date: "2026-10-25",
      time: "16:30",
      notes: "Kare shaklida kesish",
      status: "pending",
      created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
      telegram_status: "sent"
    },
    {
      id: "BK-1003",
      client_name: "Jasur Toshmatov",
      client_phone: "+998 94 555 44 33",
      service_id: "srv-4",
      service_name_uz: "Kompleks: Soch + Soqol VIP",
      service_name_ru: "Комплекс: Стрижка + Борода VIP",
      service_price: 150000,
      master_id: "mst-3",
      master_name: "Doniyor Qodirov",
      date: "2026-10-24",
      time: "18:00",
      notes: "To'yga tayyorgarlik",
      status: "completed",
      created_at: new Date(Date.now() - 3600000 * 8).toISOString(),
      telegram_status: "sent"
    }
  ],
  gallery: [
    {
      id: "gal-1",
      title_uz: "Fade & Soqol uyg'unligi",
      title_ru: "Идеальный Fade и борода",
      category: "men",
      image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "gal-2",
      title_uz: "AirTouch bo'yash natijasi",
      title_ru: "Результат окрашивания AirTouch",
      category: "women",
      image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "gal-3",
      title_uz: "Klassik Pompadour",
      title_ru: "Классический Pompadour",
      category: "men",
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "gal-4",
      title_uz: "Kare va yaltiroq silliqlik",
      title_ru: "Каре и зеркальный блеск",
      category: "women",
      image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "gal-5",
      title_uz: "Royal soqol parvarishi",
      title_ru: "Королевский уход за бородой",
      category: "men",
      image: "https://images.unsplash.com/photo-1517832606589-7629c3395909?w=600&auto=format&fit=crop&q=80"
    },
    {
      id: "gal-6",
      title_uz: "Salon interyeri va qulaylik",
      title_ru: "Интерьер студии и комфорт",
      category: "salon",
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80"
    }
  ],
  reviews: [
    {
      id: "rev-1",
      name: "Farrux Zokirov",
      rating: 5,
      date: "2026-10-20",
      text_uz: "Sardor barberga katta rahmat! Fade aynan men xohlagandek chiqdi. Atmosfera va xizmat juda zo'r!",
      text_ru: "Огромное спасибо барберу Сардору! Фейд получился идеальным. Атмосфера и сервис на высшем уровне!"
    },
    {
      id: "rev-2",
      name: "Kamola Umarova",
      rating: 5,
      date: "2026-10-18",
      text_uz: "Malika opada sochimni bo'yatdim, natijasi shunchaki fantastika. O'zbekistonda bunaqa sifat kam uchraydi.",
      text_ru: "Красила волосы у Малики, результат просто восхитительный. Волосы шелковистые, цвет безупречный!"
    },
    {
      id: "rev-3",
      name: "Bobur Ismoilov",
      rating: 5,
      date: "2026-10-15",
      text_uz: "VIP kompleks xizmatidan foydalandim. Charchoq yozildi, soqol va soch a'lo darajada. Tavsiya qilaman!",
      text_ru: "Взял VIP комплекс со стрижкой и спа. Полный релакс, сервис премиальный. Однозначно рекомендую!"
    }
  ]
};

class Database {
  constructor() {
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        this.saveData(INITIAL_DATA);
      } else {
        // Validate read
        const content = fs.readFileSync(DB_FILE, 'utf8');
        JSON.parse(content);
      }
    } catch (err) {
      console.warn("DB init reset to default:", err.message);
      this.saveData(INITIAL_DATA);
    }
  }

  getData() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (e) {
      return INITIAL_DATA;
    }
  }

  saveData(data) {
    const tempFile = DB_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf8');
    fs.renameSync(tempFile, DB_FILE);
  }

  // --- Settings ---
  getSettings() {
    const data = this.getData();
    return data.settings;
  }

  updateSettings(newSettings) {
    const data = this.getData();
    data.settings = { ...data.settings, ...newSettings };
    this.saveData(data);
    return data.settings;
  }

  // --- Services ---
  getServices() {
    return this.getData().services;
  }

  getServiceById(id) {
    return this.getData().services.find(s => s.id === id);
  }

  addService(service) {
    const data = this.getData();
    const id = 'srv-' + (Date.now() % 100000);
    const newService = { ...service, id };
    data.services.push(newService);
    this.saveData(data);
    return newService;
  }

  updateService(id, updates) {
    const data = this.getData();
    const index = data.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    data.services[index] = { ...data.services[index], ...updates };
    this.saveData(data);
    return data.services[index];
  }

  deleteService(id) {
    const data = this.getData();
    data.services = data.services.filter(s => s.id !== id);
    this.saveData(data);
    return true;
  }

  // --- Masters ---
  getMasters() {
    return this.getData().masters;
  }

  getMasterById(id) {
    return this.getData().masters.find(m => m.id === id);
  }

  addMaster(master) {
    const data = this.getData();
    const id = 'mst-' + (Date.now() % 100000);
    const newMaster = { ...master, id };
    data.masters.push(newMaster);
    this.saveData(data);
    return newMaster;
  }

  updateMaster(id, updates) {
    const data = this.getData();
    const index = data.masters.findIndex(m => m.id === id);
    if (index === -1) return null;
    data.masters[index] = { ...data.masters[index], ...updates };
    this.saveData(data);
    return data.masters[index];
  }

  deleteMaster(id) {
    const data = this.getData();
    data.masters = data.masters.filter(m => m.id !== id);
    this.saveData(data);
    return true;
  }

  // --- Bookings ---
  getBookings() {
    const data = this.getData();
    return (data.bookings || []).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getBookingById(id) {
    return this.getData().bookings.find(b => b.id === id);
  }

  createBooking(booking) {
    const data = this.getData();
    if (!data.bookings) data.bookings = [];

    const id = 'BK-' + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id,
      client_name: booking.client_name,
      client_phone: booking.client_phone,
      service_id: booking.service_id || null,
      service_name_uz: booking.service_name_uz || '',
      service_name_ru: booking.service_name_ru || '',
      service_price: Number(booking.service_price || 0),
      master_id: booking.master_id || null,
      master_name: booking.master_name || '',
      date: booking.date,
      time: booking.time,
      notes: booking.notes || '',
      status: 'pending', // pending, confirmed, completed, cancelled
      created_at: new Date().toISOString(),
      telegram_status: booking.telegram_status || 'pending'
    };

    data.bookings.unshift(newBooking);
    this.saveData(data);
    return newBooking;
  }

  updateBookingStatus(id, status, telegram_status) {
    const data = this.getData();
    const booking = data.bookings.find(b => b.id === id);
    if (!booking) return null;
    if (status) booking.status = status;
    if (telegram_status) booking.telegram_status = telegram_status;
    this.saveData(data);
    return booking;
  }

  deleteBooking(id) {
    const data = this.getData();
    data.bookings = data.bookings.filter(b => b.id !== id);
    this.saveData(data);
    return true;
  }

  // --- Gallery & Reviews ---
  getGallery() {
    return this.getData().gallery || [];
  }

  getReviews() {
    return this.getData().reviews || [];
  }

  // --- Statistics ---
  getStats() {
    const bookings = this.getBookings();
    const todayStr = new Date().toISOString().slice(0, 10);

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const todayBookings = bookings.filter(b => b.date === todayStr).length;

    const estimatedRevenue = bookings
      .filter(b => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled,
      todayBookings,
      estimatedRevenue
    };
  }
}

module.exports = new Database();
