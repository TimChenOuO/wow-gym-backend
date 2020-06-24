const db = require("../mySql-connect");
const HttpError = require("../models/http-error");
const moment = require("moment-timezone");

const getMember = async (req, res) => {
  const newRow = {};
  try {
    const [rows] = await db.query("SELECT * FROM user");
    res.json(rows);
  } catch (err) {
    res.send(err);
  }
};

const getMemberId = async (req, res, next) => {
  try {
    const newRow = {};
    const userId = req.params.userId;
    //   console.log(memberId);
    const [rows] = await db.query(
      `SELECT * FROM user WHERE memberId=${userId}`
    );
    if (rows) newRow.membersRow = rows;
    // console.log(row)
    for (i of rows) {
      const fm = "ddd MM DD HH:mm";
      i.courseTime = moment(i.courseTime).format(fm);
      if (!rows) return next("Can't find shop item", 404);
      res.json({ memberItem: newRow });
    }
  } catch (err) {
    return next(new HttpError("Can't find shop item", 404));
  }
};

module.exports = { getMember, getMemberId };
