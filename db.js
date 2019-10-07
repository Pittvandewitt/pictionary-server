const Sequelize = require('sequelize');
const databaseURL = process.env.DATABASE_URL || 'postgres://postgres:secret@localhost:5435/postgres';
const db = new Sequelize(databaseURL);

module.exports = db;