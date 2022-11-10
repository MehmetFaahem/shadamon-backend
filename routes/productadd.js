const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const multer = require('multer');


const Product = require('../model/products')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __dirname + '/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.png')
    }
});

const upload = multer({ storage: storage });

router.post('/add', upload.single('image'), async (req, res) => {
    const data = new Product({
        name: req.body.name,
        description: req.body.description,
        condition: req.body.condition,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/server/uploads/' + req.file.filename)),
            contentType: 'image/png'
        },
        createdDate: req.body.date,
        createdTime: req.body.time
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/get', async (req, res) => {
    try {
        const data = await Product.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;