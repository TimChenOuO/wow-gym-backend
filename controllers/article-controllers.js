const db = require("../mySql-connect");
const moment = require('moment-timezone');
const HttpError = require("../models/http-error");


//取得文章資料
const getArticleItems = async (req, res) => {
  const [rows] = await db.query(`SELECT A.*,user.*,CASE when C.COUNT is not null then C.COUNT else 0 end as COUNT
  FROM article A INNER JOIN user ON A.memberId = user.id 
   LEFT JOIN (select articleId,count(*) as COUNT from articlecomments group by articleId) C 
   on A.articleId=C.articleId
   ORDER BY articleId DESC`
  );
  res.json(rows);
};

//文章詳細頁
const getArticleItemById = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM article  INNER JOIN user ON article.memberId = user.id WHERE article.articleId=${articleId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//取得留言資料
const getComments = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    //123
    // console.log(articleId);
    const [row] = await db.query(
      // `SELECT * FROM  (article INNER JOIN articlecomments ON articlecomments.articleId = article.articleId)INNER JOIN user ON article.memberId = user.memberId WHERE article.articleId=${articleId}`
      `SELECT C.*,U.memberNickname,U.memberImg FROM articlecomments C left join user U on U.id=C.memberId
      where C.articleId=${articleId} ORDER BY C.created_at DESC`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};

//取得會員發表文章資料
const getArticleItemByMemberId = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    console.log(memberId);
    const [row] = await db.query(
      `SELECT * FROM article  WHERE article.memberId=${memberId}`
    );
    if (!row) return next("Can't find article item4", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item4", 404));
  }
  const memberId = req.params.memberId
};

//取得會員發表文章個別項目資料
const getArticleItemByArticleId = async (req, res, next) => {
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT * FROM article  INNER JOIN user ON article.memberId = user.id WHERE article.articleId=${articleId}`
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};


//取得留言數目
const getCommentsNumber = async (req, res, next) => {
  // console.log(req.params.articleId)
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT COUNT(articleId) as COUNT FROM articlecomments where articlecomments.articleId=?`, [articleId]
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};



//取得熱門文章資料
const getHotData = async (req, res, next) => {
  // console.log(req.params.articleId)
  try {
    const articleId = req.params.articleId;
    // console.log(articleId);
    const [row] = await db.query(
      `SELECT A.*,CASE when C.COUNT is not null then C.COUNT else 0 end as COUNT
      FROM article A LEFT JOIN (select articleId,count(*) as COUNT from articlecomments group by articleId) C 
       on A.articleId=C.articleId
       ORDER BY A.articleLike desc, COUNT desc limit 6`, [articleId]
    );
    if (!row) return next("Can't find article item", 404);
    res.json(row);
  } catch (err) {
    return next(new HttpError("Can't find article item", 404));
  }
};




//傳送留言資料
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
const postArticleAdd= async (req, res) => {

  const output = {
    success: false,

  };

  console.log(req.body);
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
  // console.log(req.body);
  const sql = `UPDATE article SET ? WHERE articleId = ?`;
  db.query(sql, [req.body.data, articleId]).then(([r]) => {
    output.results = r;
    if (r.affectedRows) {
      output.success = true;
    }
    res.json(output);
  });
  //res.json(req.body);
};

//更新按讚次數
const postArticleLikeUpdate = async (req, res) => {
  const output = {
    success: false,
  };
  console.log(req.body)
  const sql = `UPDATE article SET articleLike=articleLike+1 WHERE articleId = ?`;
  db.query(sql, [
    req.body.articleId,
  ]).then(([r]) => {
    output.results = r;
    if (r.affectedRows) { //是否更新一筆
      output.success = true;
    }
    res.json(output);
  });
  // res.json(req.body);
};



module.exports = {
  getArticleItems,
  getArticleItemById,
  getComments,
  getArticleItemByMemberId,
  getArticleItemByArticleId,
  getCommentsNumber,
  getHotData,
  getArticleItemByIdDel,
  postArticleAddComments,
  postArticleAdd,
  postArticleItemByIdUpdate,
  postArticleLikeUpdate,
 
};