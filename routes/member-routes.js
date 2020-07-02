const express = require("express");

const { getMember, getMemberId } = require("../controllers/member-controllers");
const { route } = require("./courses-routes");

const router = express.Router();

router.get("/", getMember);
router.get("/:userId", getMemberId);
router.post("/")

module.exports = router;
