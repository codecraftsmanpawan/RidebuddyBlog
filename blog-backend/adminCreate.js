const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

// Load environment variables
dotenv.config();

// Function to create admin user
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ username: "admin" });
    if (existingUser) {
      console.log("Admin user already exists.");
    } else {
      // Create a new admin user
      const admin = new User({
        username: "admin",
        password: "admin123",
      });
      await admin.save();
      console.log("Admin user created successfully.");
    }
    mongoose.connection.close(); // Close the database connection
  } catch (error) {
    console.error("Error creating admin user:", error);
    mongoose.connection.close();
  }
};

// Connect to MongoDB and create admin user
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
    return createAdminUser();
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    mongoose.connection.close();
  });
