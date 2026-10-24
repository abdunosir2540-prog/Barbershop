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

  // Initialize
  initApp();

  async function initApp() {
    setupLanguage();
    setupEventListeners();
    await fetchPublicData();
    renderAll();
    setupTimeSlots();
  }

  // --- API Fetch ---
  async function fetchPublicData() {
    try {
      const res = await fetch('/api/public-data');
      const json = await res.json();
      if (json.success) {
        state.data = json.data;
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
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

      const result = await response.json();

      if (result.success) {
        // Show success modal
        showSuccessModal(result.booking, result.telegram);
        // Reset form
        bookingForm.reset();
        document.getElementById('booking-date').value = getTodayDateString();
        state.booking.service_id = '';
        updateBookingPrice();
      } else {
        alert(result.error || "Xatolik yuz berdi");
      }
    } catch (err) {
      console.error('Submit error:', err);
      alert(state.lang === 'uz' ? "Server bilan aloqa uzildi. Iltimos qayta urining." : "Ошибка связи с сервером. Попробуйте снова.");
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
