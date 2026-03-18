const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  link: {
    type: String,
    default: '/'
  },
  type: {
    type: String,
    enum: ['promo-grid', 'hero'],
    default: 'promo-grid'
  },
  slot: {
    type: Number, // 0 for hero, 1-3 for promo-grid
    required: true
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
