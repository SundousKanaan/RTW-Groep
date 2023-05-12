# Real time web
During this course we will learn how to build a real-time application. We will learn techniques to setup an open connection between the client and the server. This will enable us to send data in real-time both ways, at the same time.

## 👁️ Demo Link! 👁️
 
* live demo door [railway.app](https://rtw-groep-production.up.railway.app/)
<!-- * live demo door [aptable.io](https://streamy-chan.adaptable.app) -->

---

## 💻 Participants 💻 
* Sundous Kanaan

---

## 🖊 Concept 🖊
Streamy-Chan is an app where the users can open their own room and chat with their friends and watch something on youtube or websites by forming a link.

---

## 📖 Job Story 📖
As a social media user, I want to connect with my faraway friends and family through a secure chatting app, so that I can easily communicate with them and watch videos or listen to music while chatting together.

---

- [Real time web](#real-time-web)
  - [👁️ Demo Link! 👁️](#️-demo-link-️)
  - [💻 Participants 💻](#-participants-)
  - [🖊 Concept 🖊](#-concept-)
  - [📖 Job Story 📖](#-job-story-)
  - [💻 Intallation Guide 💻](#-intallation-guide-)
    - [Install nvm](#install-nvm)
    - [Clone repo](#clone-repo)
    - [NPM install](#npm-install)
    - [Start server](#start-server)
  - [🛠️ Features Combined 🛠️](#️-features-combined-️)
  - [💾 Used Technologies 💾](#-used-technologies-)
  - [Process](#process)
    - [Getting started with socket.io](#getting-started-with-socketio)
  - [Process](#process-1)
  - [](#)
  - [Server Side Code](#server-side-code)
    - [Breakdown of the code:](#breakdown-of-the-code)
  - [Client Side Code](#client-side-code)
    - [Breakdown of the code:](#breakdown-of-the-code-1)
  - [Prototype](#prototype)
    - [Log in page](#log-in-page)
    - [Chat area](#chat-area)
  - [Sources](#sources)


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
* Make your own room for your group ✅
* Users can chat together online ✅
* See who joined the room ✅
* See who left the room
* Can see if someone is typing ✅
* Can choose a username and which gets displayed with each message ✅
* Can choose a avatar foto (from standard list) ✅
* Find GIFs and send them to everyone in the chat ✅
* watch or listen to somthing together online via youtube video link

---

## 💾 Used Technologies 💾
* EJS templating engine
* Express
* Socket.io
* [Gfycat’s API](https://developers.gfycat.com/api/#updating-gfycats) 🔗

---

## Process
### Getting started with socket.io
<details>

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

7. To see connections and disconnections add this code to your server.js
```js 
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

``` 

</details>

---

## Process

<details>


</details>


<details>
</details>
---

## Server Side Code
```js
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const port = process.env.PORT || 4242

app.set('views', 'views');
app.set('view engine', 'ejs');
app.use(express.static("public"))

// home page
app.get('/', async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        res.status(500).send(error.message);
    }
})

// We passen het server script aan om een console bericht te loggen zodra 
// er een gebruiker verbinding maakt met via socket.io, dat zie je aan het connection event.
io.on('connection', (socket) => {
    console.log('connected');

    socket.on('chat message', (chat) => {
        // console.log(`${username}: ${message}`);
        io.emit('chat message', chat); // broadcast the message to all clients
      });

    // Als een gebruiker connectie maakt zie je de log message die we ingesteld hebben, 
    // misschien willen we ook zien wanneer een gebruiker disconnect.
    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('focus', (hasFocus) => {
        socket.broadcast.emit('focus', hasFocus);
      });
});

app.get('/', (request, response) => {
    //   response.send('<h1>Hallo wereld! LOL</h1>')
    response.render('index')
})

http.listen(port, () => {
    console.log('listening on port:', port)
})
```

### Breakdown of the code:

* const express = require('express'): Imports the Express framework.
* const app = express(): Creates a new instance of the Express application.
* const http = require('http').createServer(app): Creates an HTTP server instance with the Express application.
* const io = require('socket.io')(http): Initializes a Socket.io instance using the HTTP server.
* const port = process.env.PORT || 4242: Sets the port number for the server to listen to, using the environment variable PORT or the default port 4242.
* app.set('views', 'views');: Sets the folder for the views (HTML templates).
* app.set('view engine', 'ejs');: Sets the view engine to EJS (Embedded JavaScript).
* app.use(express.static("public")): Specifies that the server should serve static files from the "public" folder.
* app.get('/', async (req, res) => { ... }): Handles GET requests to the root URL of the server. This route renders the "index" template using EJS.
* io.on('connection', (socket) => { ... }): Handles socket connections. This event listener logs a "connected" message when a new user connects, broadcasts chat messages to all connected clients, and logs a "user disconnected" message when a user disconnects.
* app.get('/', (request, response) => { ... }): Handles another GET request to the root URL of the server. * This route renders the "index" template using EJS.
* http.listen(port, () => { ... }): Starts the server listening on the specified port.

Overall, this code sets up a basic server with Socket.io integration to allow real-time communication between clients. It also uses the Express framework and EJS templating engine to serve static files and render HTML templates.

--- 

## Client Side Code
```js
const messages = document.querySelector('section ul');

const input = document.querySelector('#message-input');
const sendMessage = document.querySelector('#message-button');
const usernameInput = document.querySelector('#username-input');
const loggin= document.querySelector('main section:first-of-type')
const chatScreen= document.querySelector('main section:last-of-type')
const logginButton = document.querySelector('main section:first-of-type > button')

chatScreen.classList.add("hidden");

// // Annuleer the enter event on the input
usernameInput.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      sendMessage.click();
    }
});

logginButton.addEventListener('click' , () => {
    loggin.classList.add("hidden");
    chatScreen.classList.remove("hidden");
    socket.emit('focus', true); // Verzend de focus class naar andere clients
});

input.addEventListener('input', () => {
    const inputValue = input.value;
    // Doe hier iets met de waarde van het invoerveld
    console.log(inputValue);
    chatScreen.classList.add('focus');
    socket.emit('focus', true); // Verzend de focus class naar andere clients
});

sendMessage.addEventListener('click', (event) => {
    chatScreen.classList.remove('focus')
    socket.emit('focus', false); // Verzend de focus class naar andere clients

    event.preventDefault();
    if (input.value) {

        const chat ={
            username: usernameInput.value,
            message: input.value
        }

        socket.emit('chat message', chat);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    console.log('chat message: ', msg.message);
    console.log(chatScreen);

    const element = document.createElement('li');
    element.textContent = ` ${msg.username}: ${msg.message} `;
    messages.appendChild(element);
    messages.scrollTop = messages.scrollHeight;

    if (msg.username === usernameInput.value) {
        element.classList.add('message');
    }
});

socket.on('focus', (hasFocus) => {
    if (hasFocus) {
        chatScreen.classList.add('focus');
    } else {
        chatScreen.classList.remove('focus');
    }
});
```

### Breakdown of the code:
* const messages = document.querySelector('section ul'); selects the <ul> element that contains the chat messages.
* const input = document.querySelector('#message-input'); selects the <input> element where the user types their message.
* const sendMessage = document.querySelector('#message-button'); selects the button that sends the message to the chat.
* const usernameInput = document.querySelector('#username-input'); selects the <input> element where the user types their username.
* const loggin= document.querySelector('main section:first-of-type') selects the first <section> element inside the <main> element, which contains the login form.
* const chatScreen= document.querySelector('main section:last-of-type') selects the last <section> element inside the <main> element, which contains the chat screen.
* const logginButton = document.querySelector('main section:first-of-type > button') selects the button inside the login form that submits the form.
* chatScreen.classList.add("hidden"); hides the chat screen when the page is first loaded.
* usernameInput.addEventListener('keydown', (event) => {...}) listens for the 'keydown' event on the username input field. If the user presses the Enter key, the event is prevented and the send message button is clicked.
* logginButton.addEventListener('click' , () => {...}) listens for the 'click' event on the login button. When the button is clicked, the login form is hidden and the chat screen is shown. A socket.io event is emitted to inform other clients that this client has focused on the chat.
* input.addEventListener('input', () => {...}) listens for the 'input' event on the message input field. * * When the user types something in the field, the chat screen is given the 'focus' class, and a socket.io event is emitted to inform other clients that this client has focused on the chat.
* sendMessage.addEventListener('click', (event) => {...}) listens for the 'click' event on the send message button. When the button is clicked, the chat screen loses the 'focus' class, a socket.io event is emitted to inform other clients that this client has unfocused from the chat, and the message is sent to the server via a socket.io event.
* socket.on('chat message', (msg) => {...}) listens for the 'chat message' event emitted by the server when a new message is received. The message is added to the <ul> element containing the chat messages, and the element is scrolled to the bottom.
* socket.on('focus', (hasFocus) => {...}) listens for the 'focus' event emitted by the server when a client focuses or unfocuses from the chat. The chat screen is given or loses the 'focus' class accordingly.

---

## Prototype
### Log in page
![proto](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/prototype.png)

### Chat area
![proto](https://github.com/SundousKanaan/RTW-Groep/blob/hilal/readme-images/prototype-1.png)




## Sources
* https://www.npmjs.com/package/nodemon 
* https://fonts.adobe.com/fonts/interstate 
* https://www.git-tower.com/learn/git/faq/git-pull-origin-master
* https://adaptable.io/ 
* https://railway.app/ 
* https://socket.io/get-started/chat/ 

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
