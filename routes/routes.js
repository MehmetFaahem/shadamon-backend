const express = require('express');
const Model = require('../model/model')

const router = express.Router()
router.post('/post', async (req, res) => {
    const data = new Model({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        date: req.body.date,
        time: req.body.time
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

router.delete('/delete/:id', async (req, res) => {
    try {
        if (req.params.id === 'all') {
            const data = await Model.deleteMany({});
            res.status(200).json(data)
        } else {
            const data = await Model.findOneAndDelete({ _id: req.params.id });
            res.status(200).json(data)
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const updatedUser = new Model({
            _id: req.params.id,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
        })
        const data = await Model.updateOne({ _id: req.params.id }, updatedUser);
        res.status(200).json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router;