const db = require("../mySql-connect");
const HttpError = require("../models/http-error");

//教練
const getemployee = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM employee");
  res.json(rows);
};

//教練登入
const getemployeelogin = async (req, res) => {
  const [rows] = await db.query(
    "SELECT `Eaccount`,`Epwd`,`Eid` FROM `employee`"
  );

  res.json(rows);
};

//教練與課程
const getemployeecenter = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM `employee` INNER JOIN `courses` ON `employee`.`Eid` = `courses`.`staffId`"
  );
  res.json(rows);
};

//課程
const getcourses = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM courses");
  res.json(rows);
};

//新增課程
const postcourses = async (req, res) => {
  const output = {
    success: false,
  };
  const sql = "INSERT INTO courses set ?";
  db.query(sql, [req.body]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
};

//更新課程
const updatecourses = async (req, res) => {
  const output = {
    success: false,
    body: req.body,
  };
  let courseId = parseInt(req.body.courseId);
  if (!courseId) {
    output.error = "沒有主鍵";
    return res.json(output);
  }
  const sql = "UPDATE `courses` SET ? WHERE courseId=?";
  delete req.body.courseId;
  db.query(sql, [req.body, courseId]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.changedRows) {
      output.success = true;
    }
    res.json(output);
  });
};

//刪除課程
const deletecourses = async (req, res) => {
  let referer = req.get("/courses/:courseId"); // 從哪裡來
  const sql = "DELETE FROM `courses` WHERE courseId=?";
  db.query(sql, [req.params.courseId]);
  //  console.log(req.params.courseId)
  if (referer) {
    res.redirect(referer);
  } else {
    res.send("ok");
  }
};

//單一教練的課程
const getemployeecenterID = async (req, res) => {
  try {
    const Eid = req.params.Eid;
    // console.log(Eid);
    const [row] = await db.query(
      `SELECT * FROM employee INNER JOIN courses ON employee.Eid = courses.staffId WHERE employee.Eid=${Eid}`
    );
    if (!row) return next("Can't find shop item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find shop item", 404));
  }
};

//單一教練
const getemployeeID = async (req, res) => {
  try {
    const Eid = req.params.Eid;
    // console.log(Eid);
    const [row] = await db.query(`SELECT * FROM employee WHERE Eid=${Eid}`);
    if (!row) return next("Can't find shop item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find shop item", 404));
  }
};

//單一課程
const getcoursesID = async (req, res) => {
  try {
    const newRow = {};
    const courseId = req.params.courseId;
    const [row] = await db.query(
      `SELECT * FROM courses WHERE courseId=${courseId}`
    );
    if (!row) return next("Can't find shop item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find shop item", 404));
  }
};

module.exports = {
  getemployeelogin,
  getemployeecenter,
  getemployee,
  getemployeeID,
  getcourses,
  postcourses,
  updatecourses,
  deletecourses,
  getcoursesID,
  getemployeecenterID,
};
