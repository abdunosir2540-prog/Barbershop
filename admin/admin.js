// WO & MAN Admin Panel Logic
document.addEventListener('DOMContentLoaded', () => {
  const tokenKey = 'woman_admin_token';
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

  // State
  let cachedServices = [];
  let cachedMasters = [];

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

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (data.success) {
        currentToken = data.token;
        localStorage.setItem(tokenKey, currentToken);
        showDashboard();
      } else {
        loginError.textContent = data.error || "Login yoki parol xato!";
        loginError.classList.remove('hidden');
      }
    } catch (err) {
      loginError.textContent = "Server bilan bog'lanishda xatolik yuz berdi.";
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
    });
  });

  // --- API Helper with Auth Header ---
  async function adminFetch(url, options = {}) {
    const headers = options.headers || {};
    headers['Authorization'] = `Bearer ${currentToken}`;
    headers['Content-Type'] = 'application/json';

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      alert("Sessiya muddati tugadi. Iltimos, qayta kiring.");
      localStorage.removeItem(tokenKey);
      currentToken = null;
      showLogin();
      throw new Error("Unauthorized");
    }
    return res.json();
  }

  // --- Dashboard Data Loading ---
  async function loadDashboardData() {
    await loadStats();
    await loadBookings();
  }

  async function loadStats() {
    try {
      const data = await adminFetch('/api/admin/stats');
      if (data.success) {
        const s = data.stats;
        document.getElementById('stat-total').textContent = s.total;
        document.getElementById('stat-pending').textContent = s.pending;
        document.getElementById('stat-today').textContent = s.todayBookings;
        document.getElementById('stat-confirmed').textContent = s.confirmed;
        document.getElementById('stat-completed').textContent = s.completed;
        document.getElementById('stat-revenue').textContent = Number(s.estimatedRevenue).toLocaleString('uz-UZ') + " so'm";
        
        const badge = document.getElementById('badge-pending-count');
        if (badge) badge.textContent = s.pending;
      }
    } catch (err) {
      console.error('Stats error:', err);
    }
  }

  // --- Bookings ---
  async function loadBookings() {
    try {
      const q = bookingsSearch.value.trim();
      const status = bookingsFilterStatus.value;
      let url = `/api/admin/bookings?search=${encodeURIComponent(q)}&status=${status}`;

      const data = await adminFetch(url);
      if (data.success) {
        renderBookingsTable(data.bookings);
      }
    } catch (err) {
      console.error('Bookings load error:', err);
    }
  }

  function renderBookingsTable(bookings) {
    if (!bookings || bookings.length === 0) {
      bookingsTableBody.innerHTML = `
        <tr>
          <td colspan="8" class="text-center py-12 text-zinc-500">
            Arizalar mavjud emas yoki qidiruv bo'yicha hech narsa topilmadi.
          </td>
        </tr>
      `;
      return;
    }

    bookingsTableBody.innerHTML = bookings.map(b => {
      const formattedPrice = Number(b.service_price || 0).toLocaleString('uz-UZ');
      
      // Status badge
      let statusBadge = '';
      if (b.status === 'pending') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-950/60 text-amber-300 border border-amber-800">⏳ Kutilmoqda</span>`;
      } else if (b.status === 'confirmed') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-800">✅ Tasdiqlandi</span>`;
      } else if (b.status === 'completed') {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-950/60 text-purple-300 border border-purple-800">🎉 Yakunlandi</span>`;
      } else {
        statusBadge = `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-950/60 text-rose-300 border border-rose-800">❌ Bekor qilindi</span>`;
      }

      // Telegram delivery status
      let tgBadge = '';
      if (b.telegram_status === 'sent') {
        tgBadge = `<span class="text-emerald-400 font-bold flex items-center gap-1" title="Telegramga yuborilgan"><i data-lucide="check" class="w-3.5 h-3.5"></i> Yuborildi</span>`;
      } else if (b.telegram_status === 'failed') {
        tgBadge = `<span class="text-rose-400 font-bold flex items-center gap-1" title="Xatolik yuz bergan"><i data-lucide="alert-circle" class="w-3.5 h-3.5"></i> Xato</span>`;
      } else {
        tgBadge = `<span class="text-zinc-500 text-[10px]" title="Bot ulanmagan">-</span>`;
      }

      return `
        <tr class="hover:bg-zinc-900/50 transition">
          <td class="py-3.5 px-4 font-mono font-bold text-pink-400">
            #${b.id}
            <div class="text-[10px] font-sans text-zinc-500 font-normal">
              ${new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </td>
          
          <td class="py-3.5 px-4">
            <div class="font-bold text-white text-xs">${b.client_name}</div>
            <a href="tel:${b.client_phone}" class="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1">
              <i data-lucide="phone" class="w-3 h-3 text-pink-400"></i> ${b.client_phone}
            </a>
          </td>

          <td class="py-3.5 px-4">
            <div class="text-xs text-zinc-200 font-semibold">${b.service_name_uz || b.service_name_ru || '-'}</div>
            <div class="text-[11px] font-bold text-pink-400">${formattedPrice} so'm</div>
          </td>

          <td class="py-3.5 px-4 text-zinc-300">
            ${b.master_name || '<span class="text-zinc-500">Ixtiyoriy</span>'}
          </td>

          <td class="py-3.5 px-4">
            <div class="font-bold text-white">${b.date}</div>
            <div class="text-zinc-400 text-[11px] font-mono">⏰ ${b.time}</div>
          </td>

          <td class="py-3.5 px-4 text-[11px]">
            ${tgBadge}
          </td>

          <td class="py-3.5 px-4">
            ${statusBadge}
          </td>

          <td class="py-3.5 px-4 text-right">
            <div class="flex items-center justify-end gap-1.5">
              ${b.status === 'pending' ? `
                <button onclick="updateBooking('${b.id}', 'confirmed')" class="p-1.5 bg-emerald-950 hover:bg-emerald-800 text-emerald-300 rounded-lg transition" title="Tasdiqlash">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}

              ${b.status === 'confirmed' ? `
                <button onclick="updateBooking('${b.id}', 'completed')" class="p-1.5 bg-purple-950 hover:bg-purple-800 text-purple-300 rounded-lg transition" title="Bajarildi deb belgilash">
                  <i data-lucide="check-check" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}

              ${b.status !== 'cancelled' ? `
                <button onclick="updateBooking('${b.id}', 'cancelled')" class="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 rounded-lg transition" title="Bekor qilish">
                  <i data-lucide="x" class="w-3.5 h-3.5"></i>
                </button>
              ` : ''}

              <button onclick="deleteBooking('${b.id}')" class="p-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-400 rounded-lg transition" title="O'chirish">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  // Booking search & filter events
  bookingsSearch.addEventListener('input', debounce(loadBookings, 300));
  bookingsFilterStatus.addEventListener('change', loadBookings);
  refreshBookingsBtn.addEventListener('click', () => {
    loadStats();
    loadBookings();
  });

  // Global booking action triggers
  window.updateBooking = async function(id, status) {
    try {
      const data = await adminFetch(`/api/admin/bookings/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      if (data.success) {
        loadStats();
        loadBookings();
      }
    } catch (err) {
      alert("Statusni o'zgartirishda xatolik!");
    }
  };

  window.deleteBooking = async function(id) {
    if (!confirm("Haqiqatan ham bu arizani o'chirmoqchimisiz?")) return;
    try {
      const data = await adminFetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE'
      });
      if (data.success) {
        loadStats();
        loadBookings();
      }
    } catch (err) {
      alert("O'chirishda xatolik!");
    }
  };

  // --- Services Management ---
  async function loadServices() {
    try {
      const data = await adminFetch('/api/admin/services');
      if (data.success) {
        cachedServices = data.services;
        renderAdminServices(cachedServices);
      }
    } catch (err) {
      console.error('Services error:', err);
    }
  }

  function renderAdminServices(services) {
    const list = document.getElementById('admin-services-list');
    list.innerHTML = services.map(s => {
      const isMen = s.category === 'men';
      return `
        <div class="glass-card p-5 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase px-2 py-0.5 rounded ${isMen ? 'bg-zinc-800 text-zinc-300' : 'bg-pink-950/60 text-pink-300'}">
                ${s.category.toUpperCase()}
              </span>
              <span class="text-xs text-zinc-400 font-mono">${s.duration_min} daqiqa</span>
            </div>
            <h4 class="text-base font-bold text-white mb-1">${s.name_uz}</h4>
            <div class="text-xs text-zinc-400 mb-2">${s.name_ru}</div>
            <div class="text-lg font-black text-pink-400 mb-4">${Number(s.price).toLocaleString('uz-UZ')} so'm</div>
          </div>
          <div class="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <button onclick="editService('${s.id}')" class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg text-white">Tahrirlash</button>
            <button onclick="deleteService('${s.id}')" class="px-3 py-1.5 bg-rose-950 hover:bg-rose-900 text-xs font-bold rounded-lg text-rose-300">O'chirish</button>
          </div>
        </div>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  document.getElementById('add-service-btn').addEventListener('click', () => {
    document.getElementById('service-edit-id').value = '';
    document.getElementById('service-modal-form').reset();
    document.getElementById('service-modal-title').textContent = "Yangi xizmat qo'shish";
    document.getElementById('service-modal').classList.remove('hidden');
  });

  document.getElementById('service-modal-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('service-edit-id').value;
    const body = {
      category: document.getElementById('srv-category').value,
      name_uz: document.getElementById('srv-name-uz').value.trim(),
      name_ru: document.getElementById('srv-name-ru').value.trim(),
      price: Number(document.getElementById('srv-price').value),
      duration_min: Number(document.getElementById('srv-duration').value),
      desc_uz: document.getElementById('srv-desc-uz').value.trim(),
      desc_ru: document.getElementById('srv-desc-ru').value.trim(),
      popular: document.getElementById('srv-popular').checked
    };

    try {
      const url = id ? `/api/admin/services/${id}` : '/api/admin/services';
      const method = id ? 'PUT' : 'POST';
      const res = await adminFetch(url, { method, body: JSON.stringify(body) });
      if (res.success) {
        document.getElementById('service-modal').classList.add('hidden');
        loadServices();
      }
    } catch (err) {
      alert("Xizmatni saqlashda xatolik!");
    }
  });

  window.editService = function(id) {
    const s = cachedServices.find(item => item.id === id);
    if (!s) return;
    document.getElementById('service-edit-id').value = s.id;
    document.getElementById('srv-category').value = s.category;
    document.getElementById('srv-name-uz').value = s.name_uz;
    document.getElementById('srv-name-ru').value = s.name_ru;
    document.getElementById('srv-price').value = s.price;
    document.getElementById('srv-duration').value = s.duration_min;
    document.getElementById('srv-desc_uz').value = s.desc_uz || '';
    document.getElementById('srv-desc_ru').value = s.desc_ru || '';
    document.getElementById('srv-popular').checked = !!s.popular;
    document.getElementById('service-modal-title').textContent = "Xizmatni tahrirlash";
    document.getElementById('service-modal').classList.remove('hidden');
  };

  window.deleteService = async function(id) {
    if (!confirm("Xizmatni o'chirmoqchimisiz?")) return;
    try {
      const res = await adminFetch(`/api/admin/services/${id}`, { method: 'DELETE' });
      if (res.success) loadServices();
    } catch (err) {
      alert("O'chirishda xatolik!");
    }
  };

  // --- Masters Management ---
  async function loadMasters() {
    try {
      const data = await adminFetch('/api/admin/masters');
      if (data.success) {
        cachedMasters = data.masters;
        renderAdminMasters(cachedMasters);
      }
    } catch (err) {
      console.error('Masters error:', err);
    }
  }

  function renderAdminMasters(masters) {
    const list = document.getElementById('admin-masters-list');
    list.innerHTML = masters.map(m => `
      <div class="glass-card overflow-hidden">
        <img src="${m.photo}" class="w-full h-44 object-cover" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400'" />
        <div class="p-4">
          <h4 class="font-bold text-white text-base">${m.name}</h4>
          <p class="text-xs text-pink-400 font-semibold mb-1">${m.specialty_uz}</p>
          <div class="text-xs text-zinc-400 mb-3">${m.experience_uz} • ⭐ ${m.rating}</div>
          <button onclick="deleteMaster('${m.id}')" class="w-full py-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-lg transition">
            O'chirish
          </button>
        </div>
      </div>
    `).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  window.deleteMaster = async function(id) {
    if (!confirm("Ustani o'chirmoqchimisiz?")) return;
    try {
      const res = await adminFetch(`/api/admin/masters/${id}`, { method: 'DELETE' });
      if (res.success) loadMasters();
    } catch (err) {
      alert("O'chirishda xatolik!");
    }
  };

  // --- Settings & Telegram ---
  async function loadSettings() {
    try {
      const data = await adminFetch('/api/admin/settings');
      if (data.success) {
        const s = data.settings;
        document.getElementById('setting-bot-token').value = s.telegram_bot_token || '';
        document.getElementById('setting-chat-id').value = s.telegram_chat_id || '';
        document.getElementById('setting-bot-enabled').checked = s.telegram_notifications_enabled !== false;

        document.getElementById('setting-phone-1').value = s.phone_primary || '';
        document.getElementById('setting-phone-2').value = s.phone_secondary || '';
        document.getElementById('setting-address-uz').value = s.address_uz || '';
        document.getElementById('setting-address-ru').value = s.address_ru || '';
        document.getElementById('setting-hours-uz').value = s.working_hours_uz || '';
        document.getElementById('setting-hours-ru').value = s.working_hours_ru || '';

        document.getElementById('setting-admin-user').value = s.admin_username || 'admin';
      }
    } catch (err) {
      console.error('Settings load error:', err);
    }
  }

  // Save Telegram Settings
  document.getElementById('telegram-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = document.getElementById('setting-bot-token').value.trim();
    const chatId = document.getElementById('setting-chat-id').value.trim();
    const enabled = document.getElementById('setting-bot-enabled').checked;

    const botId = token.split(':')[0];
    if (chatId === botId) {
      alert(`DIQQAT: Siz kiritgan Chat ID (${chatId}) bu botning o'z ID raqami!\n\nBot o'z-o'ziga xabar yubora olmaydi. Chat ID ga o'zingizning shaxsiy Telegram ID raqamingizni yozing yoki 'Chat ID ni avtomatik aniqlash' tugmasidan foydalaning.`);
      return;
    }

    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify({
          telegram_bot_token: token,
          telegram_chat_id: chatId,
          telegram_notifications_enabled: enabled
        })
      });
      if (res.success) {
        alert("Telegram sozlamalari muvaffaqiyatli saqlandi!");
      }
    } catch (err) {
      alert("Sozlamalarni saqlashda xatolik!");
    }
  });

  // Auto-detect Telegram Chat ID
  const autoDetectBtn = document.getElementById('auto-detect-chat-btn');
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener('click', async () => {
      const token = document.getElementById('setting-bot-token').value.trim();
      const statusBox = document.getElementById('test-telegram-status');
      
      if (!token) {
        alert("Avval Bot Tokenni kiriting!");
        return;
      }

      statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-zinc-800 text-zinc-300";
      statusBox.textContent = "Bot yangilanishlari tekshirilmoqda...";
      statusBox.classList.remove('hidden');

      try {
        const res = await adminFetch('/api/admin/auto-detect-chat-id', {
          method: 'POST',
          body: JSON.stringify({ token })
        });

        if (res.success) {
          document.getElementById('setting-chat-id').value = res.chatId;
          statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-emerald-950 text-emerald-300 border border-emerald-800";
          statusBox.innerHTML = `✅ <b>Muvaffaqiyatli!</b> Chat ID aniqlandi: <code>${res.chatId}</code> (${res.name} ${res.username || ''}). Botga test xabari yuborildi!`;
        } else {
          statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-amber-950 text-amber-200 border border-amber-800";
          statusBox.innerHTML = `⚠️ <b>Chat ID topilmadi:</b> ${res.error}<br><br>👉 <b>Nima qilish kerak?</b> Telegramda <a href="https://t.me/WoManbarberbot" target="_blank" class="text-white underline font-bold">@WoManbarberbot</a> ga kiring, <b>/start</b> tugmasini bosing va ushbu tugmani yana bir bor bosing!`;
        }
      } catch (err) {
        statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-300 border border-rose-800";
        statusBox.textContent = "❌ Server yoki tarmoq xatosi";
      }
    });
  }

  // Test Telegram Message
  document.getElementById('test-telegram-btn').addEventListener('click', async () => {
    const token = document.getElementById('setting-bot-token').value.trim();
    const chatId = document.getElementById('setting-chat-id').value.trim();
    const statusBox = document.getElementById('test-telegram-status');

    statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-zinc-800 text-zinc-300";
    statusBox.textContent = "Telegram botga test xabari yuborilmoqda...";
    statusBox.classList.remove('hidden');

    try {
      const res = await adminFetch('/api/admin/test-telegram', {
        method: 'POST',
        body: JSON.stringify({ token, chatId })
      });

      if (res.success) {
        statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-emerald-950 text-emerald-300 border border-emerald-800";
        statusBox.textContent = "✅ " + res.message;
      } else {
        statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-300 border border-rose-800";
        statusBox.textContent = "❌ Xatolik: " + (res.error || "Ulanib bo'lmadi");
      }
    } catch (err) {
      statusBox.className = "text-xs p-3 rounded-xl mt-3 bg-rose-950 text-rose-300 border border-rose-800";
      statusBox.textContent = "❌ Server yoki tarmoq xatosi";
    }
  });

  // Save Studio Settings
  document.getElementById('studio-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const body = {
      phone_primary: document.getElementById('setting-phone-1').value.trim(),
      phone_secondary: document.getElementById('setting-phone-2').value.trim(),
      address_uz: document.getElementById('setting-address-uz').value.trim(),
      address_ru: document.getElementById('setting-address-ru').value.trim(),
      working_hours_uz: document.getElementById('setting-hours-uz').value.trim(),
      working_hours_ru: document.getElementById('setting-hours-ru').value.trim()
    };

    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (res.success) {
        alert("Studiya ma'lumotlari yangilandi!");
      }
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  });

  // Save Password
  document.getElementById('password-settings-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const user = document.getElementById('setting-admin-user').value.trim();
    const pass = document.getElementById('setting-admin-pass').value.trim();

    if (!user) {
      alert("Login bo'sh bo'lishi mumkin emas!");
      return;
    }

    const body = { admin_username: user };
    if (pass) body.admin_password = pass;

    try {
      const res = await adminFetch('/api/admin/settings', {
        method: 'POST',
        body: JSON.stringify(body)
      });
      if (res.success) {
        alert("Login va parol muvaffaqiyatli yangilandi!");
        document.getElementById('setting-admin-pass').value = '';
      }
    } catch (err) {
      alert("Xatolik yuz berdi!");
    }
  });

  function debounce(fn, ms) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), ms);
    };
  }
});
