// Server
const { app, io } = require('./server');

// Database
const db = require('./db');
db.sync()
    .then(() => {
        console.log('Database connected and synced')
    });