const { log } = require('console')
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

let roomUsers = [];
const historySize = 50;
let roomHistory = [];

// room path
app.get("/:room", (req, res) => {
  const roomName = req.query.room;
  res.render("room", { roomID: roomName });
});

io.on("connection", (socket) => {
  console.log("connected");

  let client;
  let clientRoom;

  if (socket.connected) {
    console.log("Lela");
    io.emit('connected');
    console.log("__", client, clientRoom);
    socket.emit('userConnected')
  }


  socket.on('checkRoom', (roomname) => {
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
  socket.on('nameCheck', (data) => {
    console.log("nameCheck:", data);
    const client = data.clientName
    const roomId = data.roomID;

    const roomData = roomUsers.find(room => room.ID === roomId);
    if (roomData) {
      const currentRoomUsers = roomData.users
      // console.log("roomData.users",room_users);
      //   console.log("roomData",roomData);
      socket.emit('nameCheck', { client, roomId, currentRoomUsers });
    } else {
      socket.emit('nameCheck', { client, roomId });
      console.log('ID niet gevonden in de array');
    }
  })

  socket.on('joinRoom', (data) => {
    socket.join(data.room);
    socket.room = data.room;

    clientRoom = data.room;
    client = data.user;

    const Room = data.room;
    const roomUser = data.user;

    let roomIndex = roomUsers.findIndex(room => room.ID === Room);

    if (roomIndex !== -1) {
      // Add the new user to the users array in the found object
      if (!roomUsers[roomIndex].users.includes(roomUser)) {
        roomUsers[roomIndex].users.push(roomUser);
      }
    }
    else {
      // If the room ID was not found, add a new object to the array
      roomUsers.push({ ID: Room, users: [roomUser] });
    }

    io.emit('joinRoom', { Room, roomUser, roomUsers });

    socket.emit('chatHistory', roomHistory);
    console.log("rooms DATA:", roomUsers);
  });


  socket.on("chatmessage", (chat) => {
    const room = chat.room;
    const message = chat.message;
    const username = chat.username;
    const avatar = chat.avatar
    const time = chat.time
    console.log("chat message |", time);

    // send the message to all sockets in the room
    io.emit("chatmessage", { username, message, room, avatar, time });


    // Zoek de index van de kamer in de roomHistory array
    const roomIndex = roomHistory.findIndex((item) => item.roomID === room);

    if (roomIndex !== -1) {
      // Kamer bestaat al, voeg het bericht toe aan de bestaande kamer
      roomHistory[roomIndex].messages.push({ username, message, avatar, time });
    } else {
      // Kamer bestaat nog niet, voeg een nieuw kamerobject toe aan roomHistory
      roomHistory.push({
        roomID: room,
        messages: [{ username, message, avatar, time }],
      });
    }

    // Optioneel: beperk de grootte van de geschiedenis per kamer
    const roomMessages = roomHistory.find((item) => item.roomID === room).messages;
    if (roomMessages.length > historySize) {
      roomMessages.shift(); // Verwijder het oudste bericht
    }
    console.log("roomHistory:", roomHistory);
  });

  socket.on('roomAdmin', (data) => {
    console.log("roomAdmin", data.roomID);

    const room = roomUsers.find(room => room.ID === data.roomID);
    if (room) {
      // console.log("86 LOL", room); // Geeft een array terug met de gebruikers van de kamer
      io.emit('roomAdmin', {data,room})
    } else {
      console.log("Kamer niet gevonden");
    }

  })

  socket.on('gifmessage', (message) => {
    console.log("Hi:", message)

    const room = message.room;
    const gifMessage = message.gifUrl;
    const searchKey = message.searchKey;
    const userName = message.userName;
    const avatar = message.avatar;
    const time = message.time;
    const gifName = message.gifName;

    io.emit("gifmessage", { gifMessage, room, userName, avatar, time, gifName });

    // Zoek de index van de kamer in de roomHistory array
    const roomIndex = roomHistory.findIndex((item) => item.roomID === room);

    if (roomIndex !== -1) {
      // Kamer bestaat al, voeg het bericht toe aan de bestaande kamer
      roomHistory[roomIndex].messages.push({ userName, gifMessage, avatar, time, gifName });
    } else {
      // Kamer bestaat nog niet, voeg een nieuw kamerobject toe aan roomHistory
      roomHistory.push({
        roomID: room,
        messages: [{ userName, gifMessage, avatar, time, gifName }],
      });
    }

    // Optioneel: beperk de grootte van de geschiedenis per kamer
    const roomMessages = roomHistory.find((item) => item.roomID === room).messages;
    if (roomMessages.length > historySize) {
      roomMessages.shift(); // Verwijder het oudste bericht
    }
    console.log("roomHistory:", roomHistory);
  });

  socket.on('streamLink', (data) => {
    const link = data.link;
    const roomID = data.roomID;
    console.log("link", data);
    socket.broadcast.emit('streamLink', { link, roomID });
  })

  socket.on('startStream', (roomID) => {
    console.log("startStream", roomID);
    io.emit('startStream', roomID);
  })

  socket.on('stopStream', (data) => {
    io.emit('stopStream', data);
  })

  socket.on("disconnect", () => {
    console.log("user disconnected", client, clientRoom);
    if (client && clientRoom) {
      const roomIndex = roomUsers.findIndex(room => room.ID == clientRoom);
      const userIndex = roomUsers[roomIndex].users.findIndex(user => user == client);
      console.log("disconnect", roomUsers)

      roomUsers[roomIndex].users.splice(userIndex, 1);
      if (roomUsers[roomIndex].users.length == 0) {
        roomUsers.splice(roomIndex, 1);
        console.log(clientRoom, "closed")
      }

      console.log("disconnect 2", roomUsers);
      io.emit('notconnected', { userName: client, roomID: clientRoom, users: roomUsers })
      socket.emit('connected')
    }

  });

  socket.on("focus", (data) => {
    socket.broadcast.emit("focus", data);
  });

});

http.listen(port, () => {
  console.log("listening on port:", port);
});
