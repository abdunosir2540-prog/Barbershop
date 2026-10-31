// WO & MAN Admin Panel Logic (Dual Mode: Full GitHub Pages Static + Backend API Support)
document.addEventListener('DOMContentLoaded', () => {
  const tokenKey = 'woman_admin_token';
  const credsKey = 'woman_admin_creds';
  const dbKey = 'woman_db_data';
  let currentToken = localStorage.getItem(tokenKey);

  // Screens
  const loginScreen = document.getElementById('login-screen');
  const dashboardScreen = document.getElementById('dashboard-screen');

  // Login form
  const loginForm = document.getElementById('admin-login-form');
  const loginError = document.getElementById('login-error');
  const logoutBtn = document.getElementById('logout-btn');

  // Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Bookings
  const bookingsTableBody = document.getElementById('bookings-table-body');
  const bookingsSearch = document.getElementById('bookings-search');
  const bookingsFilterStatus = document.getElementById('bookings-filter-status');
  const refreshBookingsBtn = document.getElementById('refresh-bookings-btn');

  // Default Master & Services Seed Data
  const DEFAULT_DATA = {
    settings: {
      salon_name: "WO & MAN",
      salon_subtitle_uz: "Go'zallik Studiyasi & Barbershop | Yangiyo'l",
      salon_subtitle_ru: "Студия Красоты & Barbershop | Янгиюль",
      admin_username: "admin",
      admin_password: "admin123",
      telegram_bot_token: "8982199071:AAEeR9ySgTlyG0NQozhDinluVDcjJqCSdiU",
      telegram_chat_id: "5046237558",
      telegram_chat_id_jamoloddin: "5046237558",
      telegram_chat_id_akrom: "",
      telegram_chat_id_axror: "",
      telegram_notifications_enabled: true,
      phone_primary: "+998 97 977 59 94",
      phone_secondary: "+998 97 548 77 97",
      phone_tertiary: "+998 77 071 78 37",
      address_uz: "Toshkent viloyati, Yangiyoʻl shahri, Bo'ston 1-o'tish ko'chasi, 1",
      address_ru: "Ташкентская область, г. Янгиюль, 1-й проезд Бустон, 1",
      working_hours_uz: "Dushanba - Yakshanba: 09:00 - 22:00",
      working_hours_ru: "Понедельник - Воскресенье: 09:00 - 22:00",
      instagram_url: "https://instagram.com/wo_man_yangiyol",
      telegram_url: "https://t.me/WoManbarberbot",
      yandex_map_url: "https://yandex.ru/maps/-/CXb4jS9L"
    },
    services: [
      { id: "srv-1", category: "main", name_uz: "Soch olish", name_ru: "Стрижка волос", desc_uz: "Klassik va zamonaviy erkaklar soch turmagi, yuvish va stil berish", desc_ru: "Классическая и модельная мужская стрижка, мытье и укладка", price: 60000, duration_min: 30, popular: true, badge_uz: "TOP" },
      { id: "srv-2", category: "main", name_uz: "Soch soqol", name_ru: "Стрижка + Борода", desc_uz: "Soch olish va soqolni professional shakllantirish to'liq to'plami", desc_ru: "Полный комплекс стрижки волос и моделирования бороды", price: 100000, duration_min: 50, popular: true, badge_uz: "Mashhur" },
      { id: "srv-3", category: "main", name_uz: "Detskiy", name_ru: "Детская стрижка", desc_uz: "Kichkintoylar uchun xushmuomala va ehtiyotkor zamonaviy soch turmagi", desc_ru: "Бережная и стильная стрижка для юных джентльменов", price: 50000, duration_min: 25, popular: false },
      { id: "srv-4", category: "main", name_uz: "Ukladka", name_ru: "Укладка волос", desc_uz: "Fen va sifatli fiksator vositalari yordamida sochni chiroyli turmaklash", desc_ru: "Профессиональная укладка и текстурный стайлинг волос", price: 50000, duration_min: 20, popular: false },
      { id: "srv-5", category: "care", name_uz: "Soch boyash", name_ru: "Окрашивание волос", desc_uz: "Oq sochlarni yashirish (kamuflyaj) va sochlarga sifatli rang berish", desc_ru: "Камуфляж седины и естественное тонирование волос", price: 50000, duration_min: 30, popular: false },
      { id: "srv-6", category: "main", name_uz: "Soqol", name_ru: "Моделирование бороды", desc_uz: "Soqolni tekislash, aniq kontur chizish va maxsus moylar bilan parvarish", desc_ru: "Стрижка и контуринг бороды, уход смягчающими маслами", price: 40000, duration_min: 20, popular: false },
      { id: "srv-7", category: "care", name_uz: "Vosk", name_ru: "Восковая депиляция (Воск)", desc_uz: "Burun, quloq va yuzdagi keraksiz tuklarni og'riqsiz va toza yo'qotish", desc_ru: "Удаление нежелательных волос горячим воском (нос, уши, лицо)", price: 30000, duration_min: 15, popular: false },
      { id: "srv-8", category: "care", name_uz: "Maska", name_ru: "Маска для лица", desc_uz: "Yuz terisini chuqur tozalovchi qora niqob va oziqlantiruvchi parvarish", desc_ru: "Очищающая черная маска и уход за кожей лица", price: 40000, duration_min: 20, popular: false },
      { id: "srv-9", category: "care", name_uz: "Massaj golovi", name_ru: "Массаж головы", desc_uz: "Bosh va bo'yin sohasini qon aylanishini yaxshilovchi tinchlantiruvchi massaj", desc_ru: "Расслабляющий тонизирующий массаж кожи головы и шеи", price: 50000, duration_min: 20, popular: false },
      { id: "srv-10", category: "care", name_uz: "Kuyov obroz", name_ru: "Образ жениха (VIP)", desc_uz: "VIP to'liq kompleks: soch, soqol, yuz maskasi, bosh massaji va bayramona ukladka", desc_ru: "Полный VIP комплекс жениха: стрижка, борода, маска, массаж и стайлинг", price: 400000, duration_min: 90, popular: true, badge_uz: "VIP" }
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
        rating: 5.0,
        reviews_count: 280,
        photo: "../images/master-jamoloddin.jpg",
        description_uz: "WO & MAN asoschisi va oliy toifali tajribali ustasi."
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
        rating: 4.95,
        reviews_count: 210,
        photo: "../images/master-akrom.jpg",
        description_uz: "Fade, klassik va zamonaviy erkaklar soch turmagi bo'yicha mahoratli usta."
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
        rating: 4.92,
        reviews_count: 175,
        photo: "../images/master-axror.jpg",
        description_uz: "Kreativ yoshlar uslubi, ukladka va bolalar soch turmagi ustasi."
      }
    ],
    bookings: [
      {
        id: "BK-1001",
        client_name: "Azizbek",
        client_phone: "+998 97 977 59 94",
        service_id: "srv-1",
        service_name_uz: "Soch olish",
        service_price: 60000,
        master_id: "mst-1",
        master_name: "Jamoloddin",
        date: "2026-10-28",
        time: "14:00",
        notes: "Klassik soch turmagi",
        status: "confirmed",
        created_at: new Date().toISOString(),
        telegram_status: "sent"
      }
    ]
  };

  // State Management
  function getLocalData() {
    try {
      const raw = localStorage.getItem(dbKey);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEFAULT_DATA;
  }

  function saveLocalData(data) {
    localStorage.setItem(dbKey, JSON.stringify(data));
  }

  // Init
  if (currentToken) {
    showDashboard();
  } else {
    showLogin();
  }

  // --- Auth Handlers ---
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.classList.add('hidden');
    const username = document.getElementById('admin-username').value.trim();
    const password = document.getElementById('admin-password').value.trim();

    // 1. Try Backend API first if running locally
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          currentToken = data.token;
          localStorage.setItem(tokenKey, currentToken);
          showDashboard();
          return;
        }
      }
    } catch (err) {
      // Backend not running (GitHub Pages static mode)
    }

    // 2. Static GitHub Pages Authentication Fallback
    const storedCreds = JSON.parse(localStorage.getItem(credsKey) || '{"user":"admin","pass":"admin123"}');
    if (username === storedCreds.user && password === storedCreds.pass) {
      currentToken = 'woman_admin_token_static';
      localStorage.setItem(tokenKey, currentToken);
      showDashboard();
    } else {
      loginError.textContent = "Login yoki parol xato! Standart: admin / admin123";
      loginError.classList.remove('hidden');
    }
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem(tokenKey);
    currentToken = null;
    showLogin();
  });

  function showLogin() {
    loginScreen.classList.remove('hidden');
    dashboardScreen.classList.add('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  function showDashboard() {
    loginScreen.classList.add('hidden');
    dashboardScreen.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
    loadDashboardData();
  }

  // --- Tabs Navigation ---
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      
      tabBtns.forEach(b => {
        b.classList.remove('border-[#ff2d87]', 'text-[#ff2d87]');
        b.classList.add('border-transparent', 'text-zinc-400');
      });
      btn.classList.add('border-[#ff2d87]', 'text-[#ff2d87]');
      btn.classList.remove('border-transparent', 'text-zinc-400');

      tabContents.forEach(content => content.classList.add('hidden'));
      const activeContent = document.getElementById(`tab-content-${target}`);
      if (activeContent) activeContent.classList.remove('hidden');

      if (target === 'bookings') loadBookings();
      if (target === 'services') loadServices();
      if (target === 'masters') loadMasters();
      if (target === 'settings') loadSettings();
      if (window.lucide) window.lucide.createIcons();
    });
  });

  // --- Dashboard Data Loading ---
  async function loadDashboardData() {
    await loadStats();
    await loadBookings();
  }

  async function loadStats() {
    const data = getLocalData();
    const bookings = data.bookings || [];

    const total = bookings.length;
    const pending = bookings.filter(b => b.status === 'pending').length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const revenue = bookings.reduce((sum, b) => sum + (Number(b.service_price) || 0), 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(b => b.date === todayStr).length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-pending').textContent = pending;
    document.getElementById('stat-today').textContent = todayBookings;
    document.getElementById('stat-confirmed').textContent = confirmed;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-revenue').textContent = revenue.toLocaleString('uz-UZ') + " so'm";
    
    const badge = document.getElementById('badge-pending-count');
    if (badge) badge.textContent = pending;
  }

  // --- Bookings Management ---
  async function loadBookings() {
    const data = getLocalData();
    let bookings = data.bookings || [];

    const q = (bookingsSearch ? bookingsSearch.value.trim().toLowerCase() : '');
    const status = bookingsFilterStatus ? bookingsFilterStatus.value : 'all';

    if (q) {
      bookings = bookings.filter(b => 
        (b.client_name && b.client_name.toLowerCase().includes(q)) ||
        (b.client_phone && b.client_phone.includes(q)) ||
        (b.id && b.id.toLowerCase().includes(q))
      );
    }

    if (status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }

    renderBookingsTable(bookings);
  }

  if (bookingsSearch) {
    bookingsSearch.addEventListener('input', loadBookings);
  }
  if (bookingsFilterStatus) {
    bookingsFilterStatus.addEventListener('change', loadBookings);
  }
  if (refreshBookingsBtn) {
    refreshBookingsBtn.addEventListener('click', () => {
      loadStats();
      loadBookings();
    });
  }

  function renderBookingsTable(bookings) {
    if (!bookingsTableBody) return;

    if (!bookings.length) {
      bookingsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-8 text-zinc-500">Hech qanday ariza topilmadi</td>
        </tr>
      `;
      return;
    }

    bookingsTableBody.innerHTML = bookings.map(b => {
      let statusBadge = '';
      if (b.status === 'pending') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Kutilmoqda</span>';
      } else if (b.status === 'confirmed') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">Tasdiqlandi</span>';
      } else if (b.status === 'completed') {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Bajarildi</span>';
      } else {
        statusBadge = '<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Bekor qilingan</span>';
      }

      return `
        <tr class="hover:bg-zinc-900/50 transition">
          <td class="py-3 px-4 font-mono text-[11px] font-bold text-pink-400">
            #${b.id}<br><span class="text-[10px] text-zinc-500">${b.date}</span>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-white">${escapeHtml(b.client_name)}</div>
            <a href="tel:${b.client_phone}" class="text-emerald-400 font-bold hover:underline">${b.client_phone}</a>
          </td>
          <td class="py-3 px-4">
            <div class="font-bold text-zinc-200">${escapeHtml(b.service_name_uz || 'Xizmat')}</div>
            <div class="text-[11px] text-amber-300">${Number(b.service_price).toLocaleString('uz-UZ')} so'm</div>
          </td>
          <td class="py-3 px-4 font-bold text-zinc-300">
            ${escapeHtml(b.master_name || 'Ixtiyoriy usta')}
          </td>
          <td class="py-3 px-4 font-mono text-zinc-300">
            ${b.time}
          </td>
          <td class="py-3 px-4">
            <span class="text-emerald-400 font-bold flex items-center gap-1">
              <i data-lucide="check" class="w-3.5 h-3.5"></i> Yuborildi
            </span>
          </td>
          <td class="py-3 px-4">
            ${statusBadge}
          </td>
          <td class="py-3 px-4 text-right space-x-1">
            <button onclick="changeBookingStatus('${b.id}', 'confirmed')" title="Tasdiqlash" class="p-1.5 bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-800 rounded-lg transition">
              <i data-lucide="check" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="changeBookingStatus('${b.id}', 'completed')" title="Bajarildi" class="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg transition">
              <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="deleteBookingItem('${b.id}')" title="O'chirish" class="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 rounded-lg transition">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  window.changeBookingStatus = function(id, newStatus) {
    const data = getLocalData();
    const b = (data.bookings || []).find(item => item.id === id);
    if (b) {
      b.status = newStatus;
      saveLocalData(data);
      loadStats();
      loadBookings();
    }
  };

  window.deleteBookingItem = function(id) {
    if (!confirm("Haqiqatan ham ushbu arizani o'chirmoqchimisiz?")) return;
    const data = getLocalData();
    data.bookings = (data.bookings || []).filter(item => item.id !== id);
    saveLocalData(data);
    loadStats();
    loadBookings();
  };

  // --- Services Management ---
  async function loadServices() {
    const container = document.getElementById('admin-services-list');
    if (!container) return;

    const data = getLocalData();
    const services = data.services || [];

    container.innerHTML = services.map(s => {
      return `
        <div class="glass-card p-5 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-zinc-900 text-pink-400 border border-zinc-800">
                ${s.category === 'main' ? 'Soch & Soqol' : 'Parvarish & VIP'}
              </span>
              <span class="text-xs font-bold text-amber-400">${Number(s.price).toLocaleString('uz-UZ')} so'm</span>
            </div>
            <h4 class="text-base font-black text-white mb-1">${s.name_uz}</h4>
            <p class="text-xs text-zinc-400 mb-4 line-clamp-2">${s.desc_uz || ''}</p>
          </div>
          <div class="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span class="text-xs text-zinc-500">${s.duration_min} daqiqa</span>
            <div class="flex gap-2">
              <button onclick="editServiceItem('${s.id}')" class="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold transition">Tahrirlash</button>
              <button onclick="deleteServiceItem('${s.id}')" class="px-3 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold transition">O'chirish</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // --- Masters Management ---
  async function loadMasters() {
    const container = document.getElementById('admin-masters-list');
    if (!container) return;

    const data = getLocalData();
    const masters = data.masters || [];

    container.innerHTML = masters.map(m => {
      return `
        <div class="glass-card overflow-hidden border border-zinc-800 rounded-2xl flex flex-col justify-between">
          <div>
            <div class="h-44 bg-zinc-950 relative overflow-hidden">
              <img src="${m.photo}" alt="${m.name}" class="w-full h-full object-cover object-top" onerror="this.src='../images/banner.png'" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
              <div class="absolute bottom-3 left-3 right-3">
                <span class="text-[10px] font-bold text-pink-400 uppercase tracking-wider block">${m.title || 'Barber'}</span>
                <h4 class="text-lg font-black text-white">${m.name}</h4>
              </div>
            </div>
            <div class="p-4 space-y-2">
              <div class="text-xs text-emerald-400 font-bold flex items-center gap-1.5">
                <i data-lucide="phone" class="w-3.5 h-3.5"></i>
                <a href="tel:${m.phone}" class="hover:underline">${m.phone}</a>
              </div>
              <div class="text-[11px] text-zinc-400">
                <span class="text-zinc-500 font-medium">Chat ID:</span>
                <span class="font-mono text-white font-bold">${m.telegram_chat_id || 'Kiritilmagan'}</span>
              </div>
              <div class="text-[11px] text-zinc-400 italic">
                "${m.description_uz || ''}"
              </div>
            </div>
          </div>
          <div class="p-4 pt-0">
            <button onclick="promptMasterChatId('${m.id}')" class="w-full py-2 bg-zinc-800 hover:bg-[#ff2d87] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5">
              <i data-lucide="edit" class="w-3.5 h-3.5"></i>
              <span>Chat ID o'zgartirish</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  window.promptMasterChatId = function(masterId) {
    const data = getLocalData();
    const m = (data.masters || []).find(item => item.id === masterId);
    if (!m) return;

    const newChatId = prompt(`${m.name} uchun yangi Telegram Chat ID kiriting:`, m.telegram_chat_id || '');
    if (newChatId !== null) {
      m.telegram_chat_id = newChatId.trim();
      if (m.id === 'mst-1') data.settings.telegram_chat_id_jamoloddin = m.telegram_chat_id;
      if (m.id === 'mst-2') data.settings.telegram_chat_id_akrom = m.telegram_chat_id;
      if (m.id === 'mst-3') data.settings.telegram_chat_id_axror = m.telegram_chat_id;
      saveLocalData(data);
      loadMasters();
      alert(`${m.name} uchun Telegram Chat ID muvaffaqiyatli saqlandi!`);
    }
  };

  // --- Settings & Telegram Management ---
  async function loadSettings() {
    const data = getLocalData();
    const s = data.settings || {};

    document.getElementById('setting-bot-token').value = s.telegram_bot_token || '';
    document.getElementById('setting-chat-id').value = s.telegram_chat_id || '';
    
    if (document.getElementById('setting-chat-id-jamoloddin')) {
      document.getElementById('setting-chat-id-jamoloddin').value = s.telegram_chat_id_jamoloddin || '5046237558';
    }
    if (document.getElementById('setting-chat-id-akrom')) {
      document.getElementById('setting-chat-id-akrom').value = s.telegram_chat_id_akrom || '';
    }
    if (document.getElementById('setting-chat-id-axror')) {
      document.getElementById('setting-chat-id-axror').value = s.telegram_chat_id_axror || '';
    }
    document.getElementById('setting-bot-enabled').checked = s.telegram_notifications_enabled !== false;

    if (document.getElementById('setting-phone-1')) document.getElementById('setting-phone-1').value = s.phone_primary || '+998 97 977 59 94';
    if (document.getElementById('setting-phone-2')) document.getElementById('setting-phone-2').value = s.phone_secondary || '+998 97 548 77 97';
    if (document.getElementById('setting-address-uz')) document.getElementById('setting-address-uz').value = s.address_uz || 'Toshkent viloyati, Yangiyoʻl shahri, Bo\'ston 1-o\'tish ko\'chasi, 1';
    if (document.getElementById('setting-hours-uz')) document.getElementById('setting-hours-uz').value = s.working_hours_uz || 'Dushanba - Yakshanba: 09:00 - 22:00';
    if (document.getElementById('setting-admin-user')) document.getElementById('setting-admin-user').value = s.admin_username || 'admin';
  }

  // Save Telegram Settings
  const telegramForm = document.getElementById('telegram-settings-form');
  if (telegramForm) {
    telegramForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const token = document.getElementById('setting-bot-token').value.trim();
      const chatId = document.getElementById('setting-chat-id').value.trim();
      const chatIdJamoloddin = document.getElementById('setting-chat-id-jamoloddin') ? document.getElementById('setting-chat-id-jamoloddin').value.trim() : '';
      const chatIdAkrom = document.getElementById('setting-chat-id-akrom') ? document.getElementById('setting-chat-id-akrom').value.trim() : '';
      const chatIdAxror = document.getElementById('setting-chat-id-axror') ? document.getElementById('setting-chat-id-axror').value.trim() : '';
      const enabled = document.getElementById('setting-bot-enabled').checked;

      const data = getLocalData();
      data.settings.telegram_bot_token = token;
      data.settings.telegram_chat_id = chatId;
      data.settings.telegram_chat_id_jamoloddin = chatIdJamoloddin;
      data.settings.telegram_chat_id_akrom = chatIdAkrom;
      data.settings.telegram_chat_id_axror = chatIdAxror;
      data.settings.telegram_notifications_enabled = enabled;

      // Update in masters list too
      if (data.masters) {
        data.masters.forEach(m => {
          if (m.id === 'mst-1') m.telegram_chat_id = chatIdJamoloddin;
          if (m.id === 'mst-2') m.telegram_chat_id = chatIdAkrom;
          if (m.id === 'mst-3') m.telegram_chat_id = chatIdAxror;
        });
      }

      saveLocalData(data);
      alert("✅ Telegram sozlamalari muvaffaqiyatli saqlandi!");
    });
  }

  // Auto-detect Telegram Chat ID
  const autoDetectBtn = document.getElementById('auto-detect-chat-btn');
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener('click', async () => {
      const token = document.getElementById('setting-bot-token').value.trim();
      const statusBox = document.getElementById('test-telegram-status');
      
      if (!token) {
        alert("Iltimos, avval Telegram Bot Tokenni kiriting!");
        return;
      }

      statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-zinc-800 text-zinc-300";
      statusBox.textContent = "Bot yangilanishlari tekshirilmoqda...";
      statusBox.classList.remove('hidden');

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/getUpdates`);
        const json = await res.json();
        
        if (json.ok && json.result && json.result.length > 0) {
          const updates = json.result;
          let foundChat = null;

          for (let i = updates.length - 1; i >= 0; i--) {
            const u = updates[i];
            const msg = u.message || u.edited_message || u.channel_post || u.my_chat_member;
            if (msg && msg.chat) {
              foundChat = {
                id: String(msg.chat.id),
                name: (msg.from && msg.from.first_name) ? `${msg.from.first_name} ${msg.from.last_name || ''}`.trim() : 'Usta'
              };
              break;
            }
          }

          if (foundChat) {
            document.getElementById('setting-chat-id').value = foundChat.id;
            statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-emerald-950 text-emerald-200 border border-emerald-800";
            statusBox.innerHTML = `✅ <b>Chat ID topildi:</b> ${foundChat.id} (${foundChat.name})! Raqam kiritildi. Saqlash tugmasini bosing.`;
          } else {
            statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-amber-950 text-amber-200 border border-amber-800";
            statusBox.innerHTML = `⚠️ Chat ID aniqlanmadi. Iltimos, Telegramda <a href="https://t.me/WoManbarberbot" target="_blank" class="underline font-bold">@WoManbarberbot</a> ga kiring va <b>/start</b> bosing.`;
          }
        } else {
          statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-amber-950 text-amber-200 border border-amber-800";
          statusBox.innerHTML = `⚠️ Botga hali hech kim xabar yozmagan. Telegramda <a href="https://t.me/WoManbarberbot" target="_blank" class="underline font-bold">@WoManbarberbot</a> ga kirib <b>/start</b> bosing va qayta urinib ko'ring.`;
        }
      } catch (err) {
        statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-200 border border-rose-800";
        statusBox.textContent = "Tarmoq xatosi: " + err.message;
      }
    });
  }

  // Test Telegram Message
  const testTelegramBtn = document.getElementById('test-telegram-btn');
  if (testTelegramBtn) {
    testTelegramBtn.addEventListener('click', async () => {
      const token = document.getElementById('setting-bot-token').value.trim();
      const chatId = document.getElementById('setting-chat-id').value.trim() || document.getElementById('setting-chat-id-jamoloddin').value.trim();
      const statusBox = document.getElementById('test-telegram-status');

      if (!token || !chatId) {
        alert("Iltimos, Bot Token va Chat ID raqamini kiriting!");
        return;
      }

      statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-zinc-800 text-zinc-300";
      statusBox.textContent = "Telegram botga test xabari yuborilmoqda...";
      statusBox.classList.remove('hidden');

      const testText = `🎉 <b>WO & MAN — Telegram Bot muvaffaqiyatli ulandi!</b>
━━━━━━━━━━━━━━━━━━━━
✅ Bot sozlamalari to'g'ri ishlamoqda.
💈 Endi saytdan tushgan barcha yangi arizalar ushbu chatga zudlik bilan alohida yetib keladi!
🕒 <i>Sana va vaqt: ${new Date().toLocaleString('uz-UZ')}</i>`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: testText,
            parse_mode: 'HTML'
          })
        });
        const json = await res.json();

        if (json.ok) {
          statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-emerald-950 text-emerald-200 border border-emerald-800";
          statusBox.innerHTML = `✅ <b>Muvaffaqiyatli!</b> Telegram botga test xabari bordi. Botingizni tekshirib ko'ring!`;
        } else {
          statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-200 border border-rose-800";
          statusBox.innerHTML = `❌ <b>Telegram API xatosi:</b> ${json.description || 'Xabar yuborilmadi'}. Avval botga kirib /start bosing!`;
        }
      } catch (err) {
        statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-200 border border-rose-800";
        statusBox.textContent = "Ulanish xatosi: " + err.message;
      }
    });
  }

  // Save General Studio Info
  const studioForm = document.getElementById('studio-settings-form');
  if (studioForm) {
    studioForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = getLocalData();
      data.settings.phone_primary = document.getElementById('setting-phone-1').value.trim();
      data.settings.phone_secondary = document.getElementById('setting-phone-2').value.trim();
      data.settings.address_uz = document.getElementById('setting-address-uz').value.trim();
      data.settings.working_hours_uz = document.getElementById('setting-hours-uz').value.trim();
      saveLocalData(data);
      alert("✅ Studiya ma'lumotlari saqlandi!");
    });
  }

  // Save Password Change
  const passwordForm = document.getElementById('password-settings-form');
  if (passwordForm) {
    passwordForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const user = document.getElementById('setting-admin-user').value.trim();
      const pass = document.getElementById('setting-admin-pass').value.trim();

      if (!user || !pass) {
        alert("Login va yangi parolni kiriting!");
        return;
      }

      localStorage.setItem(credsKey, JSON.stringify({ user, pass }));
      alert("✅ Admin logini va paroli muvaffaqiyatli yangilandi!");
    });
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
});