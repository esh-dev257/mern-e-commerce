// server/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const Razorpay = require("razorpay");
require("dotenv").config();
require("./passport"); // Import passport config

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

const paymentRoutes = require("./routes/payment");
app.use("/api", paymentRoutes);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend after successful login
    res.redirect("http://localhost:3000");
  }
);

// Route to get current user
app.get("/api/current_user", (req, res) => {
  console.log("Current user:", req.user);
  res.send(req.user);
});

const orderRoutes = require("./routes/order");
app.use("/api", orderRoutes);
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

// Logout route
app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});

// MongoDB connection and server start (same as before)
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
