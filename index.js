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
db.sync({ force: true })
    .then(async () => {
        await User.create({
            email: "test@test.com",
            username: "Lazlo",
            password: bcrypt.hashSync("123456", 10)
        })
        console.log('Database connected and synced')
    });

// Routes
const authRouter = require('./routers/authRouter');
app.use(authRouter);