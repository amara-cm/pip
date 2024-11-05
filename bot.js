bot.start((ctx) => {
ctx.reply('⭐️Hello, ' + ctx.from.username + '! Welcome to @Major! Your main task is to become the coolest Major by making simple tasks (inviting another Majors, sending gifts etc) and getting ⭐️Stars. ⭐️Good Luck!', {
reply_markup: {
inline_keyboard: [
[
{ text: 'Play', url: 'https://t.me/pinxhousebot/app' },
{ text: 'Website', url: 'https://t.me/pinxhousebot/app' },
],
],
},
});
});
