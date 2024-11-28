const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

// Import routes
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const userViewBlogRoutes = require("./routes/blogRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files (e.g., images)
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// API routes
app.use("/api/blogs/view", userViewBlogRoutes);
app.use("/api", adminRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error stack:", err.stack);
  res.status(err.status || 500).send({
    error: err.message || "Something went wrong!",
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
