const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const port = process.env.PORT || 4444

app.set("views", "views");
app.set("view engine", "ejs");
app.use(express.static("public"));



// home page
app.get("/", async (req, res) => {
  try {
    res.render("index");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const rooms = {};
const usersarray = [];


// room
app.get("/:room", (req, res) => {
  const roomName = req.query.room;
  res.render("room", { roomID: roomName });
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on('checkRoom', (openRoom) => {
    console.log("AAD", openRoom);

    const openRoomName = openRoom.roomname;
    const roomsArray = openRoom.openRoom

    console.log("checkRoom", roomsArray);
    io.emit('checkRoom', {openRoomName, roomsArray});
  })

  // Join room
  socket.on('addRoom', (data) => {
    socket.join(data.room);
    socket.room = data.room;

    const Room = data.room;
    const roomUser = data.user;
    const roomUsers = data.roomUsers

    if (!rooms[Room]) {
      rooms[Room] = { users: [] };
    }
    rooms[Room].users.push(roomUser);
    console.log("Room DATA:", Room, rooms[Room]);

    io.emit('addRoom', { Room: Room, users: rooms[Room].users, roomUsers });
  });

  socket.on('addAdmin', (Admin) => {
    const currentRoom = rooms[socket.room];
    const currentAdmin = Admin;

    console.log("AAA", Admin);

    if (socket.username === currentAdmin) {
      console.log(`${currentAdmin} is performing admin actions in room ${currentRoom}`);

    } else {
      console.log(`${currentAdmin} is not the admin of room ${currentRoom}`);
      // perform non-admin actions
    }

    io.emit('addAdmin', currentAdmin)
  })

  socket.on("chatmessage", (chat) => {
    const room = chat.room;
    const message = chat.message;
    const username = chat.username;
    console.log("chat message |", `[${room}] ${username}: ${message}`);

    // send the message to all sockets in the room
    io.emit("chatmessage", { username, message, room });
  });

  socket.on('gifmessage', (message) => {
    console.log("Hi:", message)

    const room = message.room;
    const gifMessage = message.gifUrl;
    const searchKey = message.searchKey;
    const userName = message.userName;

    io.emit("gifmessage", { gifMessage, room, userName, searchKey });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("focus", (hasFocus) => {
    socket.broadcast.emit("focus", hasFocus);
  });

});

http.listen(port, () => {
  console.log("listening on port:", port);
});
