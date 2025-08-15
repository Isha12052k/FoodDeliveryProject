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
    const restaurants = await Restaurant.find({ 
      owner: req.user.id,
      isDeleted: false
    });
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
//here is the get api
const getRestaurant = asyncHandler(async (req, res) => {
  try {
    console.log('Searching for restaurant:', {
      id: req.params.id,
      user: req.user.id
    });

    const restaurant = await Restaurant.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!restaurant) {
      console.log('No restaurant found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (restaurant.owner.toString() !== req.user.id) {
      console.log('Ownership mismatch:', {
        restaurantOwner: restaurant.owner,
        requestingUser: req.user.id
      });
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this restaurant'
      });
    }

    console.log('Restaurant found:', restaurant);
    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    console.error('Error fetching restaurant:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
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

module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant
};