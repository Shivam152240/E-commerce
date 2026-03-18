const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  cancelOrder
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getMyOrders);
router.put("/cancel/:id", authMiddleware, cancelOrder);

module.exports = router;
