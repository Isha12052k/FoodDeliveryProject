# Food Delivery System (FDS)

A full-stack web application for managing restaurants and menus, with future scope for order processing and delivery tracking.

**Prerequisite:** Please install the following software and create account in following web tools** **

* **Nodejs [**[https://nodejs.org/en](https://nodejs.org/en)]** **
* **Git [**[https://git-scm.com/](https://git-scm.com/)]** **
* **VS code editor** [[https://code.visualstudio.com/](https://code.visualstudio.com/)]** **
* **MongoDB Account** [[https://account.mongodb.com/account/login](https://account.mongodb.com/account/login)]** - In tutorial, we have also showed how can you create account and database: follow step number 2.**
* **GitHub Account** [[https://github.com/signup?source=login](https://github.com/signup?source=login)]** **

## Installation

1. Clone the repository:
   git clone https://github.com/your-username/food-delivery-system.git
   cd food-delivery-system

2. Install dependencies for both backend and frontend:
    cd backend
    npm install
    
    cd ../frontend
    npm install

## Configuration
1. Create a .env file in the backend directory
  MONGO_URI=your_mongodb_atlas_connection_string
  JWT_SECRET=your_jwt_secret_key
  PORT=5000

2. Configure the API base URL in frontend/src/axiosConfig.jsx
    const axiosInstance = axios.create({
      baseURL: 'http://localhost:5000/api',
      headers: { 'Content-Type': 'application/json' },
    });

3. Project Structure
food-delivery-system/
├── backend/
│   ├── controllers/       # Business logic
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── middleware/        # Authentication and other middleware
│   ├── app.js             # Express application setup
│   └── server.js          # Server initialization
│
├── frontend/
│   ├── public/            # Static files
│   └── src/
│       ├── components/    # React components
│       ├── pages/         # Application pages
│       ├── services/      # API service calls
│       └── App.js         # Main application component
│
├── .github/workflows/     # CI/CD configuration
└── README.md              # Project documentation

## Running the application
Type the following command in the root folder: npm run start (which will start both backend and frontend)

## Future Enhancements
The following features are planned for future development:
1. Order Management System
2. Delivery Tracking
3. Payment Gateway Integration
4. User Review System
5. Real-time Notifications
6. Admin functions enhancement
7. User view of restaurants and menu(would be more or less similar to that of the admin's)
---
