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

module.exports = getUpdatedVelocity;
