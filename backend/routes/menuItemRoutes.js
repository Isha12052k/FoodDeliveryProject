const express = require('express');
const router = express.Router();
const { 
  createMenuItem, 
  getMenuItems,
  getMenuItem,
  updateMenuItem,
  deleteMenuItem
} = require('../controllers/menuItemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/:restaurantId/menu')
  .get(getMenuItems)
  .post(protect, upload.single('image'), createMenuItem);

router.route('/:restaurantId/menu/:id')
  .get(getMenuItem)
  .put(protect, upload.single('image'), updateMenuItem)
  .delete(protect, deleteMenuItem);

module.exports = router;