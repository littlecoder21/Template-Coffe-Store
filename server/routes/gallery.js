const express = require('express');
const router = express.Router();
const GalleryItem = require('../models/GalleryItem');

// Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { category, language = 'en' } = req.query;
    let query = { isActive: true };
    
    if (category) {
      query[`category.${language}`] = category;
    }
    
    const galleryItems = await GalleryItem.find(query).sort({ order: 1, createdAt: -1 });
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get gallery items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { language = 'en' } = req.query;
    
    const galleryItems = await GalleryItem.find({
      [`category.${language}`]: category,
      isActive: true
    }).sort({ order: 1, createdAt: -1 });
    
    res.json(galleryItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single gallery item
router.get('/:id', async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(galleryItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all gallery categories
router.get('/categories/all', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const categories = await GalleryItem.distinct(`category.${language}`);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;