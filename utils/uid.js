export function generateUID() {
  const chars = '0123456789ABC';
  let uid = '';
  for (let i = 0; i < 7; i++) {
    uid += chars[Math.floor(Math.random() * chars.length)];
  }
  return uid;
}
