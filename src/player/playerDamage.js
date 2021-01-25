const playerDamage = (room, player) => {
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

module.exports = playerDamage;
