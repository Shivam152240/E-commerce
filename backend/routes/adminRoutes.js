const express = require('express');
const User = require("../models/User.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");
const { getAllUsers, toggleBlockUser } = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/users", getAllUsers);
router.put("/users/:id/block", toggleBlockUser);

router.get("/dashboard/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find();
    const totalSales = orders.reduce((acc, order) => acc + order.totalAmount, 0);

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales
    });

  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().populate("products.productId").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});



router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, price, category } = req.body;

    let updateData = {
      title,
      price,
      category,
    };

    if (req.file) {
      updateData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
