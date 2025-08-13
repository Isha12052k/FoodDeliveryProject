import React from 'react';
import { Link } from 'react-router-dom';
import RestaurantList from '../components/RestaurantList';
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
      
      <RestaurantList />
    </div>
  );
};

export default Restaurants;