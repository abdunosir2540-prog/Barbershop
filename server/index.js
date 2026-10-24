require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db');
const TelegramService = require('./telegram');

const app = express();
const PORT = process.env.PORT || 3000;

// Simple admin session management
const ADMIN_TOKEN = "woman_admin_secret_key_" + (process.env.ADMIN_SECRET || "2026_beauty_barber");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware for Admin authentication
function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(401).json({ success: false, error: "Avtorizatsiyadan o'tilmagan yoki token xato" });
  }
  next();
}

// -------------------------------------------------------------
// PUBLIC API ROUTES
// -------------------------------------------------------------

// 1. Get all public data for the landing page
app.get('/api/public-data', (req, res) => {
  try {
    const settings = db.getSettings();
    const services = db.getServices();
    const masters = db.getMasters();
    const reviews = db.getReviews();
    const gallery = db.getGallery();

    // Strip sensitive fields
    const publicSettings = {
      salon_name: settings.salon_name,
      salon_subtitle_uz: settings.salon_subtitle_uz,
      salon_subtitle_ru: settings.salon_subtitle_ru,
      phone_primary: settings.phone_primary,
      phone_secondary: settings.phone_secondary,
      address_uz: settings.address_uz,
      address_ru: settings.address_ru,
      working_hours_uz: settings.working_hours_uz,
      working_hours_ru: settings.working_hours_ru,
      instagram_url: settings.instagram_url,
      telegram_url: settings.telegram_url,
      banner_image: settings.banner_image
    };

    res.json({
      success: true,
      data: {
        settings: publicSettings,
        services,
        masters,
        reviews,
        gallery
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Submit booking application (Ariza qoldirish)
app.post('/api/bookings', async (req, res) => {
  try {
    const { client_name, client_phone, service_id, master_id, date, time, notes } = req.body;

    if (!client_name || !client_phone || !date || !time) {
      return res.status(400).json({
        success: false,
        error: "Ism, telefon raqami, sana va vaqt kiritilishi shart!"
      });
    }

    // Lookup service & master details
    let service_name_uz = "Klassik xizmat";
    let service_name_ru = "Классическая услуга";
    let service_price = 0;

    if (service_id) {
      const srv = db.getServiceById(service_id);
      if (srv) {
        service_name_uz = srv.name_uz;
        service_name_ru = srv.name_ru;
        service_price = srv.price;
      }
    }

    let master_name = "Ixtiyoriy bo'sh usta";
    if (master_id) {
      const mst = db.getMasterById(master_id);
      if (mst) {
        master_name = mst.name;
      }
    }

    const booking = db.createBooking({
      client_name: client_name.trim(),
      client_phone: client_phone.trim(),
      service_id,
      service_name_uz,
      service_name_ru,
      service_price,
      master_id,
      master_name,
      date,
      time,
      notes: notes ? notes.trim() : ''
    });

    // Check Telegram notifications
    const settings = db.getSettings();
    let telegramResult = { sent: false, info: 'Telegram sozlanmagan' };

    if (settings.telegram_notifications_enabled && settings.telegram_bot_token && settings.telegram_chat_id) {
      const tgMsg = TelegramService.formatBookingMessage(booking);
      const tgRes = await TelegramService.sendMessage(settings.telegram_bot_token, settings.telegram_chat_id, tgMsg);
      if (tgRes.success) {
        db.updateBookingStatus(booking.id, null, 'sent');
        telegramResult = { sent: true, info: "Telegramga xabar yuborildi" };
      } else {
        db.updateBookingStatus(booking.id, null, 'failed');
        telegramResult = { sent: false, info: tgRes.error };
      }
    } else {
      db.updateBookingStatus(booking.id, null, 'not_configured');
    }

    res.json({
      success: true,
      message: "Arizangiz muvaffaqiyatli qabul qilindi!",
      booking,
      telegram: telegramResult
    });
  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN API ROUTES
// -------------------------------------------------------------

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const settings = db.getSettings();

  if (username === settings.admin_username && password === settings.admin_password) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: { username: settings.admin_username }
    });
  }

  res.status(401).json({
    success: false,
    error: "Login yoki parol noto'g'ri!"
  });
});

// Admin stats
app.get('/api/admin/stats', requireAdmin, (req, res) => {
  try {
    const stats = db.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin bookings list
app.get('/api/admin/bookings', requireAdmin, (req, res) => {
  try {
    let bookings = db.getBookings();
    const { status, search, date } = req.query;

    if (status && status !== 'all') {
      bookings = bookings.filter(b => b.status === status);
    }
    if (date) {
      bookings = bookings.filter(b => b.date === date);
    }
    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(b => 
        (b.client_name && b.client_name.toLowerCase().includes(q)) ||
        (b.client_phone && b.client_phone.toLowerCase().includes(q)) ||
        (b.id && b.id.toLowerCase().includes(q))
      );
    }

    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update booking status
app.patch('/api/admin/bookings/:id/status', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, error: "Noto'g'ri status" });
    }

    const updated = db.updateBookingStatus(id, status);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Ariza topilmadi" });
    }

    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete booking
app.delete('/api/admin/bookings/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    db.deleteBooking(id);
    res.json({ success: true, message: "Ariza o'chirildi" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Services CRUD
app.get('/api/admin/services', requireAdmin, (req, res) => {
  res.json({ success: true, services: db.getServices() });
});

app.post('/api/admin/services', requireAdmin, (req, res) => {
  try {
    const service = db.addService(req.body);
    res.json({ success: true, service });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/services/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateService(req.params.id, req.body);
    res.json({ success: true, service: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/services/:id', requireAdmin, (req, res) => {
  try {
    db.deleteService(req.params.id);
    res.json({ success: true, message: "Xizmat o'chirildi" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Masters CRUD
app.get('/api/admin/masters', requireAdmin, (req, res) => {
  res.json({ success: true, masters: db.getMasters() });
});

app.post('/api/admin/masters', requireAdmin, (req, res) => {
  try {
    const master = db.addMaster(req.body);
    res.json({ success: true, master });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/admin/masters/:id', requireAdmin, (req, res) => {
  try {
    const updated = db.updateMaster(req.params.id, req.body);
    res.json({ success: true, master: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/admin/masters/:id', requireAdmin, (req, res) => {
  try {
    db.deleteMaster(req.params.id);
    res.json({ success: true, message: "Usta o'chirildi" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Admin Settings
app.get('/api/admin/settings', requireAdmin, (req, res) => {
  const settings = db.getSettings();
  res.json({ success: true, settings });
});

app.post('/api/admin/settings', requireAdmin, (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Test Telegram Bot integration
app.post('/api/admin/test-telegram', requireAdmin, async (req, res) => {
  try {
    const { token, chatId } = req.body;
    const settings = db.getSettings();
    const botToken = token || settings.telegram_bot_token;
    const chat = chatId || settings.telegram_chat_id;

    if (!botToken || !chat) {
      return res.status(400).json({
        success: false,
        error: "Bot Token va Chat ID to'ldirilishi shart!"
      });
    }

    const testResult = await TelegramService.sendTestMessage(botToken, chat);
    if (testResult.success) {
      res.json({ success: true, message: "Telegram botga test xabari muvaffaqiyatli yetkazildi!" });
    } else {
      res.status(400).json({ success: false, error: testResult.error });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Auto-detect Telegram Chat ID from /start command
app.post('/api/admin/auto-detect-chat-id', requireAdmin, async (req, res) => {
  try {
    const { token } = req.body;
    const settings = db.getSettings();
    const botToken = token || settings.telegram_bot_token;

    if (!botToken) {
      return res.status(400).json({ success: false, error: "Bot token kiritilmagan!" });
    }

    const detected = await TelegramService.getRecentChatId(botToken);
    if (detected.success) {
      // Auto-save the valid Chat ID
      db.updateSettings({ telegram_chat_id: detected.chatId });
      // Send a confirmation test message immediately
      await TelegramService.sendTestMessage(botToken, detected.chatId);

      return res.json({
        success: true,
        chatId: detected.chatId,
        name: detected.name,
        username: detected.username,
        message: `Muvaffaqiyatli! Sizning Chat ID raqamingiz topildi (${detected.chatId}) va saqlandi! Botga tasdiqlovchi test xabari yuborildi.`
      });
    } else {
      return res.status(400).json({ success: false, error: detected.error });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route for admin panel page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'admin', 'index.html'));
});

// Fallback to client landing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`=================================================`);
  console.log(`💈 WO & MAN Beauty Studio & Barbershop Server`);
  console.log(`🚀 Sayt manzili: http://localhost:${PORT}`);
  console.log(`🔐 Admin Panel:  http://localhost:${PORT}/admin`);
  console.log(`=================================================`);
});
