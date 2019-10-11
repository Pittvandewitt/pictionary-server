// Server
const { app, io } = require('./server');

// Middleware
const cors = require('cors');
const corsMiddleware = cors();
const bodyParser = require('body-parser').json();
app.use(corsMiddleware, bodyParser);

// Database
const db = require('./db');
const bcrypt = require('bcrypt');
const User = require('./models/userModel');
const Lobby = require('./models/lobbyModel');
db.sync({ force: true })
  .then(async () => {
    await User.create({
      email: "test@test.com",
      username: "Lazlo",
      password: bcrypt.hashSync("123456", 10)
    })
    await Lobby.create({
      name: 'DevRoom',
      members: 0
    })
    console.log('Database connected and synced')
  });

// Routes
const authRouter = require('./routers/authRouter');
const lobbyRouter = require('./routers/lobbyRouter')
app.use(authRouter);
app.use(lobbyRouter);