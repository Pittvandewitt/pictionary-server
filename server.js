const express = require('express');
const app = express();
const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Server up and running on port ${port}`));
const socketIo = require('socket.io');
const io = socketIo(server);

module.exports = {app, io}

