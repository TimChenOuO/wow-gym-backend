const db = require("../mySql-connect");
const HttpError = require("../models/http-error");
const moment = require('moment');
// const getcustomerItems = async (req, res) => {
//   const [rows] = await db.query("SELECT `user`.`memberId`,`customerservice`.`memberId`,`customerservice`.`complaintkind`,`customerservice`.`complaintkind`,`customerservice`.`name` ,`customerservice`.`phonenumber`,`customerservice`.`email` ,`customerservice`.`complainttitle` ,`customerservice`.`	complainttextarea` ,`customerservice`.`createtime` FROM `customerservice` INNER JOIN `user` ON `customerservice`.`memberId` = `user`.`memberId`" )
//   res.json(rows);
// };

const getcustomerItems = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM 	customerservice")
  for(
    let i of rows
  )
  {
    i.createtime = moment(i.createtime).format('YYYY/MM/DD HH:mm:ss');
    i.replytime = moment(i.replytime).format('YYYY/MM/DD HH:mm:ss');
  }
  res.json(rows);
};

const getreplylist = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM replylist")
  for(
    let i of rows
  )
  {
    i.createtime = moment(i.createtime).format('YYYY/MM/DD HH:mm:ss');
    i.replytime = moment(i.replytime).format('YYYY/MM/DD HH:mm:ss');
  }
  res.json(rows);
};

const getfaqlist = async (req, res) => {
  const [rows] = await db.query("SELECT `faqtitle`.`faqkindname`,`faqlist`.`faqid`,`faqlist`.`faqtitle`,`faqlist`.`faqbody`,`faqlist`.`createtime` FROM `faqlist` INNER JOIN `faqtitle` ON `faqlist`.`faqkind` = `faqtitle`.`faqkind`" )
  res.json(rows);
};

const postcustomerItems = async (req, res) => {
  const {memberId, complaintkind,name,phonenumber,email,complainttitle,complainttextarea} = req.body;
    const sql = 'INSERT into `customerservice` (`memberId`, `complaintkind`, `name`, `phonenumber`, `email`,`complainttitle`, `complainttextarea`) VALUES (? , ?, ? , ? , ?, ?, ?)';
    const result = await db.query(sql,[memberId, complaintkind,name,phonenumber,email,complainttitle,complainttextarea])
  
  // const {Complaintid, responder, replycontent} = req.body;
  // console.log("Complaintid",Complaintid,"responder",responder,"replycontent",replycontent)
  res.json(result);
}

const postreplylist = async (req, res) => {
  // for (let i=0; i < req.body.length; i ++){
  //   const {Complaintid, responder, replycontent} = req.body;
  //   const sql = ('INSERT into `replylist`(`Complaintid`, `responder`, `replycontent`) VALUES (?, ?, ?)')

  //   const result = await db.query(sql,[Complaintid,responder,replycontent])
  // }
      const {complaintid, responder, replycontent} = req.body;
      const sql = ('INSERT into `replylist`(`complaintid`, `responder`, `replycontent`) VALUES (?, ?, ?)')
      const result = await db.query(sql,[complaintid,responder,replycontent])

  // const {Complaintid, responder, replycontent} = req.body;
  // console.log("Complaintid",Complaintid,"responder",responder,"replycontent",replycontent)
  res.json(result);
}
 
// const getShopCollection = async (req, res) => {
//   try {
//     const collectionId = req.params.collection;
//     const [rows] = await db.query("SELECT * FROM items");
//     if (!rows) return next("Can't find shop item", 404);
//     res.json({ collection: rows });
//   } catch (err) {
//     return next(new HttpError("Can't find shop item of collection", 404));
//   }
// };

// const getShopItemByItemId = async (req, res) => {
//   try {
//     const itemId = req.params.itemId;
//     console.log(itemId);
//     const [row] = await db.query(`SELECT * FROM items WHERE itemId=${itemId}`);
//     if (!row) return next("Can't find shop item", 404);
//     res.json({ shopItem: row });
//   } catch (err) {
//     return next(new HttpError("Can't find shop item", 404));
//   }
// };

module.exports = {getcustomerItems , postreplylist , getreplylist , getfaqlist ,postcustomerItems };
