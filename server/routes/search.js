const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');

// Search menu items
router.get('/', async (req, res) => {
  try {
    const { q, category, language = 'en', minPrice, maxPrice } = req.query;
    
    let query = { isAvailable: true };
    
    // Text search in name and description
    if (q) {
      query.$or = [
        { [`name.${language}`]: { $regex: q, $options: 'i' } },
        { [`description.${language}`]: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query[`category.${language}`] = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    const menuItems = await MenuItem.find(query)
      .sort({ isFeatured: -1, createdAt: -1 })
      .limit(50);
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Advanced search with multiple filters
router.get('/advanced', async (req, res) => {
  try {
    const {
      q,
      category,
      language = 'en',
      minPrice,
      maxPrice,
      isDiscounted,
      isFeatured,
      allergens,
      tags
    } = req.query;
    
    let query = { isAvailable: true };
    
    // Text search
    if (q) {
      query.$or = [
        { [`name.${language}`]: { $regex: q, $options: 'i' } },
        { [`description.${language}`]: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ];
    }
    
    // Category filter
    if (category) {
      query[`category.${language}`] = category;
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // Discount filter
    if (isDiscounted === 'true') {
      query.isDiscounted = true;
    }
    
    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }
    
    // Allergens filter
    if (allergens) {
      const allergenList = allergens.split(',');
      query.$or = allergenList.map(allergen => ({
        [`allergens.${language}`]: { $regex: allergen.trim(), $options: 'i' }
      }));
    }
    
    // Tags filter
    if (tags) {
      const tagList = tags.split(',');
      query.tags = { $in: tagList.map(tag => tag.trim()) };
    }
    
    const menuItems = await MenuItem.find(query)
      .sort({ isFeatured: -1, discountPercentage: -1, createdAt: -1 })
      .limit(100);
    
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q, language = 'en' } = req.query;
    
    if (!q || q.length < 2) {
      return res.json([]);
    }
    
    const suggestions = await MenuItem.find({
      isAvailable: true,
      $or: [
        { [`name.${language}`]: { $regex: q, $options: 'i' } },
        { [`category.${language}`]: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } }
      ]
    })
    .select(`name.${language} category.${language} tags`)
    .limit(10);
    
    const uniqueSuggestions = [...new Set(suggestions.map(item => item.name[language]))];
    
    res.json(uniqueSuggestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;