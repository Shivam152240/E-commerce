const express = require("express");
const router = express.Router();
const { getUserProfile, updateUserProfile, addAddress, getAddress, removeAddress, updateAddress } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);
router.post("/address", authMiddleware, addAddress);
router.get("/address", authMiddleware, getAddress);
router.delete("/address/:id", authMiddleware, removeAddress);
router.put("/address/:id", authMiddleware, updateAddress);
module.exports = router;
