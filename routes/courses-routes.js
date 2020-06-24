const express = require("express");

const {
  getCourses,
  getCoursesID,
  bookingCourse,
  cancelBooking,
  getBookingData,
  getMemberBookingData,
} = require("../controllers/course-controllers");

const router = express.Router();

//抓課程資料表的課程資訊
router.get("/data", getCourses);
router.get("/courses/data/:courseId", getCoursesID)

//會員中心抓會員預約的課程資訊
router.get("/memberBookingData", getMemberBookingData)

//上傳、取消預約課程
router.get("/bookingData", getBookingData )
router.post("/bookingData", bookingCourse)
router.delete("/bookingData/:courseBookingId", cancelBooking)


module.exports = router;
