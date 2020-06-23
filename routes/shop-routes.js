const express = require("express");

const {
  getShopItems,
  getShopCollection,
  getShopItemTpye,
  getShopItemByItemId,
} = require("../controllers/shop-controllers");

const router = express.Router();

router.get("/", getShopItems);
router.get("/:collection", getShopCollection);
router.get("/shopitem/:itemType", getShopItemTpye); // filter of itemType route
router.get("/detail/:itemId", getShopItemByItemId);




module.exports = router;
