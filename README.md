# Chat.App
During this course we will learn how to build a real-time application. We will learn techniques to setup an open connection between the client and the server. This will enable us to send data in real-time both ways, at the same time.

## 👁️ Demo Link! 👁️
rtw-groep-production.up.railway.app

---

## 💻 Participants 💻 
* Sundous Kanaan
* Hilal Tapan

---

## 🖊 Concept 🖊
Chat.app is an environment where users can chat with each other. It is a project based on the course real time web course from the minor web, University of Amsterdam.

---

## 📖 Job Story 📖
As a social media user, I want to connect with my friends and family through a secure chatting app, so that I can easily communicate with them.

---

## 💻 Intallation Guide 💻
### Install nvm
1. To install the server you need node and express. You can do that with nvm. Nvm is package installer where you can install different packages. With this code you can install the latest versions of npm and node in your terminal:
```
nvm install 19.8.1
```

### Clone repo
2. Clone this repository by running:
```
git clone https://github.com/SundousKanaan/RTW-Groep.git
```

### NPM install
3. Install the dependencies by running:
```
npm install 
```

### Start server 
Run the following code to start the server: 
```
node app.js
```

---

## 🛠️ Features Combined 🛠️
* Users can chat together online
* Can see if someone is typing
* Can choose a username and which gets displayed with each message

---

## 💾 Used Technologies 💾
* EJS templating engine
* Node.js
* Express
* Socket.io

---

## Process
### Getting started with socket.io
1. The first goal is to set up a simple HTML webpage that serves out a form and a list of messages. We’re going to use the Node.JS web framework express to this end. Make sure Node.JS is installed.

```
npm install express@4
```

2. Once it's installed we can create an index.js file that will set up our application.
```js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
```

3. Integrate socket.io 
```
npm install socket.io
```

4. That will install the module and add the dependency to package.json. Now let’s edit index.js to add it:
```js
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
```

5. Add a script tag in your index.ejs file for.
```html
<script src="/socket.io/socket.io.js"></script>
```

6. To see connections and disconnections add this code to your server.js
```js 
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
``` 

7. Make it so that when the user types in a message, the server gets it as a chat message event. The client side js file should now look like this:
```js
  var socket = io();

  var form = document.getElementById('form');
  var input = document.getElementById('input');

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat message', input.value);
      input.value = '';
    }
  });
```

And in the server side js we now add the following code:
```js
io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
```

---

### Trying to display a username
One of our features is that the user can choose a username and this gets displayed with each message.

#### Attempt 1
![attempt1](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten.png)

#### Attempt 2
![attempt2](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-2.png)

#### Attempt 3
![attempt3](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-3.png)

#### Attempt 4
![attempt4](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-4.png)

--- 

### Is typing feature
![is-typing](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-5.png)

---

### Different colors for each user
![colors](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-6.png)

---

### Position of each user
![location](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/samen-chatten-7.png)

---

## Sources
* https://www.npmjs.com/package/nodemon 
* https://fonts.adobe.com/fonts/interstate 
* https://www.git-tower.com/learn/git/faq/git-pull-origin-master
* https://adaptable.io/ 
* https://railway.app/ 


<!-- Here are some hints for your projects Readme.md! -->

<!-- Start out with a title and a description -->

<!-- Add a nice image here at the end of the week, showing off your shiny frontend 📸 -->

<!-- Add a link to your live demo in Github Pages 🌐-->

<!-- replace the code in the /docs folder with your own, so you can showcase your work with GitHub Pages 🌍 -->

<!-- Maybe a table of contents here? 📚 -->

<!-- ☝️ replace this description with a description of your own work -->

<!-- How about a section that describes how to install this project? 🤓 -->

<!-- ...but how does one use this project? What are its features 🤔 -->

<!-- What external data source is featured in your project and what are its properties 🌠 -->

<!-- This would be a good place for your data life cycle ♻️-->

<!-- Maybe a checklist of done stuff and stuff still on your wishlist? ✅ -->

<!-- We all stand on the shoulders of giants, please link all the sources you used in to create this project. -->

<!-- How about a license here? When in doubt use MIT. 📜  -->


<!-- SSSSS -->
