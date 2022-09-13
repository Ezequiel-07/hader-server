const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage =  multer.diskStorage({
    destination: path.join(__dirname, "public/uploads"),
    filename: (req, file, cb)=>{
        cb(null, new Date().getTime()/1000 + path.extname(file.originalname));
    }
});
const uploadMulter = multer({
    dest: path.join(__dirname, "public/uploads"),
    storage: storage,
});

const posts = require("../controllers/posts");
const update = require("../controllers/update");

router.post("/api/publish", uploadMulter.single("file"), posts.publish);
router.post("/api/publish/video", uploadMulter.single("file"), posts.publishVideo);
router.post("/api/comment", posts.comment);
router.post("/api/getComments", posts.sendComments);
router.post("/api/verifyLikes", posts.comprobateLike);
router.post("/api/likes", posts.like);
router.post("/api/dislike", posts.dislike);

router.post("/api/updateProfileImg", uploadMulter.single("file"), update.profile_photo);

router.post("/api/delete/post", update.delete_post);

module.exports = router;