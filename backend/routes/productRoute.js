const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  addToCart,
  getUserCart,
  removeFromCart,
  updateCartQuantity,
  addReview
} = require("../controllers/productController");

const multer = require("multer");
const path = require("path");

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

router.post("/", upload.single("image"), addProduct); // Admin (with image upload)
router.get("/", getAllProducts);       // All products
router.post("/cart", protect, addToCart);
router.get("/cart", protect, getUserCart);
router.delete("/:id", deleteProduct);
router.delete("/cart/:id", protect, removeFromCart);
router.get("/:id", getSingleProduct);  // Single product
router.post("/review", protect, addReview);


module.exports = router;
