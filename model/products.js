const mongoose = require('mongoose')
const Schema = mongoose.Schema


const ProductSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    author: {
        type: String,
        default: 'Fulan'
    },
    condition: {
        type: String,
        default: 'used',
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String
    },
    createdDate: {
        type: String,
        default: new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear()
    },
    createdTime: {
        type: String,
        default: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
    }
})

module.exports = mongoose.model("products", ProductSchema);