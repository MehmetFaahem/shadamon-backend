const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const cors = require('cors')
const cloudinary = require('cloudinary').v2

router.use(cors())

const Product = require('../model/products')

cloudinary.config({
    cloud_name: 'devvizeuo',
    api_key: 465862995171618,
    api_secret: 'VaLQ0urXLFQWXmWEIVe5nAXHWbA'
});

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
    const Imagedata = {
        image: req.file.path
    }
    cloudinary.uploader.upload(Imagedata.image)

        .then(async (result) => {
            const data = new Product({
                name: req.body.name,
                description: req.body.description,
                condition: req.body.condition,
                price: req.body.price,
                img: result.url,
                createdDate: req.body.date,
                createdTime: req.body.time
            })
            const response = await data.save();
            res.status(200).send('Uploaded')
        }).catch((error) => {
            res.status(400).json({ message: error.message })
        });
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