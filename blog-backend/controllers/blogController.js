const Blog = require("../models/Blog");
const path = require("path");

// Create a new blog post
exports.createBlog = async (req, res) => {
  const {
    title,
    keywords,
    metaDescription,
    content,
    categories,
    isPublished,
    scheduledAt,
  } = req.body;

  let featuredImage = req.file ? req.file.path : null; // Get the path of the uploaded image if any

  // Validation: Ensure required fields are present
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  try {
    const blog = new Blog({
      title,
      keywords,
      metaDescription,
      content,
      categories,
      featuredImage,
      isPublished,
      scheduledAt,
      createdBy: req.user.id, // Use user ID from the token
    });

    await blog.save();
    res.status(201).json({ message: "Blog created successfully", blog });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ error: "Error creating blog post", details: err.message });
  }
};

// Get all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error fetching blogs", details: err.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.status(200).json(blog);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error fetching blog", details: err.message });
  }
};

// Update a blog post
exports.updateBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    // Check if the logged-in user is the one who created the blog
    if (blog.createdBy.toString() !== req.user.id)
      return res
        .status(403)
        .json({ error: "Not authorized to update this blog" });

    // Handle featuredImage upload (if any)
    let updatedFeaturedImage = req.file ? req.file.path : blog.featuredImage;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { ...req.body, featuredImage: updatedFeaturedImage },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ message: "Blog updated successfully", updatedBlog });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error updating blog", details: err.message });
  }
};

// Delete a blog post
exports.deleteBlog = async (req, res) => {
  const { id } = req.params; // Get the blog ID from the route parameter

  try {
    // Check if the blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the logged-in user is the one who created the blog
    if (blog.createdBy.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this blog" });
    }

    // Proceed with deleting the blog
    await Blog.findByIdAndDelete(id);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    // Log the error to server logs for debugging
    console.error("Error deleting blog:", err);
    res
      .status(500)
      .json({ error: "Error deleting blog", details: err.message });
  }
};

// Publish/Unpublish a blog post
exports.togglePublishStatus = async (req, res) => {
  const { id } = req.params; // Get the blog ID from the route parameter

  try {
    // Check if the blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    // Check if the logged-in user is the one who created the blog
    if (blog.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        error:
          "You are not authorized to change the publish status of this blog",
      });
    }

    // Toggle the isPublished status
    blog.isPublished = !blog.isPublished;
    await blog.save(); // Save the updated blog

    res.status(200).json({
      message: `Blog ${
        blog.isPublished ? "published" : "unpublished"
      } successfully!`,
      blog: {
        _id: blog._id,
        title: blog.title,
        isPublished: blog.isPublished,
      },
    });
  } catch (err) {
    console.error("Error toggling publish status:", err);
    res.status(500).json({
      error: "Error toggling publish status",
      details: err.message,
    });
  }
};
