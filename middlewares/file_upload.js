const multer = require('multer');

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();
const path = require('path')

const crypto = require("crypto");
const storageProduct = multer.diskStorage({
    destination: "./public/uploads/products",
    filename: function (req, file, cb) {
        let date = new Date();
        let name = `${date.getMonth() + 1}.${date.getDay()}.${date.getFullYear()}`
        cb(null, `${file.fieldname}-${name}.${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname)}`);
    }
})
const storageSlider = multer.diskStorage({
    destination: "./public/uploads/slider",
    filename: function (req, file, cb) {
        let date = new Date();
        let name = `${date.getMonth() + 1}.${date.getDay()}.${date.getFullYear()}`
        cb(null, `${file.fieldname}-${name}.${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname)}`);
    }
})
const storageBanner = multer.diskStorage({
    destination: "./public/uploads/banner",
    filename: function (req, file, cb) {
        let date = new Date();
        let name = `${date.getMonth() + 1}.${date.getDay()}.${date.getFullYear()}`
        cb(null, `${file.fieldname}-${name}.${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname)}`);
    }
})
const storageTeam = multer.diskStorage({
    destination: "./public/uploads/team",
    filename: function (req, file, cb) {
        let date = new Date();
        let name = `${date.getMonth() + 1}.${date.getDay()}.${date.getFullYear()}`
        cb(null, `${file.fieldname}-${name}.${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname)}`);
    }
})
var error_response = { errors: [] };
function checkFileTypePhoto(file, cb) {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png") {
        return cb(null, true);
    } else {
        error_response.errors.push({ "param": `${file.fieldname}`, "msg": "Yalnız jpeg vəya png" })
        return cb(null, false)
    }
}
const uploadProduct = multer({
    storage: storageProduct,
    limits: { filesize: 5000000 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname == 'images') {
            checkFileTypePhoto(file, cb)
        }
    }
}).array("images");
const uploadSlider = multer({
    storage: storageSlider,
    limits: { filesize: 5000000 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname == 'image' || file.fieldname == 'mobile_image') {
            checkFileTypePhoto(file, cb)
        }
    }
}).fields([
    { name: "image", maxCount: 1 },
    { name: "mobile_image", maxCount: 1 }
])
const uploadBanner = multer({
    storage: storageBanner,
    limits: { filesize: 5000000 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname == 'image' || file.fieldname == "mobile_image") {
            checkFileTypePhoto(file, cb)
        }
    }
}).fields([
    { name: "image", maxCount: 1 },
    { name: "mobile_image", maxCount: 1 }
])
const uploadTeam = multer({
    storage: storageTeam,
    limits: { filesize: 5000000 },
    fileFilter: function (req, file, cb) {
        if (file.fieldname == 'image' || file.fieldname == "mobile_image") {
            checkFileTypePhoto(file, cb)
        }
    }
}).single('image')
module.exports = {
    uploadProduct,
    uploadSlider,
    uploadBanner,
    uploadTeam,
    error_response
}