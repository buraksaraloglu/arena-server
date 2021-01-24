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

module.exports = playerMove;
