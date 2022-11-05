const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    name: {
        type: String,
        required: true
    }
})

const categorySchema = new Schema({
    name: {
        type: Schema.Types.String,
        required: true
    },
    subcategories: [subCategorySchema],
    createdDate: {
        type: String,
        default: new Date().getDate() + "-" + new Date().getMonth() + "-" + new Date().getFullYear()
    },
    createdTime: {
        type: String,
        default: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()
    }
})

module.exports = mongoose.model("categories", categorySchema);