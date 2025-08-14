const express = require('express');
const router = express.Router();
const { 
  createMenuItem, 
  getMenuItems,
  getMenuItem,
  updateMenuItem
} = require('../controllers/menuItemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/:restaurantId/menu')
  .get(getMenuItems)
  .post(protect, upload.single('image'), createMenuItem);

router.route('/:restaurantId/menu/:id')
  .get(getMenuItem)
  .put(protect, upload.single('image'), updateMenuItem);

module.exports = router;