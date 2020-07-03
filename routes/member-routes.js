const express = require("express");
const passport = require("passport");

// const {
//   getMember,
//   getMemberId,
//   // InsertCheckOutPage,
// } = require("../controllers/member-controllers");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: true,
  }),
  (req, res) => res.redirect("http://localhost:3000")
);

router.get("/logout", (req, res) => {
  // console.log("HI");
  // req.logout();
  req.session.destroy();
  res.json({ current: req.body });
});

router.post(
  "/signup",
  passport.authenticate("local-signup", {
    session: true,
  }),
  (req, res) => res.json({ ...req.user, memberPwd: null })
);

router.post(
  "/login",
  passport.authenticate("local-signin", { session: true }),
  (req, res) => {
    res.json({ ...req.user, memberPwd: null });
  }
);

router.get("/current-user", (req, res) => {
  // console.log(req.user);
  res.send(req.user);
});

module.exports = router;
