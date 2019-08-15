const express = require('express');

const usersRouter = require('./users/userRouter.js');

const server = express();

server.use(express.json());

server.use(logger);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  const messageOfTheDay = process.env.MOTD || "Catch 'em all";
  res.send(`<h2>Let's write some middleware! ${messageOfTheDay}</h2>`)
});

//custom middleware

function logger(req, res, next) {
  const timestamp = new Date().toLocaleString();
  console.log(`A ${req.method} request at '${req.url}' at ${timestamp}`);
  next();
};

module.exports = server;
