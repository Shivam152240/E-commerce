const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const adminRoutes = require('./routes/adminRoutes');
require("dotenv").config();
dotenv.config();
console.log("Loaded URI:", process.env.MONGO_URI);
const app = express();


/* ================= MIDDLEWARES ================= */
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // React (Vite)
  credentials: true
}));

app.use(express.json()); // 🔥 MOST IMPORTANT
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ================= DATABASE ================= */
const connectDB = require('./config/db');
connectDB();

/* ================= ROUTES ================= */
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/banners", require("./routes/bannerRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/orders", require("./routes/orderRoute"));
app.use("/api/categories", require("./routes/categoryRoute"));
app.use("/api/admin", adminRoutes);



/* ================= PRODUCTION SETUP ================= */
const frontendPath = path.join(__dirname, '../frontend/dist');
const fs = require('fs');

if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Backend is running. Please run "npm run build" to serve the frontend.');
  });
}

/* ================= SERVER ================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
