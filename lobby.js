const { app, io } = require('./server');

console.log(io);

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('userLogin', (username) => {
    console.log('User logged in:', username)
    socket.username = username;
    // console.log('Socket data:', socket)
    socket.room = 'room1';
    socket.join('room1');
    socket.emit('updateChat', 
      { 
        sender: 'Server',
        body: 'You connected to room 1'
      }
    );
    socket.broadcast.to('room1')
      .emit('updateChat', 
        {
          sender: 'Server',
          body: `${username} has connected to this room`
        }
      );
    console.log('Users in room:', io.nsps['/'].adapter.rooms['room1'].length)
  });

  socket.on('disconnect', () => {
    socket.broadcast.to(socket.room)
      .emit('updateChat', `${socket.username} has disconnected`);
    
      if(io.nsps['/'].adapter.rooms['room1']) {
      console.log('Users in room:', io.nsps['/'].adapter.rooms['room1'].length)
    }
  })

  socket.on('newChatMessage', (data) => {
    io.in('room1').emit('updateChat', data)
    console.log('New chat message:', data)
  });

  socket.on('drawing', (data) => {
    // console.log('drawing:', data);
    socket.to('room1').emit('syncDrawing', data);
  })
  socket.on('clearDrawing', (data) => {
    socket.to('room1').emit('resetCanvas', {item: null, start: null, x: null, y:null})
  })
})