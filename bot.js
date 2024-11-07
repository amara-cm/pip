import { Telegraf } from 'telegraf';
import supabase from './lib/supabase';  // Assuming you've set up Supabase client correctly

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.telegram.setWebhook('https://pinkstar.vercel.app/api/webhook');  // Your webhook URL

// Start command handler
bot.start(async (ctx) => {
  const { id, username, first_name } = ctx.from;

  // Store or update user data in Supabase
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert({
        telegram_uid: id,          // Use Telegram UID
        username,
        first_name,
      });

    if (error) {
      throw error;
    }

    // Send the welcome message back to the user
    await ctx.reply(
      '⭐️Hello, ' + (username || 'Pinx') + '! Welcome to @Pinx! Your main task is to mine Pink Star Diamonds, sell, and earn ⭐️coins. Start now!', 
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

// Set your bot's webhook handler (you can leave this in webhook.js)
bot.launch();

// Ensure proper graceful shutdown (this is good practice for long-running bots)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
