const express = require('express');
const router = express.Router();
const { createRestaurant } = require('../controllers/restaurantController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createRestaurant);

module.exports = router;