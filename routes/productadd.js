const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

router.use(cors());

const Product = require("../model/products");

cloudinary.config({
  cloud_name: "devvizeuo",
  api_key: 465862995171618,
  api_secret: "VaLQ0urXLFQWXmWEIVe5nAXHWbA",
});

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, __dirname + "/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.fieldname + "-" + Date.now() + ".png");
//   },
// });

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Lekhoks",
    format: async (req, file) => "png",
    public_id: (req, file) => "computed-filename-using-request",
  },
});

const upload = multer({ storage: storage });

router.post("/add", upload.single("image"), async (req, res) => {
  const Imagedata = {
    image: req.file.path,
  };
  cloudinary.uploader
    .upload(Imagedata.image)

    .then(async (result) => {
      const data = new Product({
        name: req.body.name,
        description: req.body.description,
        author: req.body.author,
        condition: req.body.condition,
        price: req.body.price,
        img: result.url,
        createdDate: req.body.date,
        createdTime: req.body.time,
      });
      const response = await data.save();
      res.status(200).send("Uploaded");
    })
    .catch((error) => {
      res.status(400).json({ message: error.message });
    });
});

router.put("/update/:id", async (req, res) => {
  try {
    const updatedProduct = new Product({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      author: req.body.author,
      condition: req.body.condition,
      price: req.body.price,
      createdDate: req.body.date,
      createdTime: req.body.time,
    });

    const updating = await Product.updateOne(
      { _id: req.params.id },
      updatedProduct
    );
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/get", async (req, res) => {
  try {
    const data = await Product.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    if (req.params.id === "all") {
      const data = await Product.deleteMany({});
      res.status(200).json(data);
    } else {
      const data = await Product.findOneAndDelete({ _id: req.params.id });
      res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
