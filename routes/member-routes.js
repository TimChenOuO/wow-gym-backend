const express = require("express");

const { getMember, getMemberId } = require("../controllers/member-controllers");

const router = express.Router();

router.get("/", getMember);
router.get("/:userId", getMemberId);

module.exports = router;
