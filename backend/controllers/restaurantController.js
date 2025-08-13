const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/Restaurant');

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

  // Validation
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
    openingHours: openingHours || [],
    owner: req.user.id
  });

  res.status(201).json({
    success: true,
    data: restaurant
  });
});

// @desc    Get all restaurants for logged-in owner
// @route   GET /api/restaurants
// @access  Private
const getRestaurants = asyncHandler(async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ owner: req.user.id });
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    res.status(500).json({ 
      message: 'Server error while fetching restaurants',
      error: error.message 
    });
  }
});

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Private
const getRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    owner: req.user.id
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  res.status(200).json(restaurant);
});

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private
const updateRestaurant = asyncHandler(async (req, res) => {
  const { 
    name,
    description,
    cuisineType,
    address,
    contact,
    openingHours
  } = req.body;

  const restaurant = await Restaurant.findOne({
    _id: req.params.id,
    owner: req.user.id
  });

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  // Update fields
  restaurant.name = name || restaurant.name;
  restaurant.description = description || restaurant.description;
  restaurant.cuisineType = cuisineType || restaurant.cuisineType;
  restaurant.address = address || restaurant.address;
  restaurant.contact = contact || restaurant.contact;
  restaurant.openingHours = openingHours || restaurant.openingHours;

  const updatedRestaurant = await restaurant.save();

  res.status(200).json({
    success: true,
    data: updatedRestaurant
  });
});

// @desc    Soft delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOneAndUpdate(
    {
      _id: req.params.id,
      owner: req.user.id,
      isDeleted: false
    },
    {
      isDeleted: true,
      deletedAt: new Date()
    },
    { new: true }
  );

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found or already deleted');
  }

  res.status(200).json({
    success: true,
    message: 'Restaurant deleted successfully',
    data: restaurant
  });
});

// Update exports
module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
};