const User = require("../models/User");
const Address = require("../models/address");

// GET ALL USERS (Admin)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET USER PROFILE
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// user address
exports.addAddress = async (req, res) => {
  try {
    const { name, phone, pincode, city, state, address } = req.body;
    if (!name || !phone || !pincode || !city || !state || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAddress = new Address({
      user: req.user.id,
      name,
      phone,
      pincode,
      city,
      state,
      address
    });
    await newAddress.save();
    res.json(newAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// get user address
exports.getAddress = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// remove user address
exports.removeAddress = async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json({ message: "Address removed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// update user address
exports.updateAddress = async (req, res) => {
  try {
    const { name, phone, pincode, city, state, address } = req.body;
    if (!name || !phone || !pincode || !city || !state || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedAddress = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    if (!updatedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE USER PROFILE
exports.updateUserProfile = async (req, res) => {
  try {
    const { username, email } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (username) user.username = username;
    if (email) user.email = email;

    const updatedUser = await user.save();
    
    // Return user without password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already in use" });
    }
    res.status(500).json({ error: error.message });
  }
};
// TOGGLE USER BLOCK STATUS (Admin)
exports.toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isAdmin) {
      return res.status(400).json({ message: "Admin users cannot be blocked" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ 
      message: `User ${user.isBlocked ? 'blocked' : 'unblocked'} successfully`, 
      user: { _id: user._id, username: user.username, isBlocked: user.isBlocked } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
