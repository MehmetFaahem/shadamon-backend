const express = require("express");
const app = express();
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server)

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const cors = require('cors')
app.use(cors())

// io.on('connection', (socket) => {
//     console.log('A user Connected')
//     socket.on('messer', (message) => {
//         console.log('message:', message)
//     })
//     socket.on('disconnect', () => {
//         console.log('A user disconnected')
//     })
// })

const mongoose = require('mongoose')
const bodyParser = require('body-parser');
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoString = process.env.DATABASE_URL

const routes = require('./routes/routes')
const passwordReset = require('./routes/password-reset')
const categoryroute = require('./routes/categoryadd')
const productroute = require('./routes/productadd')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.use(express.json());


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


app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});