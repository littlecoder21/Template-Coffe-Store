const mongoose = require('mongoose');

const galleryItemSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  description: {
    en: { type: String },
    ar: { type: String }
  },
  image: {
    type: String,
    required: true
  },
  category: {
    en: { type: String, required: true },
    ar: { type: String, required: true }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GalleryItem', galleryItemSchema);