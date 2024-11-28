const express = require("express");
const multer = require("multer");
const {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
  togglePublishStatus,
} = require("../controllers/blogController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Set up multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the folder where images will be stored
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Ensure unique file names
  },
});

const upload = multer({ storage: storage });

// Blog Routes
router.post("/create", verifyToken, upload.single("featuredImage"), createBlog);
router.get("/blogs", verifyToken, getAllBlogs);
router.get("/blogs/:id", verifyToken, getBlogById);
router.put(
  "/blogs/:id",
  verifyToken,
  upload.single("featuredImage"),
  updateBlog
);
router.delete("/blogs/:id", verifyToken, deleteBlog);
router.patch("/blogs/:id/publish", verifyToken, togglePublishStatus);
module.exports = router;
