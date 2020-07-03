const express = require("express");

const {
  getCourses,
  getCoursesAndCoaches,
  // getCoursesCategory,
  // getCoursesID,
  bookingCourse,
  getBookingData,
  getMemberBookingData,
  addNumOfCourse,
  updateBooking,
  reduceNumOfCourse
} = require("../controllers/course-controllers");

const router = express.Router();

//抓課程資料表的課程資訊
router.get("/addNumOfCourse", getCourses)
//抓課程、教練
router.get("/data", getCoursesAndCoaches);
// router.get("/courses/data/:courseId", getCoursesID)

//會員中心抓會員預約的課程資訊
router.get("/memberBookingData", getMemberBookingData)

//上傳、取消預約課程
router.get("/bookingData", getBookingData)
router.post("/bookingData", bookingCourse)
router.post("/bookingData/:courseBookingId", updateBooking)
router.post("/data", reduceNumOfCourse)
router.post("/addNumOfCourse", addNumOfCourse)

module.exports = router;