const db = require("../mySql-connect");
const HttpError = require("../models/http-error");
const moment = require("moment-timezone");
const router = require("../routes/courses-routes");

//單純抓課程資訊
const getCourses = async (req, res) => {
  const newRow = {};
  const [rows] = await db.query(
    "SELECT * FROM `courses`"
  );

  // console.log(rows)

  // console.log(newRow.coursesRow)
  for (i of rows) {
    const fm = "ddd MM DD HH:mm";
    i.currentDay = i.courseTime.getDay()
    i.courseTime2 = new Date(i.courseTime).getTime();
    i.courseTime = moment(i.courseTime).format(fm);
  }
  if (rows) newRow.coursesRow = rows;
  res.json(newRow);
};

//抓所有課程、教練資訊，新增兩個by 0630
const getCoursesAndCoaches = async (req, res) => {
  const newRow = {};
  const [rows] = await db.query(
    "SELECT * FROM courses INNER JOIN coursescategory ON courses.courseCategoryId = coursescategory.courseCategoryId INNER JOIN employee ON courses.staffId = employee.Eid ORDER BY courseTime"
  );

  // console.log(rows)

  // console.log(newRow.coursesRow)
  for (i of rows) {
    const fm = "ddd MM DD HH:mm";
    i.currentDay = i.courseTime.getDay()
    i.courseTime2 = new Date(i.courseTime).getTime();
    i.courseTime = moment(i.courseTime).format(fm);
  }
  if (rows) newRow.coursesRow = rows;
  res.json(newRow);
  // console.log(newRow)
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
    // console.log(courseId);
    const [rows] = await db.query(
      `SELECT * FROM courses WHERE courseId=${courseId}`
    );
    if (rows) newRow.coursesRow = rows;
    // console.log(rows);
    for (i of rows) {
      const fm = "ddd MM DD HH:mm";

      i.courseTime = moment(i.courseTime).format(fm);
      // console.log(i.courseTime.getDay())
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
  const newRow = {};
  const [rows] = await db.query(
    "SELECT `m`.`id`, `cb`.`courseBookingId`, `c`.`courseId`, `c`.`staffId`, `e`.`Ename`, `c`.`courseCategoryId`, `c`.`categoryName`, `c`.`courseName`, `c`.`courseImg`, `c`.`courseIntroduce`, `c`.`courseTime`, `c`.`courseHour`, `c`.`numberOfCourse`, `c`.`courseQuoda`, `e`.`Elicense`, `cb`.`bookingState`, `e`.`Eexpertise`, `e`.`Eimg` FROM `user` AS `m` INNER JOIN `courseBooking` AS `cb` ON `m`.`id` = `cb`.`memberId` INNER JOIN `courses` AS `c` ON `cb`.`courseId` = `c`.`courseId` INNER JOIN `employee` AS `e` ON `c`.`staffId` = `e`.`Eid` ORDER BY `c`.`courseTime`"
  );
  for (i of rows) {
    const fm = "ddd MM DD HH:mm";
    i.currentDay = i.courseTime.getDay()
    i.courseTime1 = i.courseTime
    i.courseTime2 = new Date(i.courseTime).getTime();
    i.courseTime3 = moment(i.courseTime).format(fm);
  }
  if (rows) newRow.coursesRow = rows;
  res.json(newRow);
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
const updateBooking = async (req, res) => {

  const sql = "UPDATE `courseBooking` SET `bookingState`='0' WHERE `courseBooking`.`courseBookingId`=?";
  await db.query(sql, [req.params.courseBookingId]);
  // console.log(req.params.courseBookingId);
  //  console.log(req.params.courseId)

  res.json({ msg: "ok" });

};
//預約後增加人數
const addNumOfCourse = async (req, res) => {

  const sql = "UPDATE `courses` SET `numberOfCourse`= `numberOfCourse`+1 WHERE `courses`.`courseId`=? ";
  await db.query(sql, [req.body.courseId]);
  // console.log(req.params.courseBookingId);
  //  console.log(req.params.courseId)
  const newSql = `SELECT numberOfCourse FROM courses WHERE courseId = ${req.body.courseId} `
  // console.log(res.json(req.body))
  const [row] = await db.query(newSql)
  res.json(row[0])

};

//取消預約後減人數
const reduceNumOfCourse = async (req, res) => {

  const sql = "UPDATE `courses` SET `numberOfCourse`=`numberOfCourse`-1 WHERE `courses`.`courseId`=?";
  await db.query(sql, [req.body.courseId]);
  // console.log(req.params.courseBookingId);
  //  console.log(req.params.courseId)
  const newSql = `SELECT numberOfCourse FROM courses WHERE courseId = ${req.body.courseId} `
  // console.log(res.json(req.body))
  const [row] = await db.query(newSql)
  res.json(row[0])
};


module.exports = {
  getCourses,
  getCoursesAndCoaches,
  getCoursesCategory,
  getCoursesID,
  bookingCourse,
  getBookingData,
  getMemberBookingData,
  addNumOfCourse,
  updateBooking,
  reduceNumOfCourse
};
