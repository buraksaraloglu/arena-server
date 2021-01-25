/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
const corsOptions = {
  allowUpgrades: true,
  transports: ['polling', 'websocket'],
  pingTimeout: 9000,
  pingInterval: 3000,
  cookie: 'mycookie',
  httpCompression: true,
  origins: '*:*',
};
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, corsOptions);

const { initGame, gameLoop, getUpdatedVelocity, handleAttack } = require('./game');
const { FRAME_RATE } = require('./constants');
const { makeId } = require('./utils');
const newPlayer = require('./helpers/newPlayer');

const state = {};
const clientRooms = {};

const getClientCount = (roomName) => {
  const room = io.sockets.adapter.rooms.get(roomName);

  let allUsers;
  if (room) {
    allUsers = room;
  }
  if (allUsers) {
    return allUsers.size;
  }
  return 0;
};

const emitGameState = (room, singleGameState) => {
  const numClients = getClientCount(room);
  io.sockets.in(room).emit('gameState', JSON.stringify(singleGameState));
  io.sockets.in(room).emit('numClients', numClients);

  if (!numClients) {
    delete state[room];
  }
};

const emitGameOver = (room, winner) => {
  io.sockets.in(room).emit('gameOver', JSON.stringify({ winner }));
};

const startGameInterval = (roomName) => {
  state[roomName].gameStatus = 'started';
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName]);

    if (!winner) {
      emitGameState(roomName, state[roomName]);
    } else {
      emitGameOver(roomName, winner);
      state[roomName] = null;
      clearInterval(intervalId);
    }
  }, 1000 / FRAME_RATE);
};

io.on('connection', (client) => {
  const handleKeyDown = (keyCode) => {
    const roomName = clientRooms[client.id];
    if (!roomName) {
      return;
    }

    let clientKeyCode;
    try {
      clientKeyCode = parseInt(keyCode, 10);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return;
    }
    let velocity;
    if (keyCode === 32) {
      handleAttack(state[roomName], client);
    } else {
      velocity = getUpdatedVelocity(clientKeyCode);
    }

    if (velocity) {
      state[roomName].players[client.number - 1].vel = velocity;
    }
  };

  const handleNewGame = (username) => {
    const roomName = makeId(5);
    clientRooms[client.id] = roomName;
    client.emit('gameCode', roomName);

    state[roomName] = initGame();

    client.join(roomName);
    client.number = 1;

    state[roomName].players.push(newPlayer(client.number, username));

    client.emit('init', 1);
    client.emit('numClients', 1);
    client.emit('voteCount', 0);
    emitGameState(roomName, state[roomName]);
    client.emit('gameStatus', state[roomName].gameStatus);
  };

  const handleJoinGame = (roomName, username) => {
    const numClients = getClientCount(roomName);

    if (numClients === 0) {
      client.emit('unknownCode');
      return;
    }
    if (numClients > 4) {
      client.emit('tooManyPlayers');
      return;
    }

    if (state[roomName].gameStatus !== 'started') {
      clientRooms[client.id] = roomName;

      client.join(roomName);
      client.number = numClients + 1;

      state[roomName].players.push(newPlayer(client.number, username));

      client.emit('gameCode', roomName);
      client.emit('init', client.number);
      client.emit('joined', true);
      io.sockets.in(roomName).emit('numClients', numClients + 1);
      io.sockets.in(roomName).emit('voteCount', state[roomName].voteCount);
      emitGameState(roomName, state[roomName]);
    } else {
      client.emit('joined', false);
    }
  };

  const handleStartVote = (roomName) => {
    const numClients = getClientCount(roomName);
    state[roomName].voteCount += 1;

    if (state[roomName].voteCount === numClients && numClients >= 2) {
      let timer = 3;
      const countdown = setInterval(() => {
        if (timer > 0) {
          io.sockets.in(roomName).emit('gameStatus', timer);
          timer -= 1;
        } else {
          clearInterval(countdown);
          startGameInterval(roomName);
          io.sockets.in(roomName).emit('gameStatus', state[roomName].gameStatus);
        }
      }, 1000);
    }
    io.sockets.in(roomName).emit('voteCount', state[roomName].voteCount);
  };

  client.on('keydown', handleKeyDown);
  client.on('newGame', handleNewGame);
  client.on('joinGame', handleJoinGame);
  client.on('startVote', handleStartVote);
});

const port = process.env.PORT || 8080;
io.listen(port);
