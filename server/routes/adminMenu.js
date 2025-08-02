const express = require('express');
const MenuItem = require('../models/MenuItem');
const { authenticateToken, requireRole, adminApiLimiter } = require('../middleware/auth');
const router = express.Router();

// Get all menu items with pagination
router.get('/', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { 'name.en': { $regex: search, $options: 'i' } },
        { 'name.ar': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ar': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query['category.en'] = category;
    }

    // Get total count
    const total = await MenuItem.countDocuments(query);
    
    // Get menu items
    const menuItems = await MenuItem.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: menuItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get menu items'
    });
  }
});

// Get single menu item
router.get('/:id', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      data: menuItem
    });
  } catch (error) {
    console.error('Get menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get menu item'
    });
  }
});

// Create new menu item
router.post('/', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      image,
      isDiscounted,
      discountPercentage,
      ingredients,
      allergens,
      nutritionalInfo,
      isAvailable,
      isFeatured,
      tags
    } = req.body;

    // Validate required fields
    if (!name?.en || !name?.ar || !description?.en || !description?.ar || !category?.en || !category?.ar || !price) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const menuItem = new MenuItem({
      name,
      description,
      category,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      image,
      isDiscounted: isDiscounted || false,
      discountPercentage: discountPercentage || 0,
      ingredients,
      allergens,
      nutritionalInfo,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      isFeatured: isFeatured || false,
      tags: tags || []
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: 'Menu item created successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create menu item'
    });
  }
});

// Update menu item
router.put('/:id', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      originalPrice,
      image,
      isDiscounted,
      discountPercentage,
      ingredients,
      allergens,
      nutritionalInfo,
      isAvailable,
      isFeatured,
      tags
    } = req.body;

    const updates = {};

    if (name) updates.name = name;
    if (description) updates.description = description;
    if (category) updates.category = category;
    if (price !== undefined) updates.price = parseFloat(price);
    if (originalPrice !== undefined) updates.originalPrice = originalPrice ? parseFloat(originalPrice) : null;
    if (image) updates.image = image;
    if (isDiscounted !== undefined) updates.isDiscounted = isDiscounted;
    if (discountPercentage !== undefined) updates.discountPercentage = discountPercentage;
    if (ingredients) updates.ingredients = ingredients;
    if (allergens) updates.allergens = allergens;
    if (nutritionalInfo) updates.nutritionalInfo = nutritionalInfo;
    if (isAvailable !== undefined) updates.isAvailable = isAvailable;
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (tags) updates.tags = tags;

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item updated successfully',
      data: menuItem
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update menu item'
    });
  }
});

// Delete menu item
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    res.json({
      success: true,
      message: 'Menu item deleted successfully'
    });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete menu item'
    });
  }
});

// Bulk operations
router.post('/bulk', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const { action, ids, updates } = req.body;

    if (!action || !ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid bulk operation parameters'
      });
    }

    let result;

    switch (action) {
      case 'delete':
        result = await MenuItem.deleteMany({ _id: { $in: ids } });
        break;
      case 'update':
        if (!updates) {
          return res.status(400).json({
            success: false,
            message: 'Updates required for bulk update operation'
          });
        }
        result = await MenuItem.updateMany(
          { _id: { $in: ids } },
          { $set: updates }
        );
        break;
      case 'toggle-availability':
        result = await MenuItem.updateMany(
          { _id: { $in: ids } },
          [{ $set: { isAvailable: { $not: '$isAvailable' } } }]
        );
        break;
      case 'toggle-featured':
        result = await MenuItem.updateMany(
          { _id: { $in: ids } },
          [{ $set: { isFeatured: { $not: '$isFeatured' } } }]
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      data: result
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk operation'
    });
  }
});

// Get menu statistics
router.get('/stats/overview', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const totalItems = await MenuItem.countDocuments();
    const availableItems = await MenuItem.countDocuments({ isAvailable: true });
    const featuredItems = await MenuItem.countDocuments({ isFeatured: true });
    const discountedItems = await MenuItem.countDocuments({ isDiscounted: true });

    // Get category counts
    const categoryStats = await MenuItem.aggregate([
      {
        $group: {
          _id: '$category.en',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    // Get price range stats
    const priceStats = await MenuItem.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        availableItems,
        featuredItems,
        discountedItems,
        categoryStats,
        priceStats: priceStats[0] || { avgPrice: 0, minPrice: 0, maxPrice: 0 }
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics'
    });
  }
});

// Get categories
router.get('/categories/all', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category.en');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories'
    });
  }
});

module.exports = router;