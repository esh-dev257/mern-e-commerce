const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");
const Razorpay = require("razorpay");
require("dotenv").config();
require("./passport");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, 
  })
);

app.use(passport.initialize());
app.use(passport.session());


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
    res.redirect("http://localhost:3000");
  }
);

app.get("/api/current_user", (req, res) => {
  console.log("Current user:", req.user);
  res.send(req.user);
});

const orderRoutes = require("./routes/order");
app.use("/api", orderRoutes);
const productRoutes = require("./routes/products");
app.use("/api/products", productRoutes);

app.get("/api/logout", (req, res) => {
  req.logout(() => {
    res.send({ success: true });
  });
});

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
