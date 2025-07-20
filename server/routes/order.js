const express = require("express");
const Order = require("../models/Order");
const router = express.Router();
const isAdmin = require("../middleware/admin");

// Save order after payment
const sendOrderEmail = require("../utils/mailer");

router.post("/save-order", async (req, res) => {
  try {
    const { productId, userId, paymentId, amount, status } = req.body;

    const order = new Order({
      product: productId,
      user: userId,
      paymentId,
      amount,
      status,
    });
    console.log("Saving order with data:", req.body);
    await order.save();

    // Fetch user and product details for the email
    const user = await require("../models/User").findById(userId);
    const product = await require("../models/Product").findById(productId);

    // Send email to admin
    await sendOrderEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "🛒 New Order Placed!",
      text: `A new order has been placed by ${user.displayName} (${user.email}) for product: ${product.name}.`,

      html: `
  <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px;">
    <div style="max-width: 480px; margin: auto; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.07); padding: 32px;">
      <h2 style="color: #1976d2; margin-bottom: 16px;">🛒 New Order Placed!</h2>
      <p style="font-size: 16px; color: #333;">
        <b>User:</b> ${user.displayName} (<a href="mailto:${user.email}" style="color:#1976d2;">${user.email}</a>)
      </p>
      <p style="font-size: 16px; color: #333;">
        <b>Product:</b> ${product.name}
      </p>
      <p style="font-size: 16px; color: #333;">
        <b>Amount:</b> <span style="color: #388e3c;">₹${amount}</span>
      </p>
      <p style="font-size: 16px; color: #333;">
        <b>Payment ID:</b> <span style="color: #1976d2;">${paymentId}</span>
      </p>
      <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 14px; color: #888;">
        This is an automated notification from your MERN E-commerce app.<br>
        <span style="color: #1976d2;">Thank you for using our platform!</span>
      </p>
    </div>
  </div>
`,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protect this route with isAdmin

// Get all orders with user and product details
router.get("/all-orders", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "displayName email") // Only get displayName and email
      .populate("product", "name price"); // Only get name and price
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
