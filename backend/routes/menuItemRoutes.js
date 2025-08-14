const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createMenuItem, getMenuItems } = require('../controllers/menuItemController');
const upload = require('../middleware/uploadMiddleware');

router.route('/:restaurantId/menu')
  .get(getMenuItems)
  .post(protect, upload.single('image'), createMenuItem);

module.exports = router;