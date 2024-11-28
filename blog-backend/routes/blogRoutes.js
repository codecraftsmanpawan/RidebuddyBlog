const express = require("express");
const router = express.Router();
const userViewBlogController = require("../controllers/userViewBlogController");

// Routes for fetching published blogs
router.route("/").get(userViewBlogController.userViewAllBlogs);
router.route("/:id").get(userViewBlogController.userViewBlogById);

module.exports = router;
