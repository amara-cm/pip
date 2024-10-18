const { Telegraf } = require('telegraf');
const fetch = require('node-fetch');

const bot = new Telegraf('7611734053:AAGnOEPnXrJkdEhTGEdNQi7OqAdZWeuWHls');

bot.start((ctx) => {
  const username = ctx.from.username;

  fetch('https://pinkstone.vercel.app/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  })
    .then((response) => response.json())
    .then((data) => {
      ctx.reply(`Welcome, ${data.username}! Your account has been created.`);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
      ctx.reply('Failed to create an account. Please add a username to continue.');
    });
});

bot.launch();
