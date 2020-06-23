const express = require("express");
const {
    getapi,
    getOrderList,
    UpdateOrderStatus,
    addCheckOutPage,
    test,
    InsertCheckOutPage,
    additem,
    ordres,
    OrderCompeleted,
    address,

} = require("../controllers/Orders-controllers");

const router = express.Router();

router.get('/api/OrderListDeatail', getapi)
router.get('/api/OrderList', getOrderList)
router.get('/api/addCheckOutPage', addCheckOutPage)
router.get('/api/test', test)
router.get('/api/OrderCompeleted/', OrderCompeleted)
router.get('/api/address', address)


router.post('/api/addCheckOutPage', InsertCheckOutPage)
router.post('/api/additem', additem)
router.post('/api/orders', ordres)
router.post('/api/del/:orderId', UpdateOrderStatus)


module.exports = router;
