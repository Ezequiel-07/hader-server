const express = require("express");
const router = express.Router();

const auth = require("../controllers/auth");
const update = require("../controllers/update");

router.post("/api/signup", auth.signup);
router.post("/api/signin", auth.signin);
router.post("/api/tokenVerify", auth.tokenVerify);

router.post("/api/verifyNickname", update.vetifyNickname);
router.post("/api/verifyEmail", update.vetifyEmail);
router.post("/api/updateNickname", update.nickname);
router.post("/api/updateName", update.name);
router.post("/api/updateDescription", update.updateDescription);

router.post("/api/follow", update.follow);
router.post("/api/unfollow", update.unfollow);
router.post("/api/block", update.block);
router.post("/api/unlock", update.unlock);

module.exports = router;