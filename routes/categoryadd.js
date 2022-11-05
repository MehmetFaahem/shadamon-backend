const express = require('express');
const Categories = require('../model/categories')

const router = express.Router()
router.post('/add', async (req, res) => {
    const data = new Categories({
        name: req.body.name,
        subcategories: req.body.subcategories,
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
        const data = await Categories.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;