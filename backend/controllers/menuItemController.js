const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

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

// @desc    Update menu item
// @route   PUT /api/restaurants/:restaurantId/menu/:id
// @access  Private
const updateMenuItem = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.restaurantId,
    owner: req.user.id
  });

  if (!restaurant) {
    res.status(403);
    throw new Error('Not authorized to modify items in this restaurant');
  }

  const menuItem = await MenuItem.findOne({
    _id: req.params.id,
    restaurant: req.params.restaurantId
  });

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Update fields
  menuItem.name = req.body.name || menuItem.name;
  menuItem.description = req.body.description || menuItem.description;
  menuItem.price = req.body.price || menuItem.price;
  menuItem.category = req.body.category || menuItem.category;
  menuItem.isVegetarian = req.body.isVegetarian === 'true' || menuItem.isVegetarian;
  
  if (req.file) {
    // Delete old image if exists
    if (menuItem.image) {
      const oldImagePath = path.join(__dirname, '../public', menuItem.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
    menuItem.image = `/uploads/menu-items/${req.file.filename}`;
  }

  const updatedMenuItem = await menuItem.save();
  res.status(200).json(updatedMenuItem);
});

// @desc    Get single menu item
// @route   GET /api/restaurants/:restaurantId/menu/:id
// @access  Public
const getMenuItem = asyncHandler(async (req, res) => {
  const menuItem = await MenuItem.findOne({
    _id: req.params.id,
    restaurant: req.params.restaurantId
  });

  if (!menuItem) {
    res.status(404);
    throw new Error('Menu item not found');
  }

  res.status(200).json(menuItem);
});

// @desc    Delete menu item
// @route   DELETE /api/restaurants/:restaurantId/menu/:id
// @access  Private
const deleteMenuItem = asyncHandler(async (req, res) => {
  console.log(`Deleting menu item ${req.params.id} from restaurant ${req.params.restaurantId}`);

  // Verify restaurant ownership
  const restaurant = await Restaurant.findOne({
    _id: req.params.restaurantId,
    owner: req.user.id
  });

  if (!restaurant) {
    console.log('Deletion failed - restaurant not found or not owned by user');
    res.status(403);
    throw new Error('Not authorized to modify items in this restaurant');
  }

  // Find and delete the menu item
  const menuItem = await MenuItem.findOneAndDelete({
    _id: req.params.id,
    restaurant: req.params.restaurantId
  });

  if (!menuItem) {
    console.log('Menu item not found in database');
    res.status(404);
    throw new Error('Menu item not found');
  }

  // Delete associated image file if exists
  if (menuItem.image) {
    const imagePath = path.join(__dirname, '../public', menuItem.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log('Deleted image file:', imagePath);
    }
  }

  console.log('Successfully deleted menu item:', menuItem);
  res.status(200).json({ 
    success: true, 
    data: menuItem 
  });
});

module.exports = {
  createMenuItem,
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
};