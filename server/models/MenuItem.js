const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  category: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number,
    default: null
  },
  image: {
    type: String,
    required: true
  },
  isDiscounted: {
    type: Boolean,
    default: false
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  ingredients: {
    en: [String],
    ar: [String]
  },
  allergens: {
    en: [String],
    ar: [String]
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('MenuItem', menuItemSchema);