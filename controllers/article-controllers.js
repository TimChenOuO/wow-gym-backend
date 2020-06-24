const db = require("../mySql-connect");
const moment = require('moment-timezone');
const HttpError = require("../models/http-error");

//取得文章資料
const getArticleItems = async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM article  INNER JOIN member ON article.memberId = member.memberId  ORDER BY articleId DESC"
  );
  res.json(rows);
};

//文章詳細頁
const getArticleItemById = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM article  INNER JOIN member ON article.memberId = member.memberId WHERE article.articleId=${articleId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//取得留言資料
const getComments = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM  (article INNER JOIN articlecomments ON articlecomments.articleId = article.articleId)INNER JOIN member ON article.memberId = member.memberId WHERE article.articleId=${articleId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//取得會員發表文章資料
const getArticleItemByMemberId = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM article  WHERE article.memberId=${memberId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//取得會員發表文章個別項目資料
const getArticleItemByArticleId = async (req, res) => {
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM article  INNER JOIN member ON article.memberId = member.memberId WHERE article.articleId=${articleId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//傳送留言
const postArticleAddComments = async (req, res) => {
  const output = {
    success: false,
  };
  // console.log(req.body);
  const sql =
    "INSERT INTO `articlecomments`(`articleId`, `memberId`, `memberName`, `content`, `memberImg`) VALUES (?,?,?,?,?) ";
  db.query(sql, [
    req.body.data.articleId,
    req.body.data.memberId,
    req.body.data.memberName,
    req.body.data.content,
    req.body.data.memberImg,
  ]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
  //res.json(req.body);
};

//新增文章
const postArticleAdd = async (req, res) => {
  const output = {
    success: false,
  };
  // console.log(req.body);
  const sql =
    "INSERT INTO `article`(`memberId`, `memberName`, `articleTitle`, `categoryName`, `articleContent`,`tagName1`,`tagName2`,`articleImages`,`memberImg`) VALUES (?,?,?,?,?,?,?,?,?) ";
  db.query(sql, [
    req.body.data.memberId,
    req.body.data.memberName,
    req.body.data.articleTitle,
    req.body.data.categoryName,
    req.body.data.articleContent,
    req.body.data.tagName1,
    req.body.data.tagName2,
    req.body.data.articleImages,
    req.body.data.memberImg,
  ]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
  //res.json(req.body);
};

//刪除文章
const getArticleItemByIdDel = async (req, res, next) => {
  // console.log(req.params.articleId);
  const output = {
    success: false,
  };

  const articleId = req.params.articleId;
  db.query(`DELETE FROM article WHERE  articleId =?`, [req.params.articleId]);

  res.json(output);
};

//更新文章
const postArticleItemByIdUpdate = async (req, res, next) => {
  const output = {
    success: false,
  };
  const articleId = req.params.articleId
  console.log(req.body);
  const sql = `UPDATE article SET ? WHERE articleId = ?`;
  db.query(sql, [req.body.data, articleId]).then(([r]) => {
    output.results = r;
    if (r.affectedRows && r.insertId) {
      output.success = true;
    }
    res.json(output);
  });
  //res.json(req.body);
};

module.exports = {
  getArticleItems,
  getArticleItemById,
  getComments,
  getArticleItemByMemberId,
  getArticleItemByArticleId,
  postArticleAddComments,
  postArticleAdd,
  postArticleItemByIdUpdate,
  getArticleItemByIdDel,
};
