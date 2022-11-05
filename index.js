const express = require("express");
const app = express();
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config();
const port = process.env.PORT || 5000;
const mongoString = process.env.DATABASE_URL

const routes = require('./routes/routes')
const passwordReset = require('./routes/password-reset')
const categoryroute = require('./routes/categoryadd')

app.use(cors())
app.use(express.json());
app.use('/api', routes)
app.use('/api/category', categoryroute)
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