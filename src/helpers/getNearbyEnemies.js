const getNearbyEnemies = (room, player) => {
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

module.exports = getNearbyEnemies;
