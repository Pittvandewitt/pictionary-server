const { app, io } = require('./server');

console.log(io);

const words = ["letter", "person", "pen", "police", "people", "water", "breakfast", "boy",
  "girl", "line", "air",
  "land", "hand", "house", "picture", "animal", "mother", "father",
  "head", "plant", "food", "sun", "eye", "city", "tree",
  "sea", "north", "south", "east",
  "west", "child",  "music", "car",
  "feet", "book", "fish",
  "mountain", "horse", "watch", "bird",
  "fart", "ship", 
  "rock", "fire",  "airplane",  "king",
  "space", "whale", "unicorn", "Grumpy cat", "feather", "pigeon"
];

function newWord() {
	wordcount = Math.floor(Math.random() * (words.length));
	return words[wordcount];
};

let wordToGuess;

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('userLogin', (username) => {
    socket.username = username;
    console.log('User logged in as:', socket.username)

    // console.log('Socket data:', socket)
    // socket.room = 'room1';
    // socket.join('room1');
    // socket.emit('updateChat', 
    //   { 
    //     sender: 'Server',
    //     body: 'You connected to room 1'
    //   }
    // );
    // socket.broadcast.to('room1')
    //   .emit('updateChat', 
    //     {
    //       sender: 'Server',
    //       body: `${username} has connected to this room`
    //     }
    //   );

    // if(io.nsps['/'].adapter.rooms['room1']) {
    //   if (io.nsps['/'].adapter.rooms['room1'].length < 2) {
    //     socket.emit('drawer', true)
    //   }
    //   console.log('Users in room:', io.nsps['/'].adapter.rooms['room1'].length)
    // }
    // console.log('Users in room:', io.nsps['/'].adapter.rooms['room1'].length)
  });

  // User is joining a room
  socket.on('joinRoom', (roomName) => {
    // The client joined a room
    socket.room = roomName;
    socket.join(roomName);
    console.log(socket.username, 'joined room:', socket.room);

    // See how many clients are joined te room
    const playersInRoom = io.nsps['/'].adapter.rooms[roomName].length;
    console.log('Users in room:', playersInRoom)

    // If client is the first one to enter, he will be the drawer
    if (playersInRoom <= 1) {
      socket.emit('newDrawer', true)
      wordToGuess = newWord();
      socket.emit('word', `The word to draw is: ${wordToGuess}`);
    }

    // Let room know that user joined room
    socket.broadcast.to(roomName).emit('updateChat', {
            sender: 'Server',
            body: `${socket.username} joined room ${socket.room}`
          }
    )

    // socket.to(roomName).emit('updateClientRedux',
    //   {
    //     room: roomName,
    //     username: socket.username,
    //     drawer: playersInRoom <= 1 ? true : false,
    //     status: playersInRoom > 1 ? "Ready" : "Waiting"
    //   }
    // );
    if (playersInRoom > 1) {
      // Already players in the room
      // Copy their Redux state
      socket.on('currentRoomState', (data) => {
        socket.emit('setRedux', data)
      })
    } else {
      // First player in the room
      socket.emit('updateClientRedux',
        {
          room: roomName,
          username: socket.username,
          drawer: playersInRoom <= 1 ? true : false,
          status: playersInRoom > 1 ? "Ready" : "Waiting"
        });
    }
  })

  socket.on('disconnect', () => {
    console.log('USER DISCONNECTED')
    socket.emit('updateChat', 'LOGGED OUT DUE INACTIVITY')
    socket.broadcast.to(socket.room)
      .emit('updateChat', `${socket.username} has disconnected`);

    if (io.nsps['/'].adapter.rooms['room1']) {
      console.log('Users in room:', io.nsps['/'].adapter.rooms['room1'].length)
    }
  })

  // New chat message
  // Compare message with answer
  socket.on('newChatMessage', (data) => {
    io.in(data.roomName).emit('updateChat', {sender: data.sender, body: data.body})
    if (data.body.toUpperCase() === wordToGuess.toUpperCase()) {
      // Let everybody know that the the answer is guessed
      io.in(data.roomName).emit('updateChat', {sender: 'Server', body: `${socket.username} guessed the right answer: ${wordToGuess}`})
      // Set drawer false to everybody
      io.in(data.roomName).emit('newDrawer', false)
      // Set good guesser as new drawer
      socket.emit('newDrawer', true)
      // Let everybody know who the new drawer is
      io.in(data.roomName).emit('updateChat', {sender: 'Server', body: `${socket.username} is the new drawer`})

      // Set new word
      wordToGuess = newWord();
      // Let new drawer know what to draw
      socket.emit('word', `The word to draw is: ${wordToGuess}`);
      // Let other players know who is the drawer
      socket.to(socket.room).emit('word', `${socket.username} is the drawer`);
      socket.emit('word', `The word to draw is: ${wordToGuess}`);
      // Reset all drawing boards
      io.in(socket.room).emit('clearCanvas', 'clear canvas');
    }
  });

  socket.on('drawing', (data) => {
    // console.log('drawing:', data);
    socket.to(socket.room).emit('syncDrawing', data);
  })
  // socket.on('clearDrawing', (data) => {
  //   socket.to('room1').emit('resetCanvas', {item: null, start: null, x: null, y:null})
  // })
})