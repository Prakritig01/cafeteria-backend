require("dotenv").config();

const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Users = require("./../models/user.model");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
// const {authenticateToken} = require('./../middleware/auth');

const sessions = new Set();

const cors = require("cors");
router.use(cors());

router.post("/register", async (req, res) => {
  try {
    const { name, password, email } = req.body;

    // Check if user already exists
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists! Please login." });
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new Users({ 
      name, 
      password: hash, 
      email, 
      role: "customer" 
    });

    await newUser.save();

    return res.json({ message: "User Created Successfully!", user: newUser });

  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!", error: err.message });
  }
});


router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  // Find user and populate cart items
  const user = await Users.findOne({ email: email }).populate({
    path: "cart.dish", // Populates dish field inside cart
    model: "Dish",
  });

  if (!user) {
    return res.status(401).json({ message: "Incorrect username!" });
  }

  try {
    // Check the password safely
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({ message: "Incorrect password!" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong!" });
  }

  const userInfo = {
    id: user._id,
    // username: user.name,
    // email: user.email,
    // role: user.role,
    // cart: user.cart, // Now cart contains full dish details instead of just IDs
  };

  const token_data = { user: userInfo };
  const refresh_token = jwt.sign(token_data, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "24h", // Expiry set to 24 hours
  });

  sessions.add(refresh_token);

  return res.json({ refresh_token, user: userInfo });
});


router.post("/token", async (req, res) => {
  const refresh_token = req.body.token;
  // if(!refresh_token) return res.status(401).json({ message: "Unathorized!" });
  !sessions.has(refresh_token)
    ? res.status(400).json({ message: "You need to login" })
    : jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET,
        function (err, token_data) {
          if (err)
            return res
              .status(403)
              .json({ message: "Forbidden", error: err.message });
          const token = generateToken({ user: token_data.user });
          return res.json({ token });
        }
      );
});

router.delete("/logout", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const refresh_token = authHeader && authHeader.split(" ")[1];
  if (!sessions.has(refresh_token))
    return res.status(200).json({ message: "No op" });
  sessions.delete(refresh_token);
  // console.log("req.user", req.user);
  return res.json({ message: "Logged out!" });
});

router.get("/user", (req, res) => {
  const authHeader = req.headers["authorization"];
  const refreshToken = authHeader && authHeader.split(" ")[1];
  // console.log(refreshToken);
  // console.log("sessions", sessions);
  if (!refreshToken) return res.status(401).json({ message: "Unauthorized" });
  if (!sessions.has(refreshToken))
    return res.status(403).json({ message: "Forbidden" });
  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, data) => {
      if (err)
        return res
          .status(403)
          .json({ message: "Forbidden", error: err.message });
      const { user } = data;
      // console.log(username);
      // console.log("data", data);
      res.json({ user });
    }
  );
});

// function generateToken(data) {
//     return jwt.sign(data, process.env.REFRESH_TOKEN_SECRET, {
//       expiresIn: "24h",
//     });
//   }

module.exports = router;
