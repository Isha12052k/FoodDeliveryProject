import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Restaurant Management</h2>
          <Link 
            to="/restaurants" 
            className="block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-center"
          >
            Manage Restaurants
          </Link>
        </div>
        
        {/* Add other dashboard cards as needed */}
      </div>
    </div>
  );
};

export default Dashboard;