const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Create menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private
const createMenuItem = asyncHandler(async (req, res) => {
  // Validate restaurant ownership
  const restaurant = await Restaurant.findOne({
    _id: req.params.restaurantId,
    owner: req.user.id
  });

  if (!restaurant) {
    res.status(403);
    throw new Error('Not authorized to add items to this restaurant');
  }

  // Create menu item
  const menuItem = await MenuItem.create({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    isVegetarian: req.body.isVegetarian === 'true',
    restaurant: req.params.restaurantId,
    image: req.file ? `/uploads/menu-items/${req.file.filename}` : null
  });

  res.status(201).json(menuItem);
});

// @desc    Get menu items
// @route   GET /api/restaurants/:restaurantId/menu
// @access  Public
const getMenuItems = asyncHandler(async (req, res) => {
  const menuItems = await MenuItem.find({ restaurant: req.params.restaurantId });
  res.status(200).json(menuItems);
});

module.exports = {
  createMenuItem,
  getMenuItems
};