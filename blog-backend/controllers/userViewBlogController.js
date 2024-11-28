const Blog = require("../models/Blog");

// Get all published blogs (ordered by serialNumber)
exports.userViewAllBlogs = async (req, res) => {
  try {
    // Fetch all published blogs and sort by serialNumber
    const blogs = await Blog.find({ isPublished: true }).sort({
      serialNumber: 1,
    });

    if (blogs.length === 0) {
      return res.status(404).json({ error: "No published blogs found." });
    }

    res.status(200).json(blogs);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error fetching blogs", details: err.message });
  }
};

// Get a single published blog by ID
exports.userViewBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch a blog by ID only if it's published
    const blog = await Blog.findOne({ _id: id, isPublished: true });

    if (!blog) {
      return res
        .status(404)
        .json({ error: "Blog not found or is not published." });
    }

    res.status(200).json(blog);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error fetching blog", details: err.message });
  }
};
