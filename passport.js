const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("./mySql-connect");

passport.serializeUser((user, done) => {
  //   console.log(user);
  done(null, user.memberId);
});

passport.deserializeUser(async (id, done) => {
  const [row] = await db.query("select * from user where memberId = " + id);
  console.log("fuck");
  done(null, row[0]);
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
          await db.query("INSERT INTO `user` set ?", [newUser]);
          const [user] = await db.query(
            "SELECT * FROM user ORDER BY memberId DESC LIMIT 1"
          );
          return done(null, user[0]);
        } else {
          //   req.errMessage = "This email is already taken";
          return done(null, "This email is already taken");
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

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
