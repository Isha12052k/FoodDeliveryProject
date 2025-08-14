const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');

// @desc    Create a menu item
// @route   POST /api/restaurants/:restaurantId/menu
// @access  Private (Restaurant Owner)
const createMenuItem = asyncHandler(async (req, res) => {
  const { name, description, price, category, isVegetarian } = req.body;
  const restaurantId = req.params.restaurantId;

  // Validate restaurant ownership (ensure user owns the restaurant)
  const restaurant = await Restaurant.findOne({
    _id: restaurantId,
    owner: req.user.id
  });
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found or unauthorized');
  }

  const menuItem = await MenuItem.create({
    name,
    description,
    price,
    category,
    isVegetarian,
    restaurant: restaurantId,
    image: req.file ? req.file.path : undefined // If using Multer for uploads
  });

  res.status(201).json(menuItem);
});

// @desc    Get all menu items for a restaurant
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