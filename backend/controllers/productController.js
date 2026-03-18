const Product = require("../models/product");
const Cart = require("../models/cart"); // import karna mat bhoolna
const Review = require("../models/review");

// ADD PRODUCT (Admin)
// ADD PRODUCT (Admin)
exports.addProduct = async (req, res) => {
  try {
    const { title, price, category } = req.body;
    let imageUrl = "";

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      title,
      price,
      category,
      image: imageUrl, // Save to 'image' field as per schema
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE PRODUCT
exports.getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};

//  delete controller
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    // Check if item already exists in cart for this user
    let cartItem = await Cart.findOne({ userId: req.user.id, productId });
    
    if (cartItem) {
      cartItem.quantity += Number(quantity);
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        userId: req.user.id,
        productId,
        quantity,
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE CART QUANTITY
exports.updateCartQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
       return res.status(400).json({ message: "Quantity cannot be less than 1" });
    }

    const cartItem = await Cart.findByIdAndUpdate(id, { quantity }, { new: true });
    
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({
      userId: req.user.id,
    }).populate("productId");

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const cartItem = await Cart.findByIdAndDelete(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }
    res.json({ message: "Cart item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    const newReview = await Review.create({
      productId,
      userId: req.user.id,
      rating: Number(rating),
      review,
    });

    // Automatically recalculate and update product's overall rating
    const allReviews = await Review.find({ productId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    product.rating = totalRating / allReviews.length;
    await product.save();

    res.status(201).json(newReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
