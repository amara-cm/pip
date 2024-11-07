import { Telegraf } from 'telegraf';
import supabase from '../../lib/supabase';  // Import your Supabase client

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Handle "/start" command
bot.start(async (ctx) => {
  const { id, username, first_name } = ctx.from;

  // Attempt to retrieve the referrer ID (if applicable)
  const referrer_id = ctx.referrer ? ctx.referrer.id : null;

  // Store or update user data in Supabase
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert([
        {
          telegram_uid: id,  // Store the Telegram user ID
          username,
          first_name,
          referred_by: referrer_id || null,  // Store the referrer if it exists
        },
      ]);

    if (error) {
      console.error('Error saving/updating user data in Supabase:', error);
      ctx.reply('An error occurred while saving your data.');
    } else {
      ctx.reply(`Welcome ${first_name || username}! Your data has been stored successfully.`);
    }
  } catch (error) {
    console.error('Error processing data in Supabase:', error);
    ctx.reply('An error occurred while saving your data.');
  }
});

// Start the bot
bot.launch();
