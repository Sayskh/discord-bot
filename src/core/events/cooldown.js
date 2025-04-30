const ms = require("ms");
const cooldowns = new Map();

// Fungsi untuk memeriksa apakah user dalam cooldown
function checkCooldown(userId, command) {
  const now = Date.now();
  const cooldownTime = ms(command.cooldown);

  if (isNaN(cooldownTime)) {
    console.error(
      `Invalid cooldown value for command ${command.name}: ${command.cooldown}`
    );
    return false;
  }

  if (!cooldowns.has(userId)) {
    cooldowns.set(userId, new Map());
  }

  const timestamps = cooldowns.get(userId);

  if (timestamps.has(command.name)) {
    const expirationTime = timestamps.get(command.name) + cooldownTime;
    if (now < expirationTime) {
      return true;
    }
  }

  timestamps.set(command.name, now);
  return false;
}

// Fungsi untuk mengambil sisa waktu cooldown
function getRemainingCooldown(userId, command) {
  const now = Date.now();
  const cooldownTime = ms(command.cooldown);

  if (!cooldowns.has(userId)) return 0;

  const timestamps = cooldowns.get(userId);
  if (!timestamps.has(command.name)) return 0;

  const expirationTime = timestamps.get(command.name) + cooldownTime;
  const timeLeft = expirationTime - now;

  return timeLeft > 0 ? timeLeft : 0;
}

module.exports = { checkCooldown, getRemainingCooldown };
