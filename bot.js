import { Telegraf } from 'telegraf';
import supabase from './lib/supabase';  // Ensure you have a Supabase client setup

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.telegram.setWebhook('https://pinkstar.vercel.app/api/webhook');  // Your actual webhook URL

// Start command handler
bot.start(async (ctx) => {
  const { id: telegram_uid, username, first_name } = ctx.from;
  const referred_by = ctx.message.text.split(' ')[1] || null;  // Capture referral ID from the start command if available (e.g., `/start 123456789`)

  try {
    // Store or update user data in the Supabase `users` table
    const { data, error } = await supabase
      .from('users')
      .upsert({
        telegram_uid,           // Use Telegram UID
        username,               // Username from Telegram
        first_name,             // First name from Telegram
        referred_by: referred_by ? parseInt(referred_by) : null  // Referred by (if provided)
      }, { onConflict: ['telegram_uid'] });  // Ensure it updates on conflict based on `telegram_uid`

    if (error) {
      throw error;
    }

    // Send a welcome message back to the user
    await ctx.reply(
      `⭐️Hello, ${(username || 'Pinx')}! Welcome to @Pinx! Your main task is to mine Pink Star Diamonds, sell, and earn ⭐️coins. Start now!`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              { text: 'Play', url: 'https://t.me/pinxhousebot/app' },
              { text: 'Website', url: 'https://t.me/pinxhousebot/app' },
            ],
          ],
        },
      }
    );
  } catch (error) {
    console.error('Error storing/updating user data in Supabase:', error);
  }
});

// Set your bot's webhook handler
bot.launch();

// Graceful shutdown for the bot (good practice)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
