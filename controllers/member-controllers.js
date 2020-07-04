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
  console.log(req.body)
  try {
    const newRow = {};
    const userId = req.params.userId;
    //   console.log(memberId);
    const [rows] = await db.query(
      `SELECT * FROM user WHERE id=${userId}`
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
}

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








const InsertCheckOutPage = (req, res) => {
  // console.log(req.body.data);
  const output = {
    success: false,
  };
  const sql = "INSERT INTO `user` set ?";
  db.query(sql, [req.body]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
  // res.json(req.body);
};

const UpdateUser = (req, res) => {
  // console.log(req.body.data)
  const output = {
    success: false
  }
  for (let i of [req.body.data]) {
    i.memberAddress ?
    i.memberAddress = req.body.city + req.body.contury + req.body.data.memberAddress :
    i.memberAddress =''
  }
  const sql = `UPDATE user SET  ? WHERE id = ? `;
  db.query(sql, [req.body.data, req.body.memberid])
    .then(([r]) => {
      output.results = r;
      if (r.affectedRows && r.insertId) {
        output.success = true;
      }
      res.json(output);
    })

}






module.exports = { getMember, getMemberId, InsertCheckOutPage, UpdateUser };