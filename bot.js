import { PrismaClient } from '@prisma/client';
import { Telegraf } from 'telegraf';

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN); // Make sure to store your bot token in .env

// Start Command: Register or fetch user from the database
bot.start(async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const username = ctx.from.username;

  if (!username) {
    return ctx.reply('Please set a Telegram username to play.');
  }

  try {
    let user = await prisma.user.findUnique({
      where: { telegramId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          telegramId,
          username,
        },
      });
      ctx.reply(`Welcome, ${username}! You’re now registered.`);
    } else {
      ctx.reply(`Welcome back, ${username}!`);
    }
  } catch (error) {
    console.error('Error during user registration:', error);
    ctx.reply('Failed to register. Try again later.');
  }
});

// Mining action: Increment user's Pink Star Diamonds
bot.command('mine', async (ctx) => {
  const telegramId = ctx.from.id.toString();

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (user) {
      const diamondsMined = Math.floor(Math.random() * 10) + 1;

      await prisma.user.update({
        where: { telegramId },
        data: {
          diamonds: user.diamonds + diamondsMined,
          gameHistory: {
            create: {
              action: 'mine',
              amount: diamondsMined,
            },
          },
        },
      });

      ctx.reply(`You mined ${diamondsMined} Pink Star Diamonds!`);
    } else {
      ctx.reply('You are not registered. Use /start to register.');
    }
  } catch (error) {
    console.error('Error during mining:', error);
    ctx.reply('Mining failed.');
  }
});

// Sell action: Convert Pink Star Diamonds into Coins
bot.command('sell', async (ctx) => {
  const telegramId = ctx.from.id.toString();

  try {
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (user && user.diamonds > 0) {
      const coinsEarned = user.diamonds * 100;

      await prisma.user.update({
        where: { telegramId },
        data: {
          diamonds: 0,
          coins: user.coins + coinsEarned,
          gameHistory: {
            create: {
              action: 'sell',
              amount: coinsEarned,
            },
          },
        },
      });

      ctx.reply(`You sold ${user.diamonds} Pink Star Diamonds for ${coinsEarned} coins.`);
    } else {
      ctx.reply('You have no diamonds to sell.');
    }
  } catch (error) {
    console.error('Error during selling:', error);
    ctx.reply('Selling failed.');
  }
});

// Referral tracking: Set who referred whom
bot.command('referral', async (ctx) => {
  const telegramId = ctx.from.id.toString();
  const referrerUsername = ctx.message.text.split(' ')[1];  // Get referrer username from the command argument

  if (!referrerUsername) {
    return ctx.reply('Please provide the username of the person who referred you.');
  }

  try {
    const referrer = await prisma.user.findUnique({
      where: { username: referrerUsername },
    });
    const user = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (referrer && user && !user.referrerId) {
      await prisma.user.update({
        where: { telegramId },
        data: {
          referrerId: referrer.id,
        },
      });

      ctx.reply(`${referrerUsername} referred you!`);
    } else if (!referrer) {
      ctx.reply('Referrer not found.');
    } else {
      ctx.reply('You already have a referrer.');
    }
  } catch (error) {
    console.error('Error during referral setup:', error);
    ctx.reply('Failed to set referral.');
  }
});

// Launch the bot
bot.launch().then(() => {
  console.log('Telegram bot is running...');
});
