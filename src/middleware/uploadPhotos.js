const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const UserModel = require("../models/userModel");
const multer = require("multer");
const multerS3 = require("multer-s3");
const s3 = require("../utils/s3Auth");

const uploadAvatar = multer({
  storage: multerS3({
    s3: s3,
    bucket: "userphotoscatalogo",
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

const uploadProductPics = multer({
  storage: multerS3({
    s3: s3,
    bucket: "productphotoscatalogo",
    acl: "public-read",
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});

async function updateAvatar(file, user) {
  if (!file) {
    throw new Error("No file selected.");
  }
  const { key } = file;
  const { id } = user;

  const User = await UserModel.findById(id);
  if (User.photo) {
    const deletePhoto = new DeleteObjectCommand({
      Bucket: "userphotoscatalogo",
      Key: User.photo,
    });
    await s3.send(deletePhoto);
  }

  User.photo = key;

  await User.save();
}

module.exports = { uploadAvatar, uploadProductPics, updateAvatar };