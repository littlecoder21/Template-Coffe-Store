const express = require('express');
const GalleryItem = require('../models/GalleryItem');
const { authenticateToken, requireRole, adminApiLimiter } = require('../middleware/auth');
const router = express.Router();

// Get all gallery items with pagination
router.get('/', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const sortBy = req.query.sortBy || 'order';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    
    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { 'title.en': { $regex: search, $options: 'i' } },
        { 'title.ar': { $regex: search, $options: 'i' } },
        { 'description.en': { $regex: search, $options: 'i' } },
        { 'description.ar': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query['category.en'] = category;
    }

    // Get total count
    const total = await GalleryItem.countDocuments(query);
    
    // Get gallery items
    const galleryItems = await GalleryItem.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: galleryItems,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get gallery items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gallery items'
    });
  }
});

// Get single gallery item
router.get('/:id', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findById(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    console.error('Get gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gallery item'
    });
  }
});

// Create new gallery item
router.post('/', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      isActive,
      order
    } = req.body;

    // Validate required fields
    if (!title?.en || !title?.ar || !image || !category?.en || !category?.ar) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const galleryItem = new GalleryItem({
      title,
      description,
      image,
      category,
      isActive: isActive !== undefined ? isActive : true,
      order: order || 0
    });

    await galleryItem.save();

    res.status(201).json({
      success: true,
      message: 'Gallery item created successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Create gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item'
    });
  }
});

// Update gallery item
router.put('/:id', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const {
      title,
      description,
      image,
      category,
      isActive,
      order
    } = req.body;

    const updates = {};

    if (title) updates.title = title;
    if (description) updates.description = description;
    if (image) updates.image = image;
    if (category) updates.category = category;
    if (isActive !== undefined) updates.isActive = isActive;
    if (order !== undefined) updates.order = order;

    const galleryItem = await GalleryItem.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery item updated successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Update gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item'
    });
  }
});

// Delete gallery item
router.delete('/:id', authenticateToken, requireRole(['admin', 'manager']), async (req, res) => {
  try {
    const galleryItem = await GalleryItem.findByIdAndDelete(req.params.id);
    
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    console.error('Delete gallery item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item'
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
        result = await GalleryItem.deleteMany({ _id: { $in: ids } });
        break;
      case 'update':
        if (!updates) {
          return res.status(400).json({
            success: false,
            message: 'Updates required for bulk update operation'
          });
        }
        result = await GalleryItem.updateMany(
          { _id: { $in: ids } },
          { $set: updates }
        );
        break;
      case 'toggle-active':
        result = await GalleryItem.updateMany(
          { _id: { $in: ids } },
          [{ $set: { isActive: { $not: '$isActive' } } }]
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

// Reorder gallery items
router.post('/reorder', authenticateToken, requireRole(['admin', 'manager', 'editor']), async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required'
      });
    }

    const bulkOps = items.map((item, index) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: index } }
      }
    }));

    await GalleryItem.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: 'Gallery items reordered successfully'
    });
  } catch (error) {
    console.error('Reorder error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reorder gallery items'
    });
  }
});

// Get gallery statistics
router.get('/stats/overview', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const totalItems = await GalleryItem.countDocuments();
    const activeItems = await GalleryItem.countDocuments({ isActive: true });

    // Get category counts
    const categoryStats = await GalleryItem.aggregate([
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

    res.json({
      success: true,
      data: {
        totalItems,
        activeItems,
        categoryStats
      }
    });
  } catch (error) {
    console.error('Get gallery stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gallery statistics'
    });
  }
});

// Get categories
router.get('/categories/all', authenticateToken, adminApiLimiter, async (req, res) => {
  try {
    const categories = await GalleryItem.distinct('category.en');
    
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Get gallery categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get gallery categories'
    });
  }
});

module.exports = router;