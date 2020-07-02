const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const db = require("./mySql-connect");

passport.serializeUser((user, done) => {
  // console.log("serializeUser", user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // console.log(id);
  db.query("select * from user where id = " + id, (err, row) => {
    // console.log("deserializeUser", row[0]);
    done(null, { ...row[0], memberPwd: null });
  });
});

// Sign up
passport.use(
  "local-signup",
  new LocalStrategy(
    {
      // by default, local strategy uses username and password, we will override with email
      usernameField: "memberAccount",
      passwordField: "memberPwd",
      passReqToCallback: true, // allows us to pass back the entire request to the callback
    },
    async (req, memberAccount, memberPwd, done) => {
      try {
        const newUser = {};
        const [row] = await db.query(`SELECT * FROM user`);
        const exist = row.find((user) => user.memberAccount === memberAccount);
        if (!exist) {
          newUser.memberAccount = memberAccount;
          newUser.memberPwd = memberPwd;
          newUser.memberName = req.body.memberName;
          await db.query("INSERT INTO `user` set ?", [newUser]);
          const [user] = await db.query(
            "SELECT * FROM user ORDER BY id DESC LIMIT 1"
          );
          return done(null, user[0]);
        } else {
          // req.errMessage = "This email is already taken";
          return done(null, false, { message: "Incorrect password." });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);
// Sign in
passport.use(
  "local-signin",
  new LocalStrategy(
    {
      usernameField: "memberAccount",
      passwordField: "memberPwd",
      passReqToCallback: true,
    },
    async (req, memberAccount, memberPwd, done) => {
      const [row] = await db.query(`SELECT * FROM user`);
      const checkUser = row.find(
        (user) => user.memberAccount === memberAccount
      );
      if (!checkUser) {
        return done(null, "Account not exist");
      } else if (checkUser.memberPwd !== memberPwd) {
        return done(null, "password is wrong");
      } else {
        const [user] = await db.query(
          `SELECT * FROM user WHERE memberAccount LIKE "%${memberAccount}%"`
        );
        // console.log(user);
        return done(null, user[0]);
      }
    }
  )
);

// Google Sign in
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "175789185885-1o4au64222k77b3erlp9q0ubdquc2l47.apps.googleusercontent.com",
      clientSecret: "bYNzHgKNPAneuCxMlriP_TOw",
      callbackURL: "/api/user/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      const [row] = await db.query(
        `SELECT * FROM user WHERE googleId=${profile.id}`
      );
      if (row.length) {
        done(null, row[0]);
      } else {
        const newUser = {};
        newUser.googleId = profile.id;
        newUser.memberName = profile.displayName;
        newUser.memberAccount = profile.emails[0].value;

        await db.query("INSERT INTO `user` set ?", [newUser]);
        const [user] = await db.query(
          `SELECT * FROM user WHERE googleId=${newUser.googleId}`
        );
        done(null, user[0]);
      }
    }
  )
);
