const db = require("../mySql-connect");
const HttpError = require("../models/http-error");
const express = require("express");
const router = express.Router();
const moment = require('moment-timezone');


const GetApi = async (req) => {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;
    const output = {
        // page: page,
        perPage: perPage,
        totalRows: 0, // 總共有幾筆資料
        totalPages: 0, //總共有幾頁
        rows: []
    }
    const [r1] = await db.query("SELECT COUNT(1) num FROM orders");
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(output.totalRows / perPage);
    if (page < 1) page = 1;
    if (page > output.totalPages) page = output.totalPages;
    if (output.totalPages === 0) page = 0;
    output.page = page;

    if (!output.page) {
        return output;
    }
    const sql = `SELECT orderId,created_at,orders.Total,PayMentMethod,OrderStatus,checkoutpage.UserName,checkoutpage.City,checkoutpage.district,checkoutpage.mobile,checkoutpage.address,checkoutpage.email,checkoutpage.recipientUserName,checkoutpage.recipientCity,checkoutpage.recipientDistrict,checkoutpage.recipientMobile,checkoutpage.recipientAddress,checkoutpage.recipientEmail, orderitemlist.ItemName, orderitemlist.ItemNamePrice, orderitemlist.itemQuantity, orderitemlist.itemType FROM orders INNER JOIN checkoutpage INNER JOIN orderitemlist WHERE checkoutpage.MemberId = orderitemlist.MemberId ORDER BY orderId DESC LIMIT ${(page - 1) * perPage}, ${perPage}`
    const [r2] = await db.query(sql);
    if (r2) output.rows = r2;
    for (let i of r2) {
        // console.log(i.created_at)
        i.created_at = moment(i.created_at).format('YYYY-MM-DD');
    }
    return output;
};

router.get('/api/OrderListDeatail', async (req, res) => {
    const output = await GetApi(req);
    res.json(output);
    // console.log(output)
})

const GetDeatailApi = async (req) => {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;
    const output = {
        // page: page,
        perPage: perPage,
        totalRows: 0, // 總共有幾筆資料
        totalPages: 0, //總共有幾頁
        rows: []
    }
    const [r1] = await db.query("SELECT COUNT(1) num FROM orders");
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(output.totalRows / perPage);
    if (page < 1) page = 1;
    if (page > output.totalPages) page = output.totalPages;
    if (output.totalPages === 0) page = 0;
    output.page = page;

    if (!output.page) {
        return output;
    }

    const sql = `SELECT * FROM orders`
    const [r2] = await db.query(sql);
    if (r2) output.rows = r2;
    for (let i of r2) {
        // console.log(i.created_at)
        i.created_at = moment(i.created_at).format('YYYY-MM-DD');
    }
    return output;
};

router.get('/api/OrderList', async (req, res) => {
    const output = await GetDeatailApi(req);
    res.json(output);
    // console.log(output)
})
// router.post('/api/del/:orderId', (req, res) => {
//     const sql = "DELETE FROM `orders` WHERE orderId=?";
//     console.log(req)
//     db.query(sql, [req.params.orderId])

// })
router.post('/api/del/:orderId', (req, res) => {
    const sql = "UPDATE `orders` SET `OrderStatus` = '2' WHERE `orders`.`orderId` = ?";
    console.log(req.body)
    db.query(sql, [req.params.orderId])

})

const Getcheckoutpage = async (req) => {
    const output = {
        rows: []
    }
    const sql = "SELECT * FROM `checkoutpage`"
    const [r2] = await db.query(sql);
    if (r2) output.rows = r2;
    for (let i of r2) {
        // console.log(i.created_at)
        i.created_at = moment(i.created_at).format('YYYY-MM-DD');
    }
    return output;
};
router.get('/api/addCheckOutPage', async (req, res) => {
    const output = await Getcheckoutpage(req);
    res.json(output);
    // console.log(output)
})


router.get('/api/test', async (req, res) => {
    console.log(res)
    const output = {
        success: false
    }
    const sql = "SELECT * FROM `checkoutpage`"
    db.query(sql)
        .then(([r]) => {
            output.results = r;
            if (r.affectedRows && r.insertId) {
                output.success = true;
            }
            res.json(output);
        })
})


router.post('/api/addCheckOutPage', (req, res) => {
    console.log('data' + req.body.data.Member)
    const output = {
        success: false
    }
    const sql = "INSERT INTO `checkoutpage` (`MemberId`,`UserName`, `City`, `district`, `mobile`, `address`, `email`, `recipientUserName`, `recipientCity`, `recipientDistrict`, `recipientMobile`, `recipientAddress`, `recipientEmail`) VALUES (?,?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?)";
    db.query(sql, [req.body.data.Member, req.body.data.Name, req.body.data.City, req.body.data.District, req.body.data.Mobile, req.body.data.Address, req.body.data.Email, req.body.data.recipientName, req.body.data.recipientSelect, req.body.data.recipientDistrict, req.body.data.recipientMobile, req.body.data.recipientAddress, req.body.data.recipientEmail])
        .then(([r]) => {
            output.results = r;
            if (r.affectedRows && r.insertId) {
                output.success = true;
            }
            res.json(output);
        })
    //res.json(req.body);
})

router.post('/api/additem', (req, res) => {
    // console.log('addit' + req.body.Total)
    const output = {
        success: false
    }

    for (let i of req.body.cartItems) {
        i.total = req.body.Total
    }
    for (let i of req.body.cartItems) {
        i.MemberId = req.body.Member
    }

    // console.log(req.body.cartItems)
    const sql = "INSERT INTO `orderitemlist`(`MemberId`,`ItemName`, `ItemNamePrice`, `Total` ,`itemType`, `itemImg`, `itemQuantity`, `itemFlavor`, `itemCollection`, `itemEnglishName`, `itemEnglishFlavor`)  VALUES (?,?,?, ?, ?, ?, ?, ? , ?, ?, ?)"
    req.body.cartItems.forEach(element => {
        db.query(sql, [element.MemberId, element.name, element.price, element.total, element.itemType, element.img1, element.quantity, element.flavor, element.itemCollection, element.englishName,
        element.englishFlavor])
    })
        .then(([r]) => {
            output.results = r;
            if (r.affectedRows && r.insertId) {
                output.success = true;
            }
            res.json(output);
        })
    //res.json(req.body);
})

router.post('/api/orders', (req, res) => {
    const sql = "INSERT INTO `orders`(`Total`, `PayMentMethod`, `MemberId`,`OrderStatus`, `CustomerService`, `CancelStatus`) VALUES (?,?,?,2,2,2)"
    db.query(sql, [req.body.orders.Total, req.body.orders.pay, req.body.orders.Member])
})






module.exports = router;