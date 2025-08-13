const Restaurant = require('../models/Restaurant');
const asyncHandler = require('express-async-handler');

// @desc    Create new restaurant
// @route   POST /api/restaurants
// @access  Private
const createRestaurant = asyncHandler(async (req, res) => {
  const { 
    name,
    description,
    cuisineType,
    address,
    contact,
    openingHours
  } = req.body;

  // Basic validation
  if (!name || !description || !cuisineType || !address || !contact) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  // Create restaurant
  const restaurant = await Restaurant.create({
    name,
    description,
    cuisineType,
    address,
    contact,
    openingHours,
    owner: req.user.id
  });

  res.status(201).json({
    success: true,
    data: restaurant
  });
});

module.exports = {
  createRestaurant
};