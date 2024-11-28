const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose);

// Blog schema
const blogSchema = new mongoose.Schema({
  serialNumber: {
    type: Number,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    required: false,
  },
  metaDescription: {
    type: String,
    required: false,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: [String],
    required: false,
  },
  featuredImage: {
    type: String,
    required: false,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  scheduledAt: {
    type: Date,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Apply the mongoose-sequence plugin to handle auto-increment for serialNumber
blogSchema.plugin(mongooseSequence, { inc_field: "serialNumber" });

// Middleware to update 'updatedAt' field on any modification
blogSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Blog", blogSchema);
