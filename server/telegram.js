// Telegram Bot integration service
const https = require('https');

class TelegramService {
  /**
   * Send a message to Telegram using Bot API
   * @param {string} token - Bot Token from @BotFather
   * @param {string} chatId - Target chat/channel ID
   * @param {string} text - Message text (HTML formatted)
   * @returns {Promise<{success: boolean, error?: string, response?: any}>}
   */
  static async sendMessage(token, chatId, text) {
    if (!token || !chatId) {
      return { success: false, error: 'Telegram Bot Token yoki Chat ID kiritilmagan' };
    }

    const cleanToken = token.trim();
    const cleanChatId = chatId.trim();
    const botId = cleanToken.split(':')[0];

    // Check if user accidentally entered the bot's own ID
    if (cleanChatId === botId) {
      return {
        success: false,
        error: `Siz Chat ID sifatida botning o'z ID raqamini (${botId}) kiritgansiz! Bot o'z-o'ziga xabar yubora olmaydi. Chat ID ga o'zingizning shaxsiy Telegram ID raqamingizni kiriting (@userinfobot orqali olish mumkin) yoki 'Avtomatik aniqlash' tugmasidan foydalaning.`
      };
    }

    const payload = JSON.stringify({
      chat_id: cleanChatId,
      text: text,
      parse_mode: 'HTML',
      disable_web_page_preview: true
    });

    const url = `https://api.telegram.org/bot${cleanToken}/sendMessage`;

    return new Promise((resolve) => {
      try {
        const req = https.request(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout: 10000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              const json = JSON.parse(data);
              if (json.ok) {
                resolve({ success: true, response: json.result });
              } else {
                let errorMsg = json.description || 'Telegram API xatoligi';
                if (errorMsg.includes("bot can't send messages to the bot")) {
                  errorMsg = "Bot o'z-o'ziga xabar yubora olmaydi. Shaxsiy Chat ID raqamingizni kiriting!";
                } else if (errorMsg.includes("chat not found")) {
                  errorMsg = "Chat topilmadi. Avval botga kirib /start tugmasini bosing!";
                } else if (errorMsg.includes("bot was blocked by the user")) {
                  errorMsg = "Bot foydalanuvchi tomonidan bloklangan. Botni ochib /start bosing.";
                }
                resolve({ success: false, error: errorMsg });
              }
            } catch (e) {
              resolve({ success: false, error: 'Telegram javobini o\'qishda xatolik: ' + e.message });
            }
          });
        });

        req.on('error', (err) => {
          resolve({ success: false, error: 'Tarmoq xatosi: ' + err.message });
        });

        req.on('timeout', () => {
          req.destroy();
          resolve({ success: false, error: 'Telegram serveriga ulanish vaqti tugadi (timeout)' });
        });

        req.write(payload);
        req.end();
      } catch (err) {
        resolve({ success: false, error: err.message });
      }
    });
  }

  /**
   * Auto-detect chat ID from recent bot updates
   * @param {string} token 
   * @returns {Promise<{success: boolean, chatId?: string, name?: string, username?: string, error?: string}>}
   */
  static async getRecentChatId(token) {
    if (!token) return { success: false, error: "Bot Token kiritilmagan" };
    const cleanToken = token.trim();
    const url = `https://api.telegram.org/bot${cleanToken}/getUpdates`;

    return new Promise((resolve) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (!json.ok) {
              return resolve({ success: false, error: json.description || "Bot token noto'g'ri" });
            }

            const updates = json.result || [];
            if (updates.length === 0) {
              return resolve({
                success: false,
                error: "Botga hali hech kim xabar yozmagan yoki /start bosmagan. Iltimos, Telegramda botingizga (@WoManbarberbot) kiring va /start tugmasini bosing, so'ng qayta urinib ko'ring."
              });
            }

            // Find latest message with a valid chat
            for (let i = updates.length - 1; i >= 0; i--) {
              const u = updates[i];
              const msg = u.message || u.edited_message || u.channel_post || u.my_chat_member;
              if (msg && msg.chat) {
                const chatId = String(msg.chat.id);
                const from = msg.from || msg.chat;
                const name = from.first_name ? `${from.first_name} ${from.last_name || ''}`.trim() : msg.chat.title || 'Mijoz';
                const username = from.username ? `@${from.username}` : '';
                return resolve({
                  success: true,
                  chatId: chatId,
                  name: name,
                  username: username
                });
              }
            }

            resolve({ success: false, error: "Chat ID aniqlanmadi. Botga /start bosing." });
          } catch (e) {
            resolve({ success: false, error: e.message });
          }
        }).on('error', (err) => {
          resolve({ success: false, error: err.message });
        });
      });
    });
  }

  /**
   * Format a booking notification message
   * @param {Object} booking 
   * @returns {string}
   */
  static formatBookingMessage(booking) {
    const formattedPrice = Number(booking.service_price || 0).toLocaleString('uz-UZ');
    const createdDate = new Date(booking.created_at || Date.now()).toLocaleString('uz-UZ', { 
      timeZone: 'Asia/Tashkent',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });

    return `🔥 <b>YANGI ARIZA / НОВАЯ ЗАПИСЬ!</b>
━━━━━━━━━━━━━━━━━━━━
💈 <b>WO & MAN — Студия Красоты & Barbershop</b>
━━━━━━━━━━━━━━━━━━━━
🆔 <b>Ariza raqami:</b> <code>#${booking.id}</code>
👤 <b>Mijoz:</b> <b>${escapeHtml(booking.client_name)}</b>
📞 <b>Telefon:</b> <a href="tel:${booking.client_phone}">${booking.client_phone}</a>
✂️ <b>Xizmat:</b> ${escapeHtml(booking.service_name_uz || booking.service_name_ru || 'Tanlanmagan')}
💵 <b>Narx:</b> <b>${formattedPrice} so'm</b>
💈 <b>Tanlangan usta:</b> ${escapeHtml(booking.master_name || 'Ixtiyoriy bo\'sh usta')}
📅 <b>Kuni:</b> <b>${booking.date}</b>
⏰ <b>Vaqti:</b> <b>${booking.time}</b>
💬 <b>Qo'shimcha izoh:</b> ${booking.notes ? escapeHtml(booking.notes) : '<i>Izoh yo\'q</i>'}
━━━━━━━━━━━━━━━━━━━━
🕒 <i>Ariza tushgan vaqt: ${createdDate}</i>
⚡️ <i>Mijoz bilan zudlik bilan bog'laning!</i>`;
  }

  /**
   * Test message to verify Telegram Bot configuration
   * @param {string} token 
   * @param {string} chatId 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async sendTestMessage(token, chatId) {
    const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent' });
    const text = `🎉 <b>WO & MAN — Telegram Bot muvaffaqiyatli ulandi!</b>
━━━━━━━━━━━━━━━━━━━━
✅ Bot sozlamalari to'g'ri ishlamoqda.
💈 Endi saytdan tushgan barcha yangi arizalar ushbu chatga zudlik bilan yetib keladi!
🕒 <i>Sana va vaqt: ${time}</i>`;

    return await this.sendMessage(token, chatId, text);
  }
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

module.exports = TelegramService;
