const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  image: {
    type: String, // URL to uploaded image
    default: 'no-photo.jpg'
  },
  category: {
    type: String,
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Other'],
    required: true
  },
  isVegetarian: {
    type: Boolean,
    default: false
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index for faster querying by restaurant
menuItemSchema.index({ restaurant: 1 }); // Faster querying by restaurant
menuItemSchema.index({ category: 1 });   // Optional: For filtering by category

module.exports = mongoose.model('MenuItem', menuItemSchema);