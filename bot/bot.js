import supabase from '../lib/db'; // Ensure the path is correct
import { Telegraf, Markup } from 'telegraf';
import fetch from 'node-fetch'; // Ensure you have node-fetch installed

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Make sure to store your bot token in .env

// Start Command: Register or fetch user from the database and reply with a button
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username;

  if (!username) {
    return ctx.reply('Please set a Telegram username to play.');
  }

  try {
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('telegramId', telegramId)
      .single();

    if (error) throw error;

    if (!user) {
      const { error: createUserError } = await supabase
        .from('User')
        .insert({ telegramId, username });

      if (createUserError) throw createUserError;
    }

    // Send POST request to /api/telegram
    const response = await fetch('https://pinkstar.vercel.app/api/telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: telegramId,
        action: 'menu_tap'
      })
    });

    const result = await response.json();

    if (response.ok) {
      ctx.reply(`Welcome, ${username}!`, Markup.inlineKeyboard([
        Markup.button.url('Play the Game', result.autoLoginLink)
      ]));
    } else {
      console.error('Error from /api/telegram:', result);
      ctx.reply('Failed to generate auto-login link. Try again later.');
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    ctx.reply('Failed to register. Try again later.');
  }
});

// Launch the bot
bot.launch().then(() => {
  console.log('Telegram bot is running...');
});
