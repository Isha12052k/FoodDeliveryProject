const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const restaurantRoutes = require('./routes/restaurantRoutes');
const menuItemRoutes = require('./routes/menuItemRoutes');
const uploadMiddleware = require('./middleware/uploadMiddleware');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use(express.json());

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Routes
app.get('/debug-image-path', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'images', 'placeholder-food.jpg');
  const publicPath = path.join(__dirname, 'public');
  
  try {
    res.json({
      exists: fs.existsSync(imagePath),
      imagePath: imagePath,
      publicPath: publicPath,
      publicDirContents: fs.readdirSync(publicPath),
      imagesDirContents: fs.readdirSync(path.join(publicPath, 'images')),
      currentDir: __dirname,
      staticConfig: {
        public: app._router.stack.filter(layer => layer.name === 'serveStatic').map(layer => layer.regexp)
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.use('/api/auth', require('./routes/authRoutes'));

app.use('/api/restaurants', restaurantRoutes);
app.use('/api/restaurants', menuItemRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));