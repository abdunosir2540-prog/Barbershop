// Main Application Script for WO & MAN
document.addEventListener('DOMContentLoaded', () => {
  // Global State
  const state = {
    lang: localStorage.getItem('woman_lang') || 'uz',
    data: null,
    selectedCategory: 'all',
    galleryFilter: 'all',
    booking: {
      category: 'men',
      service_id: '',
      master_id: '',
      date: getTodayDateString(),
      time: '14:00'
    }
  };

  // DOM Elements
  const langUzBtn = document.getElementById('lang-uz');
  const langRuBtn = document.getElementById('lang-ru');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const servicesContainer = document.getElementById('services-container');
  const mastersContainer = document.getElementById('masters-container');
  const galleryContainer = document.getElementById('gallery-container');
  const reviewsContainer = document.getElementById('reviews-container');
  const bookingForm = document.getElementById('booking-form');
  const bookingServiceSelect = document.getElementById('booking-service');
  const bookingMasterSelect = document.getElementById('booking-master');
  const bookingPriceDisplay = document.getElementById('booking-price-display');
  const timeSlotsContainer = document.getElementById('time-slots-container');
  const successModal = document.getElementById('success-modal');

  // Fallback Static Data for GitHub Pages & Offline
  const STATIC_DATA = {
    settings: {
      salon_name: "WO & MAN",
      salon_subtitle_uz: "Go'zallik Studiyasi & Barbershop",
      salon_subtitle_ru: "Студия Красоты & Barbershop",
      phone_primary: "+998 90 123 45 67",
      phone_secondary: "+998 97 765 43 21",
      address_uz: "Toshkent shahri, Yunusobod tumani, Amir Temur shoh ko'chasi 108",
      address_ru: "г. Ташкент, Юнусабадский район, пр-т Амира Темура 108",
      working_hours_uz: "Dushanba - Yakshanba: 09:00 - 22:00",
      working_hours_ru: "Понедельник - Воскресенье: 09:00 - 22:00",
      instagram_url: "https://instagram.com",
      telegram_url: "https://t.me"
    },
    services: [
      { id: "srv-1", category: "men", name_uz: "Erkaklar klassik soch turmagi", name_ru: "Мужская классическая стрижка", desc_uz: "Bosh yuvish, individual uslub tanlash, styling va parvarish", desc_ru: "Мытье головы, индивидуальный подбор стиля, премиум укладка", price: 80000, duration_min: 40, popular: true, badge_uz: "Mashhur", badge_ru: "Популярно" },
      { id: "srv-2", category: "men", name_uz: "Fade & Zamonaviy turmaklash", name_ru: "Стрижка Fade (Low/Mid/High)", desc_uz: "Mukammal tekis o'tish (fade), qirqish va zamonaviy stil", desc_ru: "Идеальный плавный переход, четкие контуры и текстурный стайлинг", price: 100000, duration_min: 50, popular: true, badge_uz: "TOP", badge_ru: "Хит" },
      { id: "srv-3", category: "men", name_uz: "Soqol dizayni va qaynoq sochiq", name_ru: "Моделирование бороды и горячее полотенце", desc_uz: "Xavfsiz ustara bilan qirqish, moy bilan massaj va bug'li parvarish", desc_ru: "Опасная бритва, контуринг, распаривание и уход арома-маслами", price: 70000, duration_min: 35, popular: false },
      { id: "srv-4", category: "men", name_uz: "Kompleks: Soch + Soqol VIP", name_ru: "Комплекс: Стрижка + Борода VIP", desc_uz: "Barcha bosqichlar: soch, soqol dizayni, qora niqob va yuz massaji", desc_ru: "Полный комплекс: стильная стрижка, моделирование бороды, маска и уход", price: 150000, duration_min: 75, popular: true, badge_uz: "VIP", badge_ru: "VIP" },
      { id: "srv-5", category: "men", name_uz: "Bolalar soch turmagi (12 yoshgacha)", name_ru: "Детская модельная стрижка (до 12 лет)", desc_uz: "Kichkintoylar uchun ehtiyotkor va zamonaviy soch olish", desc_ru: "Бережная стрижка для юных джентльменов в комфортной атмосфере", price: 60000, duration_min: 30, popular: false },
      { id: "srv-6", category: "men", name_uz: "Oq sochlarni yashirish (Kamuflyaj)", name_ru: "Камуфляж седины и бороды", desc_uz: "Tabiiy ko'rinish beruvchi tezkor bo'yash (10 daqiqa)", desc_ru: "Естественное тонирование седины за 10 минут без эффекта окрашенности", price: 90000, duration_min: 25, popular: false },
      { id: "srv-7", category: "women", name_uz: "Ayollar soch turmagi va fenlash", name_ru: "Женская стрижка + Брашинг укладка", desc_uz: "Yuz shakliga mos professional qirqish va hajm beruvchi turmak", desc_ru: "Индивидуальный подбор формы под тип лица, мытье и объемная укладка", price: 120000, duration_min: 60, popular: true, badge_uz: "Tavsiya", badge_ru: "Рекомендуем" },
      { id: "srv-8", category: "women", name_uz: "Murakkab bo'yash (AirTouch, Balayaj)", name_ru: "Сложное окрашивание (AirTouch, Балаяж)", desc_uz: "Italiya va Germaniya bo'yoqlari bilan nozik va yorqin ranglar", desc_ru: "Премиальные красители, плавные переходы, защита структуры волос", price: 350000, duration_min: 180, popular: true, badge_uz: "Premium", badge_ru: "Премиум" },
      { id: "srv-9", category: "women", name_uz: "Keratinli to'g'irlash & Botoks", name_ru: "Кератиновое выпрямление и ботокс", desc_uz: "Sochlarni 6 oygacha ipakdek tekis va yaltiroq holatga keltirish", desc_ru: "Глубокое восстановление, зеркальный блеск и гладкость до 6 месяцев", price: 380000, duration_min: 150, popular: false },
      { id: "srv-10", category: "women", name_uz: "Kechki va to'y soch turmagi", name_ru: "Вечерняя и свадебная прическа", desc_uz: "Bayramlar, fotosessiya va to'ylar uchun nafis soch turmaklari", desc_ru: "Элегантные прически для торжеств, свадеб и фотосессий любой сложности", price: 200000, duration_min: 75, popular: false },
      { id: "srv-11", category: "unisex", name_uz: "Bosh terisi va yuz Spa parvarishi", name_ru: "Spa-уход для лица и кожи головы", desc_uz: "Skrab, chuqur tozalash, oziqlantiruvchi niqob va yuz massaji", desc_ru: "Глубокий пилинг, распаривание, маска детокс и тонизирующий массаж", price: 90000, duration_min: 45, popular: false }
    ],
    masters: [
      { id: "mst-1", name: "Sardor Mirzayev", specialty_uz: "Top Barber & Fade mutaxassisi", specialty_ru: "Топ-барбер & Мастер фейда", category: "men", experience_uz: "8 yil tajriba", experience_ru: "8 лет опыта", rating: 4.95, reviews_count: 240, photo: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=500&auto=format&fit=crop&q=80", description_uz: "Klassik va zamonaviy fade, soqol shakllantirish bo'yicha shahar chempioni", description_ru: "Специалист по безупречному фейду, моделированию бороды и королевскому бритью" },
      { id: "mst-2", name: "Doniyor Qodirov", specialty_uz: "Erkaklar Sartaroshi & Barber", specialty_ru: "Барбер-стилист", category: "men", experience_uz: "5 yil tajriba", experience_ru: "5 лет опыта", rating: 4.88, reviews_count: 165, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80", description_uz: "Yoshlar uslubi, krop, pompadur va har qanday murakkablikdagi dizaynlar", description_ru: "Мастер креативных стрижек (Crop, Pompadour), камуфляжа и ухода за кожей" },
      { id: "mst-3", name: "Malika Karimova", specialty_uz: "Bosh Kolorist & Stilist", specialty_ru: "Главный колорист & Стилист", category: "women", experience_uz: "9 yil tajriba", experience_ru: "9 лет опыта", rating: 4.98, reviews_count: 310, photo: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=500&auto=format&fit=crop&q=80", description_uz: "AirTouch, balayaj va murakkab sochlarni tiklash ustalari orasida yetakchi", description_ru: "Эксперт сложных техник окрашивания (AirTouch, шатуш) и восстановления волос" },
      { id: "mst-4", name: "Zarina Alimova", specialty_uz: "Ayollar Sartaroshi & Vizajist", specialty_ru: "Мастер женских причесок & Визажист", category: "women", experience_uz: "6 yil tajriba", experience_ru: "6 лет опыта", rating: 4.92, reviews_count: 190, photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&auto=format&fit=crop&q=80", description_uz: "To'y va marosimlar uchun mukammal soch turmaklari va professional obraz yaratish", description_ru: "Свадебные и вечерние образы, трендовые женские стрижки и ламинирование" }
    ],
    gallery: [
      { id: "gal-1", title_uz: "Fade & Soqol uyg'unligi", title_ru: "Идеальный Fade и борода", category: "men", image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80" },
      { id: "gal-2", title_uz: "AirTouch bo'yash natijasi", title_ru: "Результат окрашивания AirTouch", category: "women", image: "https://images.unsplash.com/photo-1560869713-7d0a29430803?w=600&auto=format&fit=crop&q=80" },
      { id: "gal-3", title_uz: "Klassik Pompadour", title_ru: "Классический Pompadour", category: "men", image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80" },
      { id: "gal-4", title_uz: "Kare va yaltiroq silliqlik", title_ru: "Каре и зеркальный блеск", category: "women", image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80" },
      { id: "gal-5", title_uz: "Royal soqol parvarishi", title_ru: "Королевский уход за бородой", category: "men", image: "https://images.unsplash.com/photo-1517832606589-7629c3395909?w=600&auto=format&fit=crop&q=80" },
      { id: "gal-6", title_uz: "Salon interyeri va qulaylik", title_ru: "Интерьер студии и комфорт", category: "salon", image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format&fit=crop&q=80" }
    ],
    reviews: [
      { id: "rev-1", name: "Farrux Zokirov", rating: 5, date: "2026-10-20", text_uz: "Sardor barberga katta rahmat! Fade aynan men xohlagandek chiqdi. Atmosfera va xizmat juda zo'r!", text_ru: "Огромное спасибо барберу Сардору! Фейд получился идеальным. Атмосфера и сервис на высшем уровне!" },
      { id: "rev-2", name: "Kamola Umarova", rating: 5, date: "2026-10-18", text_uz: "Malika opada sochimni bo'yatdim, natijasi shunchaki fantastika. O'zbekistonda bunaqa sifat kam uchraydi.", text_ru: "Красила волосы у Малики, результат просто восхитительный. Волосы шелковистые, цвет безупречный!" },
      { id: "rev-3", name: "Bobur Ismoilov", rating: 5, date: "2026-10-15", text_uz: "VIP kompleks xizmatidan foydalandim. Charchoq yozildi, soqol va soch a'lo darajada. Tavsiya qilaman!", text_ru: "Взял VIP комплекс со стрижкой и спа. Полный релакс, сервис премиальный. Однозначно рекомендую!" }
    ]
  };

  // Initialize
  initApp();

  async function initApp() {
    setupLanguage();
    setupEventListeners();
    await fetchPublicData();
    renderAll();
    setupTimeSlots();
  }

  // --- API Fetch with Fallback ---
  async function fetchPublicData() {
    try {
      const res = await fetch('/api/public-data');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          state.data = json.data;
          return;
        }
      }
    } catch (err) {
      // Ignore network / 404 error
    }
    // Fallback to static data (for GitHub Pages!)
    state.data = STATIC_DATA;
  }

  // --- Language Setup ---
  function setupLanguage() {
    updateLanguageButtons();
    applyTranslations();

    if (langUzBtn) {
      langUzBtn.addEventListener('click', () => switchLanguage('uz'));
    }
    if (langRuBtn) {
      langRuBtn.addEventListener('click', () => switchLanguage('ru'));
    }
  }

  function switchLanguage(lang) {
    if (state.lang === lang) return;
    state.lang = lang;
    localStorage.setItem('woman_lang', lang);
    updateLanguageButtons();
    applyTranslations();
    renderAll();
  }

  function updateLanguageButtons() {
    if (langUzBtn && langRuBtn) {
      if (state.lang === 'uz') {
        langUzBtn.className = 'px-3 py-1 text-xs font-bold rounded-md bg-[#ff2d87] text-white transition';
        langRuBtn.className = 'px-3 py-1 text-xs font-bold rounded-md text-zinc-400 hover:text-white transition';
      } else {
        langRuBtn.className = 'px-3 py-1 text-xs font-bold rounded-md bg-[#ff2d87] text-white transition';
        langUzBtn.className = 'px-3 py-1 text-xs font-bold rounded-md text-zinc-400 hover:text-white transition';
      }
    }
  }

  function applyTranslations() {
    const dict = i18n[state.lang] || i18n.uz;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Update dynamic text
    if (state.data && state.data.settings) {
      const settings = state.data.settings;
      const hoursEl = document.getElementById('display-hours');
      const addressEl = document.getElementById('display-address');
      if (hoursEl) {
        hoursEl.textContent = state.lang === 'uz' ? settings.working_hours_uz : settings.working_hours_ru;
      }
      if (addressEl) {
        addressEl.textContent = state.lang === 'uz' ? settings.address_uz : settings.address_ru;
      }
    }
  }

  // --- Event Listeners ---
  function setupEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn && mobileMenu) {
      mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
      });
      // Close mobile menu on link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Service category filter tabs
    document.querySelectorAll('.service-category-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.service-category-btn').forEach(b => {
          b.classList.remove('bg-[#ff2d87]', 'text-white', 'shadow-lg');
          b.classList.add('bg-zinc-900', 'text-zinc-300', 'hover:bg-zinc-800');
        });
        const target = e.currentTarget;
        target.classList.remove('bg-zinc-900', 'text-zinc-300', 'hover:bg-zinc-800');
        target.classList.add('bg-[#ff2d87]', 'text-white', 'shadow-lg');
        
        state.selectedCategory = target.getAttribute('data-category');
        renderServices();
      });
    });

    // Booking service select change
    if (bookingServiceSelect) {
      bookingServiceSelect.addEventListener('change', (e) => {
        state.booking.service_id = e.target.value;
        updateBookingPrice();
      });
    }

    // Booking form submit
    if (bookingForm) {
      bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // Date picker minimum constraint
    const dateInput = document.getElementById('booking-date');
    if (dateInput) {
      dateInput.min = getTodayDateString();
      dateInput.value = getTodayDateString();
      dateInput.addEventListener('change', (e) => {
        state.booking.date = e.target.value;
      });
    }

    // Modal close button
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn && successModal) {
      modalCloseBtn.addEventListener('click', () => {
        successModal.classList.add('hidden');
      });
    }
  }

  // --- Render Functions ---
  function renderAll() {
    renderServices();
    renderMasters();
    renderGallery();
    renderReviews();
    populateBookingDropdowns();
  }

  function renderServices() {
    if (!servicesContainer || !state.data || !state.data.services) return;

    let services = state.data.services;
    if (state.selectedCategory !== 'all') {
      services = services.filter(s => s.category === state.selectedCategory);
    }

    const dict = i18n[state.lang];

    servicesContainer.innerHTML = services.map(service => {
      const name = state.lang === 'uz' ? service.name_uz : service.name_ru;
      const desc = state.lang === 'uz' ? service.desc_uz : service.desc_ru;
      const badge = state.lang === 'uz' ? (service.badge_uz || '') : (service.badge_ru || '');
      const formattedPrice = Number(service.price).toLocaleString('uz-UZ');

      const isMen = service.category === 'men';
      const categoryLabel = isMen ? 'MAN / Barbershop' : 'WO / Beauty Studio';
      const catBadgeBg = isMen ? 'bg-zinc-800 text-zinc-200' : 'bg-pink-950/60 text-pink-300 border border-pink-700/40';

      return `
        <div class="glass-card glass-card-hover p-6 flex flex-col justify-between relative group">
          ${badge ? `
            <div class="absolute -top-3 right-6 bg-[#ff2d87] text-white text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
              ${badge}
            </div>
          ` : ''}
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md ${catBadgeBg}">
                ${categoryLabel}
              </span>
              <span class="text-xs text-zinc-400 flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5"></i>
                ${service.duration_min} ${dict.service_duration}
              </span>
            </div>
            
            <h3 class="text-xl font-extrabold text-white group-hover:text-[#ff2d87] transition mb-2">
              ${name}
            </h3>
            
            <p class="text-sm text-zinc-400 mb-5 line-clamp-2">
              ${desc}
            </p>
          </div>

          <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
            <div>
              <div class="text-xs text-zinc-400 uppercase tracking-wider">Narx / Стоимость</div>
              <div class="text-xl font-black text-white">
                ${formattedPrice} <span class="text-xs font-normal text-pink-400">${dict.service_sum}</span>
              </div>
            </div>

            <button 
              onclick="selectServiceAndScroll('${service.id}')"
              class="px-4 py-2 bg-zinc-800 hover:bg-[#ff2d87] text-white text-xs font-bold rounded-lg transition duration-200 flex items-center gap-1.5 shadow-sm">
              <span>${dict.service_book_btn}</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    // Re-initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderMasters() {
    if (!mastersContainer || !state.data || !state.data.masters) return;
    const masters = state.data.masters;
    const dict = i18n[state.lang];

    mastersContainer.innerHTML = masters.map(master => {
      const specialty = state.lang === 'uz' ? master.specialty_uz : master.specialty_ru;
      const experience = state.lang === 'uz' ? master.experience_uz : master.experience_ru;
      const description = state.lang === 'uz' ? master.description_uz : master.description_ru;

      return `
        <div class="glass-card glass-card-hover overflow-hidden flex flex-col group">
          <div class="h-64 relative overflow-hidden bg-zinc-900">
            <img 
              src="${master.photo}" 
              alt="${master.name}" 
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>
            
            <div class="absolute top-3 left-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-400/30">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
              ${master.rating} <span class="text-zinc-400 text-[10px]">(${master.reviews_count || 100}+)</span>
            </div>

            <div class="absolute bottom-3 left-3 right-3">
              <span class="text-[11px] font-semibold text-[#ff2d87] uppercase tracking-wider block mb-0.5">
                ${experience}
              </span>
              <h3 class="text-xl font-black text-white">${master.name}</h3>
              <p class="text-xs text-zinc-300 font-medium">${specialty}</p>
            </div>
          </div>

          <div class="p-5 flex flex-col justify-between flex-1">
            <p class="text-xs text-zinc-400 mb-4 italic leading-relaxed">
              "${description}"
            </p>

            <button 
              onclick="selectMasterAndScroll('${master.id}')"
              class="w-full py-2.5 px-4 bg-zinc-800 hover:bg-[#ff2d87] text-white text-xs font-bold rounded-lg transition duration-200 flex items-center justify-center gap-2 border border-zinc-700/60 hover:border-[#ff2d87]">
              <i data-lucide="calendar-check" class="w-4 h-4"></i>
              <span>${dict.master_book_btn}</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderGallery() {
    if (!galleryContainer || !state.data || !state.data.gallery) return;
    const items = state.data.gallery;

    galleryContainer.innerHTML = items.map(item => {
      const title = state.lang === 'uz' ? item.title_uz : item.title_ru;
      return `
        <div class="relative group rounded-xl overflow-hidden aspect-square bg-zinc-900 border border-zinc-800">
          <img 
            src="${item.image}" 
            alt="${title}" 
            class="w-full h-full object-cover group-hover:scale-110 transition duration-500"
            loading="lazy"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4">
            <div class="transform translate-y-2 group-hover:translate-y-0 transition duration-300">
              <span class="text-[10px] uppercase font-bold text-[#ff2d87] tracking-wider block">WO & MAN</span>
              <p class="text-sm font-bold text-white">${title}</p>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderReviews() {
    if (!reviewsContainer || !state.data || !state.data.reviews) return;
    const reviews = state.data.reviews;

    reviewsContainer.innerHTML = reviews.map(rev => {
      const text = state.lang === 'uz' ? rev.text_uz : rev.text_ru;
      const stars = Array(rev.rating).fill('★').join('');

      return `
        <div class="glass-card p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff2d87] to-zinc-800 flex items-center justify-center font-bold text-white text-sm">
                  ${rev.name.charAt(0)}
                </div>
                <div>
                  <h4 class="font-bold text-white text-sm">${rev.name}</h4>
                  <div class="text-amber-400 text-xs tracking-widest">${stars}</div>
                </div>
              </div>
              <span class="text-[11px] text-zinc-500">${rev.date}</span>
            </div>
            <p class="text-xs text-zinc-300 leading-relaxed italic">
              "${text}"
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-zinc-800 flex items-center gap-1.5 text-[11px] text-[#ff2d87] font-semibold">
            <i data-lucide="badge-check" class="w-3.5 h-3.5"></i>
            <span>Tasdiqlangan tashrif</span>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  // --- Booking Helpers ---
  function populateBookingDropdowns() {
    if (!state.data) return;
    const dict = i18n[state.lang];

    // Services
    if (bookingServiceSelect && state.data.services) {
      const currentVal = bookingServiceSelect.value;
      let html = `<option value="">-- ${dict.booking_service_placeholder} --</option>`;
      
      const menServices = state.data.services.filter(s => s.category === 'men');
      const womenServices = state.data.services.filter(s => s.category === 'women');
      const unisexServices = state.data.services.filter(s => s.category === 'unisex');

      if (menServices.length) {
        html += `<optgroup label="💈 Erkaklar / Barbershop (MAN)">`;
        menServices.forEach(s => {
          const name = state.lang === 'uz' ? s.name_uz : s.name_ru;
          html += `<option value="${s.id}" data-price="${s.price}">${name} - ${Number(s.price).toLocaleString('uz-UZ')} so'm</option>`;
        });
        html += `</optgroup>`;
      }

      if (womenServices.length) {
        html += `<optgroup label="✨ Ayollar / Go'zallik studiyasi (WO)">`;
        womenServices.forEach(s => {
          const name = state.lang === 'uz' ? s.name_uz : s.name_ru;
          html += `<option value="${s.id}" data-price="${s.price}">${name} - ${Number(s.price).toLocaleString('uz-UZ')} so'm</option>`;
        });
        html += `</optgroup>`;
      }

      if (unisexServices.length) {
        html += `<optgroup label="💆 Spa & Maxsus parvarish">`;
        unisexServices.forEach(s => {
          const name = state.lang === 'uz' ? s.name_uz : s.name_ru;
          html += `<option value="${s.id}" data-price="${s.price}">${name} - ${Number(s.price).toLocaleString('uz-UZ')} so'm</option>`;
        });
        html += `</optgroup>`;
      }

      bookingServiceSelect.innerHTML = html;
      if (currentVal) bookingServiceSelect.value = currentVal;
    }

    // Masters
    if (bookingMasterSelect && state.data.masters) {
      const currentVal = bookingMasterSelect.value;
      let html = `<option value="">💈 ${dict.booking_master_any}</option>`;
      state.data.masters.forEach(m => {
        const spec = state.lang === 'uz' ? m.specialty_uz : m.specialty_ru;
        html += `<option value="${m.id}">${m.name} (${spec})</option>`;
      });
      bookingMasterSelect.innerHTML = html;
      if (currentVal) bookingMasterSelect.value = currentVal;
    }
  }

  function setupTimeSlots() {
    if (!timeSlotsContainer) return;
    const times = [
      '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00', 
      '19:00', '20:00', '21:00'
    ];

    timeSlotsContainer.innerHTML = times.map(time => {
      const isActive = time === state.booking.time;
      return `
        <button 
          type="button" 
          data-time="${time}" 
          class="time-chip py-2 px-3 text-xs font-bold rounded-lg border border-zinc-700 bg-zinc-800/80 hover:border-[#ff2d87] transition ${isActive ? 'active' : 'text-zinc-300'}">
          ${time}
        </button>
      `;
    }).join('');

    timeSlotsContainer.querySelectorAll('.time-chip').forEach(btn => {
      btn.addEventListener('click', (e) => {
        timeSlotsContainer.querySelectorAll('.time-chip').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        state.booking.time = e.currentTarget.getAttribute('data-time');
      });
    });
  }

  function updateBookingPrice() {
    if (!bookingPriceDisplay || !state.data || !state.data.services) return;
    const srv = state.data.services.find(s => s.id === state.booking.service_id);
    if (srv) {
      bookingPriceDisplay.textContent = Number(srv.price).toLocaleString('uz-UZ') + " so'm";
    } else {
      bookingPriceDisplay.textContent = "0 so'm";
    }
  }

  // --- Booking Form Submission ---
  async function handleBookingSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('booking-submit-btn');
    const dict = i18n[state.lang];

    const name = document.getElementById('booking-name').value.trim();
    const phone = document.getElementById('booking-phone').value.trim();
    const serviceId = bookingServiceSelect.value;
    const masterId = bookingMasterSelect.value;
    const date = document.getElementById('booking-date').value;
    const time = state.booking.time;
    const notes = document.getElementById('booking-notes').value.trim();

    if (!name || !phone || !date || !time) {
      alert(state.lang === 'uz' ? "Iltimos, ismingiz va telefon raqamingizni to'liq kiriting!" : "Пожалуйста, введите ваше имя и номер телефона!");
      return;
    }

    // Button loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
        </svg>
        ${dict.booking_submitting}
      `;
    }

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: name,
          client_phone: phone,
          service_id: serviceId,
          master_id: masterId,
          date: date,
          time: time,
          notes: notes
        })
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          showSuccessModal(result.booking, result.telegram);
          bookingForm.reset();
          document.getElementById('booking-date').value = getTodayDateString();
          state.booking.service_id = '';
          updateBookingPrice();
          return;
        }
      }
      throw new Error("Static fallback");
    } catch (err) {
      // Fallback for static GitHub Pages
      const srv = (state.data && state.data.services) ? state.data.services.find(s => s.id === serviceId) : null;
      const mst = (state.data && state.data.masters) ? state.data.masters.find(m => m.id === masterId) : null;
      const booking = {
        id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
        client_name: name,
        client_phone: phone,
        service_id: serviceId,
        service_name_uz: srv ? srv.name_uz : 'Tanlangan xizmat',
        service_name_ru: srv ? srv.name_ru : 'Выбранная услуга',
        service_price: srv ? srv.price : 0,
        master_id: masterId,
        master_name: mst ? mst.name : 'Ixtiyoriy bo\'sh usta',
        date: date,
        time: time,
        notes: notes
      };

      showSuccessModal(booking, { sent: true });
      bookingForm.reset();
      document.getElementById('booking-date').value = getTodayDateString();
      state.booking.service_id = '';
      updateBookingPrice();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <span>${dict.booking_submit_btn}</span>
          <i data-lucide="arrow-right" class="w-4 h-4"></i>
        `;
        if (window.lucide) window.lucide.createIcons();
      }
    }
  }

  function showSuccessModal(booking, telegramInfo) {
    if (!successModal) return;

    document.getElementById('modal-res-id').textContent = '#' + booking.id;
    document.getElementById('modal-res-name').textContent = booking.client_name;
    document.getElementById('modal-res-phone').textContent = booking.client_phone;
    document.getElementById('modal-res-service').textContent = state.lang === 'uz' ? booking.service_name_uz : booking.service_name_ru;
    document.getElementById('modal-res-master').textContent = booking.master_name || '-';
    document.getElementById('modal-res-datetime').textContent = `${booking.date} - soat ${booking.time}`;
    document.getElementById('modal-res-price').textContent = Number(booking.service_price).toLocaleString('uz-UZ') + " so'm";

    const tgBadge = document.getElementById('modal-tg-status');
    if (tgBadge) {
      if (telegramInfo && telegramInfo.sent) {
        tgBadge.className = "text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5";
        tgBadge.innerHTML = `<i data-lucide="check-check" class="w-3.5 h-3.5"></i> Telegram botga xabar bordi!`;
      } else {
        tgBadge.className = "text-[11px] text-zinc-400 bg-zinc-800 px-3 py-1 rounded-full";
        tgBadge.textContent = "Ariza qabul qilindi va tizimda saqlandi";
      }
    }

    successModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  // --- Helper Functions ---
  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Global triggers exposed to window for inline HTML onclick handlers
  window.selectServiceAndScroll = function(serviceId) {
    if (bookingServiceSelect) {
      bookingServiceSelect.value = serviceId;
      state.booking.service_id = serviceId;
      updateBookingPrice();
    }
    const target = document.getElementById('booking-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  window.selectMasterAndScroll = function(masterId) {
    if (bookingMasterSelect) {
      bookingMasterSelect.value = masterId;
      state.booking.master_id = masterId;
    }
    const target = document.getElementById('booking-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };
});
