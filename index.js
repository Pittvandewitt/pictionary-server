// Server
const { app, io } = require('./server');

// Database
const db = require('./db');
const User = require('./models/userModel');
db.sync()
    .then(() => {
        console.log('Database connected and synced')
    });