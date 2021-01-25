/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const { GRID_SIZE } = require('../constants');
const { playerMove, reduceStamina, handleDamage } = require('../player/playerMove');
const foodCheck = require('../helpers/foodCheck');
const newFood = require('./newFood');
const getUpdatedVelocity = require('../helpers/getUpdatedVelocity');

const createGameState = () => ({
  players: [],
  gameStatus: 'waiting',
  voteCount: 0,
  appleCount: 0,
  food: {},
  gridSize: GRID_SIZE,
});

const aliveCount = (players) => {
  const alivePlayers = [];

  players.map((player) => {
    if (player.alive) {
      alivePlayers.push(player);
    }
  });

  return alivePlayers;
};

const gameLoop = (state) => {
  if (!state) {
    return;
  }

  state.players.map((player) => {
    if (player.alive) {
      playerMove(player);
      foodCheck(player, state, newFood);
    }

    if (player.stats.health <= 0) {
      state.players[player.id - 1].alive = false;
    }
  });

  const alivePlayers = aliveCount(state.players);

  if (alivePlayers.length === 1) {
    return alivePlayers[0];
  }

  return false;
};

const initGame = () => {
  const state = createGameState();
  newFood(state);
  return state;
};

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};
