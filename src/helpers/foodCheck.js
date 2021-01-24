/* eslint-disable no-param-reassign */
const foodCheck = (player, state, randomFood) => {
  if (state.food.x === player.pos.x && state.food.y === player.pos.y) {
    state.appleCount += 1;
    player.stats.power += 10;
    state.food = {
      x: -8,
      y: -8,
    };
    randomFood(state);
  }
};

module.exports = foodCheck;
