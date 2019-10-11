const Sequelize = require('sequelize');
const db = require('../db');

const Lobby = db.define('rooms', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    // members: {
    //   type: Sequelize.INTEGER
    // }
    // ToDo: Introduce room member count
});

module.exports = Lobby;