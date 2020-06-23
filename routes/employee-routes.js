const express = require("express");
const db = require("../mySql-connect");


const {
  getemployeelogin,
  getemployeecenter,
  getemployeecenterID,
  getemployee,
  getemployeeID,
  getcourses,
  postcourses,
  updatecourses,
  deletecourses,
  getcoursesID,
} = require("../controllers/employee");

const router = express.Router();

//教練登入
router.get("/employeelogin", getemployeelogin);

//教練中心
router.get("/employeecenter", getemployeecenter);
router.get("/employeecenter/:Eid", getemployeecenterID);

//教練
router.get("/employee", getemployee);
router.get("/employee/:Eid", getemployeeID);

//課程
router.get("/courses", getcourses);
router.get("/courses/:courseId", getcoursesID);

//上傳課程
router.post('/courses', postcourses);

//更新課程
router.post('/courses/:courseId', updatecourses)

//刪除課程
router.delete('/courses/:courseId',deletecourses)

module.exports = router;