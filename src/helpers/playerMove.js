/* eslint-disable no-param-reassign */
const { GRID_SIZE } = require('../constants');

const playerMove = (player) => {
  player.pos.x += player.vel.x;
  player.pos.y += player.vel.y;

  if (player.pos.x < 0) {
    player.pos.x = GRID_SIZE - 1;
  } else if (player.pos.y < 0) {
    player.pos.y = GRID_SIZE - 1;
  } else if (player.pos.x > GRID_SIZE - 1) {
    player.pos.x = 0;
  } else if (player.pos.y > GRID_SIZE - 1) {
    player.pos.y = 0;
  }
};

let cooldowns = {};

const reduceStamina = (player) => {
  const playerStats = player.stats;
  if (playerStats.stamina > 0) {
    playerStats.stamina -= 10;
  }

  if (playerStats.stamina < 40 && playerStats.stamina !== 0) {
    playerStats.health -= 5;
  } else if (playerStats.stamina === 0) {
    playerStats.health -= 10;
  }

  if (!cooldowns[player.id]) {
    cooldowns[player.id] = { time: 10 };
    const timer = setInterval(() => {
      if (cooldowns[player.id].time === 0) {
        playerStats.stamina = 100;
        delete cooldowns[player.id];
        clearTimeout(timer);
      } else {
        cooldowns[player.id].time -= 1;
      }
    }, 1000);
  }
};

const enemyNearby = (room, player) => {
  return room.players.filter((targetPlayer) => {
    if (targetPlayer.id !== player.id) {
      for (let i = -2; i <= 2; i++) {
        for (let j = -2; j <= 2; j++) {
          if (player.pos.x - targetPlayer.pos.x === i && player.pos.y - targetPlayer.pos.y === j) {
            return targetPlayer;
          }
        }
      }
    }
  });
};

const handleDamage = (room, player) => {
  const target = enemyNearby(room, player);
  console.log(target);
  if (target) {
    target.map((targetPlayer) => {
      if (targetPlayer.stats.health > 5 && player.stats.stamina >= 30) {
        targetPlayer.stats.health -= player.stats.power || 5;
      } else if (player.stats.stamina && player.stats.stamina < 30) {
        targetPlayer.stats.health -= 5;
      } else {
        targetPlayer.stats.health = 0;
      }
    });
  }
};

module.exports = { playerMove, reduceStamina, handleDamage };
