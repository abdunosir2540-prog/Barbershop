// WO & MAN Barbershop — Core Frontend Engine
document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    lang: localStorage.getItem('woman_lang') || 'uz',
    selectedCategory: 'all',
    data: null,
    booking: {
      service_id: '',
      master_id: '',
      date: '',
      time: '12:00'
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
      salon_subtitle_uz: "Go'zallik Studiyasi & Barbershop | Yangiyo'l",
      salon_subtitle_ru: "Студия Красоты & Barbershop | Янгиюль",
      phone_primary: "+998 97 977 59 94",
      phone_secondary: "+998 97 548 77 97",
      phone_tertiary: "+998 77 071 78 37",
      address_uz: "Toshkent viloyati, Yangiyoʻl shahri, Bo'ston 1-o'tish ko'chasi, 1",
      address_ru: "Ташкентская область, г. Янгиюль, 1-й проезд Бустон, 1",
      working_hours_uz: "Dushanba - Yakshanba: 09:00 - 22:00",
      working_hours_ru: "Понедельник - Воскресенье: 09:00 - 22:00",
      instagram_url: "https://instagram.com/wo_man_yangiyol",
      telegram_url: "https://t.me/WoManbarberbot",
      telegram_bot_token: "8982199071:AAEeR9ySgTlyG0NQozhDinluVDcjJqCSdiU",
      telegram_chat_id_jamoloddin: "5046237558",
      telegram_chat_id_akrom: "",
      telegram_chat_id_axror: "",
      yandex_map_url: "https://yandex.ru/maps/-/CXb4jS9L",
      pricelist_image: "./images/pricelist.jpg"
    },
    services: [
      { id: "srv-1", category: "main", name_uz: "Soch olish", name_ru: "Стрижка волос", desc_uz: "Klassik va zamonaviy erkaklar soch turmagi, yuvish va stil berish", desc_ru: "Классическая и модельная мужская стрижка, мытье и укладка", price: 60000, duration_min: 30, popular: true, badge_uz: "TOP", badge_ru: "Хит" },
      { id: "srv-2", category: "main", name_uz: "Soch soqol", name_ru: "Стрижка + Борода", desc_uz: "Soch olish va soqolni professional shakllantirish to'liq to'plami", desc_ru: "Полный комплекс стрижки волос и моделирования бороды", price: 100000, duration_min: 50, popular: true, badge_uz: "Mashhur", badge_ru: "Популярно" },
      { id: "srv-3", category: "main", name_uz: "Detskiy", name_ru: "Детская стрижка", desc_uz: "Kichkintoylar uchun xushmuomala va ehtiyotkor zamonaviy soch turmagi", desc_ru: "Бережная и стильная стрижка для юных джентльменов", price: 50000, duration_min: 25, popular: false },
      { id: "srv-4", category: "main", name_uz: "Ukladka", name_ru: "Укладка волос", desc_uz: "Fen va sifatli fiksator vositalari yordamida sochni chiroyli turmaklash", desc_ru: "Профессиональная укладка и текстурный стайлинг волос", price: 50000, duration_min: 20, popular: false },
      { id: "srv-5", category: "care", name_uz: "Soch boyash", name_ru: "Окрашивание волос", desc_uz: "Oq sochlarni yashirish (kamuflyaj) va sochlarga sifatli rang berish", desc_ru: "Камуфляж седины и естественное тонирование волос", price: 50000, duration_min: 30, popular: false },
      { id: "srv-6", category: "main", name_uz: "Soqol", name_ru: "Моделирование бороды", desc_uz: "Soqolni tekislash, aniq kontur chizish va maxsus moylar bilan parvarish", desc_ru: "Стрижка и контуринг бороды, уход смягчающими маслами", price: 40000, duration_min: 20, popular: false },
      { id: "srv-7", category: "care", name_uz: "Vosk", name_ru: "Восковая депиляция (Воск)", desc_uz: "Burun, quloq va yuzdagi keraksiz tuklarni og'riqsiz va toza yo'qotish", desc_ru: "Удаление нежелательных волос горячим воском (нос, уши, лицо)", price: 30000, duration_min: 15, popular: false },
      { id: "srv-8", category: "care", name_uz: "Maska", name_ru: "Маска для лица", desc_uz: "Yuz terisini chuqur tozalovchi qora niqob va oziqlantiruvchi parvarish", desc_ru: "Очищающая черная маска и уход за кожей лица", price: 40000, duration_min: 20, popular: false },
      { id: "srv-9", category: "care", name_uz: "Massaj golovi", name_ru: "Массаж головы", desc_uz: "Bosh va bo'yin sohasini qon aylanishini yaxshilovchi tinchlantiruvchi massaj", desc_ru: "Расслабляющий тонизирующий массаж кожи головы и шеи", price: 50000, duration_min: 20, popular: false },
      { id: "srv-10", category: "care", name_uz: "Kuyov obroz", name_ru: "Образ жениха (VIP)", desc_uz: "VIP to'liq kompleks: soch, soqol, yuz maskasi, bosh massaji va bayramona ukladka", desc_ru: "Полный VIP комплекс жениха: стрижка, борода, маска, массаж и стайлинг", price: 400000, duration_min: 90, popular: true, badge_uz: "VIP", badge_ru: "VIP" }
    ],
    masters: [
      {
        id: "mst-1",
        name: "Jamoloddin",
        title: "Asoschi",
        phone: "+998 97 977 59 94",
        telegram_chat_id: "5046237558",
        specialty_uz: "Asoschi & Bosh Barber",
        specialty_ru: "Основатель & Главный Барбер",
        category: "founder",
        experience_uz: "8 yil tajriba",
        experience_ru: "8 лет опыта",
        rating: 5.0,
        reviews_count: 280,
        photo: "./images/master-jamoloddin.jpg",
        description_uz: "WO & MAN asoschisi va oliy toifali tajribali ustasi. Kuyov obrazlari va mukammal soch turmaklari bo'yicha mutaxassis.",
        description_ru: "Основатель WO & MAN, мастер высшей категории. Эксперт свадебных образов и безупречного мужского стиля."
      },
      {
        id: "mst-2",
        name: "Akrom",
        title: "Top Barber",
        phone: "+998 97 548 77 97",
        telegram_chat_id: "",
        specialty_uz: "Top Barber & Soqol ustasi",
        specialty_ru: "Топ-барбер & Мастер бороды",
        category: "barber",
        experience_uz: "6 yil tajriba",
        experience_ru: "6 лет опыта",
        rating: 4.95,
        reviews_count: 210,
        photo: "./images/master-akrom.jpg",
        description_uz: "Fade, klassik va zamonaviy erkaklar soch turmagi hamda soqol modellashtirish bo'yicha mahoratli usta.",
        description_ru: "Специалист по безупречному фейду, моделированию бороды и современным мужским стрижкам."
      },
      {
        id: "mst-3",
        name: "Axror",
        title: "Barber & Stilist",
        phone: "+998 77 071 78 37",
        telegram_chat_id: "",
        specialty_uz: "Professional Barber & Styling",
        specialty_ru: "Профессиональный Барбер & Стилист",
        category: "barber",
        experience_uz: "4 yil tajriba",
        experience_ru: "4 лет опыта",
        rating: 4.92,
        reviews_count: 175,
        photo: "./images/master-axror.jpg",
        description_uz: "Kreativ yoshlar uslubi, ukladka, bolalar soch turmagi va yuz parvarishi bo'yicha professionallaridan.",
        description_ru: "Мастер молодежных трендовых стрижек, детских образов, укладки и бережного ухода."
      }
    ],
    gallery: [
      { id: "gal-1", title_uz: "Rasmiy Narxlar Ro'yxati", title_ru: "Официальный прайс-лист", category: "pricelist", image: "./images/pricelist.jpg" },
      { id: "gal-2", title_uz: "Jamoloddin (Asoschi)", title_ru: "Джамолоддин (Основатель)", category: "masters", image: "./images/master-jamoloddin.jpg" },
      { id: "gal-3", title_uz: "Akrom (Top Barber)", title_ru: "Акром (Топ-барбер)", category: "masters", image: "./images/master-akrom.jpg" },
      { id: "gal-4", title_uz: "Axror (Barber & Stilist)", title_ru: "Ахрор (Барбер-стилист)", category: "masters", image: "./images/master-axror.jpg" },
      { id: "gal-5", title_uz: "WO & MAN Studiya Muhiti", title_ru: "Интерьер студии WO & MAN", category: "salon", image: "./images/studio-showcase.jpg" },
      { id: "gal-6", title_uz: "Brend Banneri", title_ru: "Фирменный баннер", category: "salon", image: "./images/banner.png" }
    ],
    reviews: [
      { id: "rev-1", name: "Otabek Rustamov", rating: 5, date: "2026-10-25", text_uz: "Jamoloddin akaga gap yo'q! Kuyov obrazini shunchalik zo'r qilib berdilar, to'yda hamma havas qildi. Yangiyo'ldagi 1-raqamli barbershop!", text_ru: "Огромная благодарность Джамолоддину! Свадебный образ получился на высшем уровне. Лучший барбершоп в Янгиюле!" },
      { id: "rev-2", name: "Sherzod Aliyev", rating: 5, date: "2026-10-22", text_uz: "Akrom ustaga rahmat! Soch va soqolni juda chiroyli va tekis qilib berdilar. Joyi ham juda shinam va qulay.", text_ru: "Спасибо мастеру Акром! Стрижка и борода сделаны безупречно. Очень стильное и уютное место." },
      { id: "rev-3", name: "Farxod Karimov", rating: 5, date: "2026-10-19", text_uz: "Axror ustada doimiy mijozman. Soch turmaklash va yuz maskasi zo'r chiqadi. Barchaga tavsiya qilaman!", text_ru: "Постоянно стригусь у Ахрора. Отличная укладка и сервис. Рекомендую всем!" }
    ]
  };

  // Initialize App
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
      // Offline or GitHub Pages
    }
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
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.add('hidden');
        });
      });
    }

    // Category filter tabs
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

    // Booking master select change
    if (bookingMasterSelect) {
      bookingMasterSelect.addEventListener('change', (e) => {
        state.booking.master_id = e.target.value;
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
      state.booking.date = dateInput.value;
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

      let badgeHtml = '';
      if (badge === 'VIP') {
        badgeHtml = `<div class="absolute -top-3 right-6 badge-gold text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">VIP</div>`;
      } else if (badge) {
        badgeHtml = `<div class="absolute -top-3 right-6 bg-[#ff2d87] text-white text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">${badge}</div>`;
      }

      return `
        <div class="glass-card glass-card-hover p-6 flex flex-col justify-between relative group border border-zinc-800/80 hover:border-[#ff2d87]/40 transition">
          ${badgeHtml}
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center gap-1.5">
                <i data-lucide="scissors" class="w-3 h-3 text-[#ff2d87]"></i>
                BARBERSHOP
              </span>
              <span class="text-xs text-zinc-400 flex items-center gap-1">
                <i data-lucide="clock" class="w-3.5 h-3.5 text-zinc-500"></i>
                ${service.duration_min} ${dict.service_duration}
              </span>
            </div>
            
            <h3 class="text-xl font-black text-white group-hover:text-[#ff2d87] transition mb-2">
              ${name}
            </h3>
            
            <p class="text-xs text-zinc-400 mb-5 leading-relaxed">
              ${desc}
            </p>
          </div>

          <div class="pt-4 border-t border-zinc-800/80 flex items-center justify-between mt-auto">
            <div>
              <div class="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Narxi</div>
              <div class="text-xl font-black text-white">
                ${formattedPrice} <span class="text-xs font-normal text-pink-400">${dict.service_sum}</span>
              </div>
            </div>

            <button 
              onclick="selectServiceAndScroll('${service.id}')"
              class="px-4 py-2 bg-zinc-900 hover:bg-[#ff2d87] border border-zinc-700/80 hover:border-[#ff2d87] text-white text-xs font-bold rounded-xl transition duration-200 flex items-center gap-1.5 shadow-sm">
              <span>${dict.service_book_btn}</span>
              <i data-lucide="chevron-right" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

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
      const isFounder = master.id === 'mst-1' || master.category === 'founder';

      return `
        <div class="glass-card glass-card-hover overflow-hidden flex flex-col group border ${isFounder ? 'border-pink-500/40 ring-1 ring-[#ff2d87]/30' : 'border-zinc-800'} rounded-2xl">
          <div class="h-80 relative overflow-hidden bg-zinc-950">
            <img 
              src="${master.photo}" 
              alt="${master.name}" 
              class="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 master-card-img"
              onerror="this.src='./images/banner.png'"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-[#0b0c10] via-black/30 to-transparent"></div>
            
            <!-- Top Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
              ${isFounder ? `
                <div class="bg-gradient-to-r from-amber-500 to-amber-600 text-black text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <i data-lucide="crown" class="w-3.5 h-3.5"></i>
                  <span>ASOSCHI</span>
                </div>
              ` : `
                <div class="bg-zinc-900/90 border border-zinc-700/80 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <i data-lucide="scissors" class="w-3.5 h-3.5 text-[#ff2d87]"></i>
                  <span>${master.title || 'TOP BARBER'}</span>
                </div>
              `}
            </div>

            <div class="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-amber-400 flex items-center gap-1 border border-amber-400/30">
              <i data-lucide="star" class="w-3.5 h-3.5 fill-amber-400"></i>
              ${master.rating} <span class="text-zinc-400 text-[10px]">(${master.reviews_count || 100}+)</span>
            </div>

            <div class="absolute bottom-3 left-4 right-4">
              <span class="text-[10px] font-bold text-pink-400 uppercase tracking-widest block mb-0.5">
                ${experience}
              </span>
              <h3 class="text-2xl font-black text-white flex items-center gap-2">
                ${master.name}
              </h3>
              <p class="text-xs text-zinc-300 font-medium">${specialty}</p>
            </div>
          </div>

          <div class="p-5 flex flex-col justify-between flex-1 space-y-4">
            <p class="text-xs text-zinc-400 italic leading-relaxed">
              "${description}"
            </p>

            <div class="space-y-2 pt-2 border-t border-zinc-800">
              <!-- Phone direct call pill -->
              <a 
                href="tel:${master.phone.replace(/\s+/g, '')}" 
                class="w-full py-2.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 border border-zinc-700/60 group/phone">
                <i data-lucide="phone-call" class="w-4 h-4 text-emerald-400 group-hover/phone:animate-bounce"></i>
                <span>${master.phone}</span>
              </a>

              <!-- Book Master Button -->
              <button 
                onclick="selectMasterAndScroll('${master.id}')"
                class="w-full py-2.5 px-3 glow-pink-btn text-white text-xs font-black uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2">
                <i data-lucide="calendar-check" class="w-4 h-4"></i>
                <span>${dict.master_book_btn}</span>
              </button>
            </div>
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
        <div class="relative group rounded-2xl overflow-hidden aspect-square bg-zinc-950 border border-zinc-800 shadow-md">
          <img 
            src="${item.image}" 
            alt="${title}" 
            class="w-full h-full object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
            loading="lazy"
            onclick="openImageLightbox('${item.image}', '${title.replace(/'/g, "\\'")}')"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300 flex items-end p-4 pointer-events-none">
            <div>
              <span class="text-[10px] uppercase font-bold text-[#ff2d87] tracking-wider block">WO & MAN</span>
              <p class="text-xs font-bold text-white">${title}</p>
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
        <div class="glass-card p-6 flex flex-col justify-between border border-zinc-800">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff2d87] to-zinc-900 flex items-center justify-center font-black text-white text-sm border border-pink-500/30">
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
          <div class="mt-4 pt-3 border-t border-zinc-800/80 flex items-center gap-1.5 text-[11px] text-[#ff2d87] font-semibold">
            <i data-lucide="badge-check" class="w-3.5 h-3.5"></i>
            <span>Tasdiqlangan mijoz fikri</span>
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
      
      const mainServices = state.data.services.filter(s => s.category === 'main');
      const careServices = state.data.services.filter(s => s.category === 'care');

      if (mainServices.length) {
        html += `<optgroup label="💈 Soch va Soqol">`;
        mainServices.forEach(s => {
          const name = state.lang === 'uz' ? s.name_uz : s.name_ru;
          html += `<option value="${s.id}" data-price="${s.price}">${name} — ${Number(s.price).toLocaleString('uz-UZ')} so'm</option>`;
        });
        html += `</optgroup>`;
      }

      if (careServices.length) {
        html += `<optgroup label="✨ Parvarish va VIP Obraz">`;
        careServices.forEach(s => {
          const name = state.lang === 'uz' ? s.name_uz : s.name_ru;
          html += `<option value="${s.id}" data-price="${s.price}">${name} — ${Number(s.price).toLocaleString('uz-UZ')} so'm</option>`;
        });
        html += `</optgroup>`;
      }

      bookingServiceSelect.innerHTML = html;
      if (currentVal) bookingServiceSelect.value = currentVal;
    }

    // Masters Dropdown
    if (bookingMasterSelect && state.data.masters) {
      const currentVal = bookingMasterSelect.value;
      let html = `<option value="">💈 ${dict.booking_master_any}</option>`;
      state.data.masters.forEach(m => {
        const spec = state.lang === 'uz' ? m.specialty_uz : m.specialty_ru;
        html += `<option value="${m.id}">${m.name} (${m.title || spec}) — ${m.phone}</option>`;
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
          class="time-chip py-2 px-3 text-xs font-bold rounded-xl border border-zinc-700 bg-zinc-900/80 hover:border-[#ff2d87] transition ${isActive ? 'active' : 'text-zinc-300'}">
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

  // --- Telegram Bot Direct Dispatch for GitHub Pages ---
  async function sendTelegramDirectToMasters(booking) {
    const token = (state.data && state.data.settings && state.data.settings.telegram_bot_token) 
      ? state.data.settings.telegram_bot_token 
      : "8982199071:AAEeR9ySgTlyG0NQozhDinluVDcjJqCSdiU";
    
    // Default chat ID for Jamoloddin (Founder)
    const jamoloddinChatId = (state.data && state.data.settings && state.data.settings.telegram_chat_id_jamoloddin) 
      || "5046237558";
    
    const akromChatId = (state.data && state.data.settings && state.data.settings.telegram_chat_id_akrom) || "";
    const axrorChatId = (state.data && state.data.settings && state.data.settings.telegram_chat_id_axror) || "";

    // Target chat targets
    const targets = [];

    if (booking.master_id === 'mst-1') {
      targets.push({ name: 'Jamoloddin', chatId: jamoloddinChatId });
    } else if (booking.master_id === 'mst-2') {
      if (akromChatId) targets.push({ name: 'Akrom', chatId: akromChatId });
      targets.push({ name: 'Jamoloddin (Asoschi)', chatId: jamoloddinChatId });
    } else if (booking.master_id === 'mst-3') {
      if (axrorChatId) targets.push({ name: 'Axror', chatId: axrorChatId });
      targets.push({ name: 'Jamoloddin (Asoschi)', chatId: jamoloddinChatId });
    } else {
      // Any master: dispatch to all available chat IDs
      targets.push({ name: 'Jamoloddin', chatId: jamoloddinChatId });
      if (akromChatId) targets.push({ name: 'Akrom', chatId: akromChatId });
      if (axrorChatId) targets.push({ name: 'Axror', chatId: axrorChatId });
    }

    const formattedPrice = Number(booking.service_price || 0).toLocaleString('uz-UZ');
    let sentCount = 0;

    for (const target of targets) {
      if (!target.chatId) continue;
      const text = `💈 <b>USTA UCHUN XABAR: Hurmatli ${target.name}!</b>
⚡️ <b>Yangi mijoz arizasi tushdi!</b>
━━━━━━━━━━━━━━━━━━━━
💈 <b>WO & MAN — Barbershop Yangiyo'l</b>
📍 <i>Bo'ston 1-o'tish ko'chasi, 1</i>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Ariza raqami:</b> <code>#${booking.id}</code>
👤 <b>Mijoz:</b> <b>${escapeHtml(booking.client_name)}</b>
📞 <b>Telefon:</b> <a href="tel:${booking.client_phone}">${booking.client_phone}</a>
✂️ <b>Xizmat:</b> <b>${escapeHtml(booking.service_name_uz || booking.service_name_ru)}</b>
💵 <b>Narx:</b> <b>${formattedPrice} so'm</b>
💈 <b>Tanlangan usta:</b> <b>${escapeHtml(booking.master_name || 'Ixtiyoriy usta')}</b>
📅 <b>Kuni:</b> <b>${booking.date}</b>
⏰ <b>Vaqti:</b> <b>${booking.time}</b>
💬 <b>Qo'shimcha izoh:</b> ${booking.notes ? escapeHtml(booking.notes) : '<i>Izoh yo\'q</i>'}
━━━━━━━━━━━━━━━━━━━━
🕒 <i>Sana: ${new Date().toLocaleDateString('uz-UZ')} ${booking.time}</i>
⚡️ <i>Mijoz bilan tezroq bog'laning!</i>`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: target.chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: true
          })
        });
        const json = await res.json();
        if (json.ok) sentCount++;
      } catch (err) {
        console.warn("Direct Telegram dispatch error for", target.name, err);
      }
    }

    return { sent: sentCount > 0, count: sentCount };
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

    const srv = (state.data && state.data.services) ? state.data.services.find(s => s.id === serviceId) : null;
    const mst = (state.data && state.data.masters) ? state.data.masters.find(m => m.id === masterId) : null;

    const booking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      client_name: name,
      client_phone: phone,
      service_id: serviceId,
      service_name_uz: srv ? srv.name_uz : 'Soch olish',
      service_name_ru: srv ? srv.name_ru : 'Стрижка',
      service_price: srv ? srv.price : 60000,
      master_id: masterId,
      master_name: mst ? `${mst.name} (${mst.title || 'Usta'})` : 'Ixtiyoriy usta',
      date: date,
      time: time,
      notes: notes
    };

    let telegramSent = false;

    // 1. Try backend API first
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
          telegramSent = result.telegram && result.telegram.sent;
          showSuccessModal(result.booking, result.telegram);
          bookingForm.reset();
          document.getElementById('booking-date').value = getTodayDateString();
          state.booking.service_id = '';
          updateBookingPrice();
          return;
        }
      }
    } catch (err) {
      // Backend not running (GitHub Pages) -> proceed to direct Telegram bot API
    }

    // 2. Direct Telegram API fallback for GitHub Pages
    try {
      const tgRes = await sendTelegramDirectToMasters(booking);
      telegramSent = tgRes.sent;
    } catch (e) {
      console.warn("Direct dispatch error:", e);
    }

    showSuccessModal(booking, { sent: telegramSent });
    bookingForm.reset();
    document.getElementById('booking-date').value = getTodayDateString();
    state.booking.service_id = '';
    updateBookingPrice();

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <span>${dict.booking_submit_btn}</span>
        <i data-lucide="arrow-right" class="w-4 h-4"></i>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }

  function showSuccessModal(booking, telegramInfo) {
    if (!successModal) return;

    document.getElementById('modal-res-id').textContent = '#' + booking.id;
    document.getElementById('modal-res-name').textContent = booking.client_name;
    document.getElementById('modal-res-phone').textContent = booking.client_phone;
    document.getElementById('modal-res-service').textContent = state.lang === 'uz' ? booking.service_name_uz : booking.service_name_ru;
    document.getElementById('modal-res-master').textContent = booking.master_name || 'Ixtiyoriy usta';
    document.getElementById('modal-res-datetime').textContent = `${booking.date} - soat ${booking.time}`;
    document.getElementById('modal-res-price').textContent = Number(booking.service_price).toLocaleString('uz-UZ') + " so'm";

    const tgBadge = document.getElementById('modal-tg-status');
    if (tgBadge) {
      if (telegramInfo && telegramInfo.sent) {
        tgBadge.className = "text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5";
        tgBadge.innerHTML = `<i data-lucide="check-check" class="w-3.5 h-3.5"></i> Ustalarning Telegram botiga xabar yetkazildi!`;
      } else {
        tgBadge.className = "text-[11px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5";
        tgBadge.innerHTML = `<i data-lucide="check" class="w-3.5 h-3.5"></i> Arizangiz qabul qilindi!`;
      }
    }

    successModal.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  function getTodayDateString() {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function escapeHtml(text) {
    if (!text) return '';
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Global triggers
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

  window.openImageLightbox = function(src, title) {
    const modal = document.getElementById('image-lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-title');
    if (modal && img) {
      img.src = src;
      if (caption) caption.textContent = title || '';
      modal.classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    }
  };

  window.closeImageLightbox = function() {
    const modal = document.getElementById('image-lightbox-modal');
    if (modal) modal.classList.add('hidden');
  };
});