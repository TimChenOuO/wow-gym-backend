const db = require("../mySql-connect");
const HttpError = require("../models/http-error");
const moment = require("moment-timezone");
const router = require("../routes/courses-routes");

//抓所有課程
const getCourses = async (req, res) => {
  const newRow = {};
  const [rows] = await db.query(
    "SELECT * FROM courses INNER JOIN coursescategory ON courses.courseCategoryId = coursescategory.courseCategoryId INNER JOIN employee ON courses.staffId = employee.Eid ORDER BY courseTime"
  );
  // console.log(rows)
  if (rows) newRow.coursesRow = rows;
  // console.log(newRow.coursesRow)
  for (i of rows) {
    const fm = "ddd MM DD HH:mm";
    i.courseTime = moment(i.courseTime).format(fm);
    // console.log(i.courseTime)
  }
  res.json(newRow);
};

//抓課程種類（給課程表中的selector用）
const getCoursesCategory = async (req, res) => {
  try {
    const collectionId = req.params.collection;
    const [rows] = await db.query("SELECT * FROM coursescategory");
    if (!rows) return next("Can't find shop item", 404);
    res.json({ coursesCategory: rows });
  } catch (err) {
    return next(new HttpError("Can't find shop item of collection", 404));
  }
};

//抓單一個課程資料
const getCoursesID = async (req, res) => {
  try {
    const newRow = {};
    const courseId = req.params.courseId;
    console.log(courseId);
    const [rows] = await db.query(
      `SELECT * FROM courses WHERE courseId=${courseId}`
    );
    if (rows) newRow.coursesRow = rows;
    console.log(rows);
    for (i of rows) {
      const fm = "ddd MM DD HH:mm";
      i.courseTime = moment(i.courseTime).format(fm);
      // console.log(i.courseTime)
    }
    res.json({ courseItem: newRow });
  } catch (err) {
    return next(new HttpError("Can't find course item", 404));
  }
};
//抓預約資料表
const getBookingData = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM `courseBooking`");
  res.json(rows);
};

//抓會員預約哪些課程及課程資料（給會員中心用）
const getMemberBookingData = async (req, res) => {
  const [rows] = await db.query(
    "SELECT `m`.`memberId`, `cb`.`courseBookingId`, `c`.`courseId`, `c`.`staffId`, `e`.`Ename`, `c`.`courseCategoryId`, `c`.`categoryName`, `c`.`courseName`, `c`.`courseImg`, `c`.`courseIntroduce`, `c`.`courseTime`, `c`.`courseHour`, `c`.`numberOfCourse`, `c`.`courseQuoda` FROM `user` AS `m` INNER JOIN `courseBooking` AS `cb` ON `m`.`memberId` = `cb`.`memberId` INNER JOIN `courses` AS `c` ON `cb`.`courseId` = `c`.`courseId` INNER JOIN `employee` AS `e` ON `c`.`staffId` = `e`.`Eid`"
  );
  res.json(rows);
};

//預約課程
const bookingCourse = async (req, res) => {
  const output = {
    success: false,
  };
  const sql = "INSERT INTO `courseBooking` set ?";
  db.query(sql, [req.body]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
};

//取消預約
const cancelBooking = async (req, res) => {
  let referer = req.get("/bookingData/:courseBookingId"); // 從哪裡來

  const sql = "DELETE FROM `courseBooking` WHERE courseBookingId=?";
  db.query(sql, [req.params.courseBookingId]);
  console.log(req.params.courseBookingId);
  //  console.log(req.params.courseId)
  if (referer) {
    res.redirect(referer);
  } else {
    res.send("ok");
  }
};

module.exports = {
  getCourses,
  getCoursesCategory,
  getCoursesID,
  bookingCourse,
  cancelBooking,
  getBookingData,
  getMemberBookingData,
};
