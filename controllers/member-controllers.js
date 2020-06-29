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

// const GetApi = async (req) => {
//   const perPage = 5;
//   let page = parseInt(req.params.page) || 1;
//   const output = {
//     // page: page,
//     perPage: perPage,
//     totalRows: 0, // 總共有幾筆資料
//     totalPages: 0, //總共有幾頁
//     rows: [],
//   };
//   const [r1] = await db.query("SELECT COUNT(1) num FROM ");
//   output.totalRows = r1[0].num;
//   output.totalPages = Math.ceil(output.totalRows / perPage);
//   if (page < 1) page = 1;
//   if (page > output.totalPages) page = output.totalPages;
//   if (output.totalPages === 0) page = 0;
//   output.page = page;

//   if (!output.page) {
//     return output;
//   }
//   const sql = "";

//   const [r2] = await db.query(sql);
//   if (r2) output.rows = r2;
//   for (let i of r2) {
//     // console.log(i.created_at)
//     i.created_at = moment(i.created_at).format("YYYY-MM-DD");
//   }
//   return output;
// };

// const getapi = async (req, res) => {
//   const output = await GetApi(req);
//   res.json(output);
//   console.log(output);
// };

const InsertCheckOutPage = async (req, res) => {
  const output = {
    success: false,
  };
  // Check sign up email have exist or not
  const [checkEmailList] = await db.query("SELECT memberAccount FROM user");
  if (
    checkEmailList.find((user) => user.memberAccount === req.body.memberAccount)
  )
    return res.json(output);

  // Insert sign up info in DB
  const sql = "INSERT INTO `user` set ?";
  await db.query(sql, [req.body]);

  // Query sign up info from DB
  const [signUpUser] = await db.query(
    "SELECT * FROM user ORDER BY memberId DESC LIMIT 1"
  );
  output.success = true;
  output.currentUser = signUpUser[0];
  res.json(output);
};

module.exports = { getMember, getMemberId, InsertCheckOutPage };
