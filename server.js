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

// const rooms = {};         // object om de open kamer te bewaren, key is de kamer naam, value is true
// const roomsArray = [];
const roomUsers = [];
// const roomUsers = { ID: "", users: [] };



// room path
app.get("/:room", (req, res) => {
  const roomName = req.query.room;
  res.render("room", { roomID: roomName });
});

io.on("connection", (socket) => {
  console.log("connected");

  socket.on('checkRoom', (roomname) => {
    // const openRoomName = openRoom.roomname;
    console.log("openRoomName", roomname);

    let roomIndex = roomUsers.findIndex(room => room.ID === roomname);

    for (const [index, room] of Object.entries(roomUsers)) {
      if (room.ID === roomname) {
        roomIndex = index;
        break;
      }
    }

    // let roomIndex = -1;

    if (roomIndex === -1) {
      // Als het kamer-ID niet werd gevonden, voeg dan een nieuw object toe aan de array
      roomUsers.push({ ID: roomname, users: [] });

      console.log("roomUsers 1:", roomUsers);

      io.emit('checkRoom', { roomname, roomUsers, log: "1" });
    } else {
      console.log("roomUsers 2:", roomUsers);

      io.emit('checkRoom2', { roomname, roomUsers, log: "2" });
    }
  })

  // Join room script.js
  socket.on('joinRoom', (data) => {
    socket.join(data.room);
    socket.room = data.room;

    const Room = data.room;
    const roomUser = data.user;

    let roomIndex = roomUsers.findIndex(room => room.ID === Room);

    if (roomIndex !== -1) {
      // Voeg de nieuwe gebruiker toe aan de users array in het gevonden object
      if (!roomUsers[roomIndex].users.includes(roomUser)) {
        roomUsers[roomIndex].users.push(roomUser);
      }
    }
    else {
      // Als het kamer-ID niet werd gevonden, voeg dan een nieuw object toe aan de array
      roomUsers.push({ ID: Room, users: [roomUser] });
    }

    io.emit('joinRoom', { Room, roomUser, roomUsers });
  });

  socket.on('roomAdmin', (currentRoom) => {
    console.log("roomAdmin", currentRoom.roomID);

    const room = roomUsers.find(room => room.ID === currentRoom.roomID);
    if (room) {
      console.log("86 LOL", room); // Geeft een array terug met de gebruikers van de kamer
      io.emit('roomAdmin', room)
    } else {
      console.log("Kamer niet gevonden");
    }

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

  socket.on('streamLink', (data) => {
    const link = data.link;
    const roomID = data.roomID;
    console.log("link", data);
    io.emit('streamLink', { link, roomID });
  })

  socket.on('startStream', (data) => {
    console.log("startStream",data);
    io.emit('startStream', data);
  })

  socket.on('stopStream', (data) => {
    io.emit('stopStream', data);
  })


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
