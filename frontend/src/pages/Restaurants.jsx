import React from 'react';
import { Link } from 'react-router-dom';
import AddRestaurantForm from '../components/AddRestaurantForm';

const Restaurants = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Restaurants</h1>
        <Link
          to="/restaurants/new"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Restaurant
        </Link>
      </div>
      
      {/* Restaurant List would go here */}
      
      {/* Add Restaurant Form (or could be separate route) */}
      <AddRestaurantForm />
    </div>
  );
};

export default Restaurants;