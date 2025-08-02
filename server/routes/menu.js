const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Get all menu items
router.get('/', async (req, res) => {
  try {
    const { category, language = 'en' } = req.query;
    let query = { isAvailable: true };
    
    if (category) {
      query[`category.${language}`] = category;
    }
    
    const menuItems = await MenuItem.find(query).sort({ order: 1, createdAt: -1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get menu items by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { language = 'en' } = req.query;
    
    const menuItems = await MenuItem.find({
      [`category.${language}`]: category,
      isAvailable: true
    }).sort({ order: 1, createdAt: -1 });
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get discounted items for hero slider
router.get('/discounted', async (req, res) => {
  try {
    const discountedItems = await MenuItem.find({
      isDiscounted: true,
      isAvailable: true
    }).sort({ discountPercentage: -1 });
    
    res.json(discountedItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get featured items
router.get('/featured', async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({
      isFeatured: true,
      isAvailable: true
    }).sort({ createdAt: -1 });
    
    res.json(featuredItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single menu item
router.get('/:id', async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all categories
router.get('/categories/all', async (req, res) => {
  try {
    const { language = 'en' } = req.query;
    const categories = await MenuItem.distinct(`category.${language}`);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;