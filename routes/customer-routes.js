const express = require("express");
const router = express.Router();

const {
  getcustomerItems,
  postreplylist,
  getreplylist,
  getfaqlist,
  postcustomerItems,
} = require("../controllers/customerItem");

router.get("/", getcustomerItems);

router.get("/faqlist", getfaqlist);

router.get("/getreplylist", getreplylist);

router.post('/test', postreplylist);

router.post('/', postcustomerItems);


module.exports = router;