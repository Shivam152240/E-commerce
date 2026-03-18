const Order = require("../models/Order");

// PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const order = await Order.create({
      userId: req.user.id,
      products: req.body.products,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      shippingAddress: req.body.shippingAddress
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
       .populate("products.productId")
       .sort({ createdAt: -1 }); // Show latest orders first
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, userId: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({ message: "Order cannot be cancelled now" });
    }

    order.orderStatus = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
