const express = require("express");
const app = express();
const http = require('http').Server(app)

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const cors = require('cors')
app.use(cors())
const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoString = process.env.DATABASE_URL

const fs = require('fs')
const messageData = fs.readFileSync('messages.json')

const messagesData = JSON.parse(messageData)

const routes = require('./routes/routes')
const passwordReset = require('./routes/password-reset')
const categoryroute = require('./routes/categoryadd')
const productroute = require('./routes/productadd')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.json());

const socketIO = require('socket.io')(http, {

    cors: {
        origin: "https://kinbo.vercel.app/"
    }

});

app.use('/api', routes)
app.use('/api/category', categoryroute)
app.use('/api/product', productroute)
app.use("/api/password-reset", passwordReset);

mongoose.connect(mongoString);
const database = mongoose.connection

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('friendID', (data) => {
        socketIO.emit('clickedID', data);
    })

    socket.on("message", data => {
        messagesData["messages"].push(data)
        const stringData = JSON.stringify(messagesData, null, 2)
        fs.writeFile("messages.json", stringData, (err) => {
            console.error(err)
        })
        socketIO.emit("messageResponse", data)
    })



    socket.on('joining-room', room => {
        socket.join(room)
    })


    socket.on('typing', (data) => socket.broadcast.emit('typingResponse', data));

    socket.on('newUser', (data) => {
        users.push(data);
        socketIO.emit('newUserResponse', users);
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter((user) => user.socketID !== socket.id);
        socketIO.emit('newUserResponse', users);
        socket.disconnect();
    });
});


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});