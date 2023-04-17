# Real-Time Web @cmda-minor-web 2022 - 2023
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




## Description
During this course you will learn how to build a real-time application. You will learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

## Communication
- [Github](https://github.com/cmda-minor-web/real-time-web-2223)
- [Microsoft Teams](https://teams.microsoft.com/l/channel/19%3a61df853840064eae8ae6fc2dc9fc4566%40thread.tacv2/09%2520Real%2520Time%2520Web?groupId=c8b97eb6-ad53-4531-ad66-5c3c6297951c&tenantId=0907bb1e-21fc-476f-8843-02d09ceb59a7)
- [Brightspace](https://dlo.mijnhva.nl/d2l/home/456154)

If you have questions:
- [Look at the additional resources]()
- [Use a search engine like startpage](https://www.startpage.com/)
- [Ask questions on MS Teams](https://teams.microsoft.com/l/channel/19%3a61df853840064eae8ae6fc2dc9fc4566%40thread.tacv2/09%2520Real%2520Time%2520Web?groupId=c8b97eb6-ad53-4531-ad66-5c3c6297951c&tenantId=0907bb1e-21fc-476f-8843-02d09ceb59a7) (please help each other!)
- [Contact a student-assisstant](#synopsis)
- [Contact a lecturer](#synopsis)

## Goals
After finishing this program you can:
- _deal with real-time complexity;_
- _handle real-time client-server interaction;_
- _handle real-time data management;_
- _handle multi-user support._

## Grading
Your efforts will be graded using a single point rubric (see below). You will have to pass the criterion (centre column) to pass the course. During the test you will be consulted and will be given feedback on things we think deficient and things we think are an improvement on the criterion.

| Deficiency | Criterion | Improvement |
|:--|:--|:--|
|  | *Project* Your app is working and published on Heroku. Your project is thoroughly documented in the `README.md` file in your repository. Included are a description of the data-lifecycle, real-time events and external data source used by your app. |  |
|  | *Complexity* You’ve implemented enough real-time functionality for us to test your comprehension of the subject. A lot of functionality is self-written. You are able to manipulate online examples live. |  |
|  | *Client-server interaction* By interacting with the app, a user can influence the data model of the server in real time by directly modifying data OR by influencing API requests between server and source. The student has set up the data manipulations. |  |
|  | *Data management* The server maintains a data model and each client is continuously updated with the correct data. |  |
|  | *Multi-user support* Multiple clients can connect to the server. Interaction works as expected and is not dependent on the number of clients. You can explain how your app approaches this. |  |

## Programme

### Daily Schedule
To keep things simple we use a daily schedule that will be used during normal course days (monday/tuesday). We make exceptions for fridays, on these days a different schedule will be given.

| Time | Who | Activity |
|:--|:--|:--|
| *~09:00* | *(Shyanta \|\| Justus)* | *Standup* |
| 09:30 | Tribe *+(Shyanta \|\| Justus)* | Talk with crucial information (make sure you attend!) |
| 11:00 | Tribe | Work on the (day)assignment |
|  | Per table *+(Shyanta \|\| Justus)* | Standup |
| 13:00 | Tribe *+(Student assistants)* | Continue work on the (day)assignment |
| 16:00ish | Tribe | Wrapup |

### Week 1 - Getting a grip
Goal: Build and deploy a simple but unique real-time app

#### Monday 17 April 
**Talk subjects:** Hit the ground running... [(slides)](https://docs.google.com/presentation/d/1MLSch_uKNEDyfz7fo71jbJrprunxQwd9GtgTse8wWpo/edit?usp=sharing) Course objective and explanation of the assignment, examples from last year, explanation of real-time, (live coded) bare bone chat app and deployment on Heroku.\
**Day assignment:** [(assignment)](./course/week-1.md#assignment-1-make-it-so) Make it so *(as a team)*: Implement (code/style/discuss/deploy) basic chat (or other realtime) functionality on your teampage!

#### Tuesday 18 April
**Talk subjects:** My first realtime web app! [(slides)]() Short recap, (local) data management, using (wire) flows for realtime web apps.\
**Day assignment:** [(assignment)](./course/week-1.md#assignment-2-make-it-so) Make it so *(individually)*. i) Create (code/style/discuss/deploy) a chat app (or other realtime functionality) based on the examples and ii) add your own unique feature!

#### Friday 21 april

Friday afternoon we will have a [peer review session](./course/peer-review.md). You will read, comment and fire issues on each others code. Doing this is really good for your programming insight and helps others refining/refactoring their code.

| Time | Who | Activity |
|:--|:--|:--|
| 14:00 | Tribe *+(Shyanta \|\| Justus)* | Peer review |

### Week 2 - Sockets and data
Goal: Store, manipulate and share data between server-client   

#### Monday 24 April
**Talk subjects:** Data driven development?! [(slides)]() Feedback about last week, final assignment and conditions (rubric), explanation of data management, Long polling vs Websockets. \
**Day assignment:** [(assignment)](./course/week-2.md#assignment-1-proof-of-concept) (Proof of) Concept *(individually)*. i) Create a (3 > 1) concept based on existing data from an API and ii) map this data using modelling techniques.

#### Tuesday 25 April
**Talk subjects:** Above all else, show the data. [(slides)]() Securing real-time web apps, offline support, the publication/subscription model and (case study) Quek!\
**Day assignment:** [(assignment)](./course/week-2.md#assignment-2-proof-of-concept) Proof of concept *(individually)*: i) Create (code/style/discuss/deploy) part of the core functionality for your concept and ii) show the  corresponding data lifecycle diagram.

### Week 3 - Dealing with multiple users
Goal: Handle data sharing and multi-user support 

#### Monday 8 May
**Talk subjects:** Roll your own... [(slides) ]() Data management, the functional programming trinity (map, filter and reduce). OAuth?!
**Day assignment:** [(assignment)](./course/week-3.md#assignment-1-data-management)

#### Tuesday 9 May
**Talk subjects:** Not ignoring the UI-Stack! [(slides)](). Usability, feedback, feedforward etc. in real-time web apps, (case study) postNL loader and FAQ.
**Day assignment:** [(assignment)](./course/week-3.md#assignment-2-user-testing)

#### Friday 12 May
We will have a final [peer review session](./course/peer-review.md). You will read, comment and fire issues on each others code. Doing this helps others dotting the i’s on their project.

| Time | Who | Activity |
|:--|:--|:--|
| 14.00 | Tribe *+(Shyanta \|\| Justus)* | Peer review |
| 15.30 | Tribe *+(Shyanta \|\| Justus)* | Finalize your assignment |
| 16.00 | Tribe *+(Shyanta \|\| Justus)* | (drinks?!) |


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
