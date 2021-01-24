const { GRID_SIZE } = require('../constants');

const calculatePosition = (id) => {
  if (id === 1) {
    return { x: 1, y: 1 };
  } else if (id === 2) {
    return {
      x: GRID_SIZE - 2,
      y: GRID_SIZE - 2,
    };
  } else if (id === 3) {
    return {
      x: 1,
      y: GRID_SIZE - 2,
    };
  } else if (id === 4) {
    return {
      x: GRID_SIZE - 2,
      y: 1,
    };
  } else return null;
};

const newPlayer = (id, username) => {
  const playerPosition = calculatePosition(id);

  return {
    id: id,
    username: username,
    pos: playerPosition,
    vel: {
      x: 0,
      y: 0,
    },
    stats: {
      health: 100,
      stamina: 100,
      power: 0,
    },
  };
};

module.exports = newPlayer;
