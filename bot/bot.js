import supabase from '../lib/db'; // Ensure the path is correct
import { Telegraf, Markup } from 'telegraf';

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

      ctx.reply(`Welcome, ${username}! You’re now registered.`, Markup.inlineKeyboard([
        Markup.button.url('Play the Game', 'https://your-game-url.com')
      ]));
    } else {
      ctx.reply(`Welcome back, ${username}!`, Markup.inlineKeyboard([
        Markup.button.url('Play the Game', 'https://your-game-url.com')
      ]));
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
