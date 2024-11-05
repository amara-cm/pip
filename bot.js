import { Telegraf } from 'telegraf';
import prisma from './path-to-prisma-instance'; // Adjust the path to your Prisma instance

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Start command handler
bot.start(async (ctx) => {
  const { id, username, first_name } = ctx.from;

  // Store or update user data in the database
  try {
    await prisma.user.upsert({
      where: { user_id: String(id) },
      update: { username, first_name },
      create: { user_id: String(id), username, first_name },
    });

    // Send the welcome message back to the user
    await ctx.reply(
      '⭐️Hello, ' + (username || 'Major') + '! Welcome to @Major! Your main task is to become the coolest Major by making simple tasks (inviting other Majors, sending gifts, etc.) and earning ⭐️Stars. ⭐️Good Luck!', 
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
    console.error('Error storing/updating user data:', error);
  }
});

// Set your bot's webhook handler (you can leave this in webhook.js)
bot.launch();

// Ensure proper graceful shutdown (this is good practice for long-running bots)
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
