const express = require("express");
const router = express.Router();

const data = require("../controllers/sendData");

router.post("/api/getDataForHome", data.home);
router.post("/api/search", data.search);
router.post("/api/userPost", data.postsOfUser);
router.post("/api/getUser", data.SendUser);
router.post("/api/verifyFollow", data.verifyFollow);
router.post("/api/verifyBlock", data.verifyBlock);
router.post("/v", (req, res)=>{res.json({message:'hello'})});

module.exports = router;
