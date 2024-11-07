import { Telegraf } from 'telegraf';
import supabase from './lib/supabase'; // Make sure this path is correct

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Set webhook for receiving updates
bot.telegram.setWebhook('https://pinkstar.vercel.app/api/webhook');  // Replace with your actual webhook URL

// Handle the /start command (this will catch referral deep link parameters)
bot.start(async (ctx) => {
  const { id: telegram_uid, username, first_name } = ctx.from;

  // Capture the referral UID if provided in the deep link
  const args = ctx.message.text.split(' '); // Get the command arguments
  const referred_by = args.length > 1 ? args[1] : null; // Check if there's a referral UID

  try {
    // Store or update user data in Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({
        telegram_uid, // Use Telegram UID
        username,
        first_name,
        referred_by: referred_by ? parseInt(referred_by, 10) : null, // Save referral UID if it exists
      }, {
        onConflict: ['telegram_uid'], // Update user if they already exist
      });

    if (error) throw error;

    // Send a welcome message back to the user
    await ctx.reply(
      '⭐️ Hello, ' + (username || 'Pinx') + '! Welcome to @Pinx! Your main task is to mine Pink Star Diamonds, sell, and earn ⭐️coins. Start now!', 
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
    
    // Log success
    console.log(`User ${telegram_uid} stored/updated successfully, referred by ${referred_by}.`);
  } catch (error) {
    console.error('Error storing/updating user data:', error);
  }
});

// Set your bot's webhook handler (you can leave this in webhook.js)
bot.launch();

// Ensure proper graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
