const express = require('express');
const Model = require('../model/model')

const router = express.Router()
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/users', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})
module.exports = router;