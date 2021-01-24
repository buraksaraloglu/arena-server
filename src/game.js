/* eslint-disable array-callback-return */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
const { GRID_SIZE } = require('./constants');
const playerMove = require('./helpers/playerMove');
const foodCheck = require('./helpers/foodCheck');
const newFood = require('./helpers/newFood');

const createGameState = () => ({
  players: [],
  gameStatus: 'waiting',
  voteCount: 0,
  appleCount: 0,
  food: {},
  gridSize: GRID_SIZE,
});

const gameLoop = (state) => {
  if (!state) {
    return;
  }

  const playerOne = state.players[0];
  // const playerTwo = state.players[1];
  // const playerThree = state.players[2];
  // const playerFour = state.players[3];

  state.players.map((player) => {
    playerMove(player);
    foodCheck(player, state, newFood);
  });

  if (playerOne.vel.x || playerOne.vel.y) {
    // winner check
  }

  return false;
};

const initGame = () => {
  const state = createGameState();
  newFood(state);
  return state;
};

const getUpdatedVelocity = (keyCode) => {
  switch (keyCode) {
    case 37:
      // Left
      return { x: -1, y: 0 };
    case 38:
      // Down
      return { x: 0, y: -1 };
    case 39:
      // Right
      return { x: 1, y: 0 };
    case 40:
      // Up
      return { x: 0, y: 1 };

    default:
      break;
  }
};

module.exports = {
  initGame,
  gameLoop,
  getUpdatedVelocity,
};
