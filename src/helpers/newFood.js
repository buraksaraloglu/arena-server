/* eslint-disable no-param-reassign */
const { GRID_SIZE } = require('../constants');

const timeToNewApple = () => {
  let appleTime = 15;

  const timer = setInterval(() => {
    appleTime ? appleTime-- : clearInterval(timer);
  }, 1000);
};

const newFood = (state) => {
  if (state.appleCount > 0) {
    timeToNewApple();
    setTimeout(() => {
      const food = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };

      state.food = food;
    }, 15000);
  } else {
    state.food = {
      x: GRID_SIZE / 2 - Math.round(Math.random()),
      y: GRID_SIZE / 2 - Math.round(Math.random()),
    };
  }
};

module.exports = newFood;
