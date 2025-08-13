const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant
} = require('../controllers/restaurantController');

router.route('/')
  .get(protect, getRestaurants)
  .post(protect, createRestaurant);

router.route('/:id')
  .get(protect, getRestaurant)
  .put(protect, updateRestaurant);

module.exports = router;