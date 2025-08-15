// Restaurants.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantList from '../components/RestaurantList';

const Restaurants = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Discover Restaurants</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your favorite dining spots and add new restaurants to share with others.
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <Link
            to="/restaurants/new"
            className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Restaurant
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <RestaurantList />
        </div>
      </div>
    </div>
  );
};

export default Restaurants;