require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000; // Default to 5000 if no PORT is set
const { authenticateToken } = require("./middleware/auth");
require("./connection/connectDB"); // Assuming you have MongoDB connection setup

// Import routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const cartRoutes = require("./routes/cart.routes");
const counterRoutes = require("./routes/counter.routes");
const dishRoutes = require("./routes/dish.routes");

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
// Protected routes (authentication required)
app.use(authenticateToken); // Apply authentication middleware here for protected routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Protected routes
app.use("/users", userRoutes);
app.use("/cart", cartRoutes);
app.use("/counter", counterRoutes);
app.use("/dishes", dishRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
