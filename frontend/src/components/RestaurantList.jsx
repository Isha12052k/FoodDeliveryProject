import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/restaurants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setRestaurants(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch restaurants');
        toast.error('Failed to load restaurants. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  if (loading) return <div className="p-4">Loading restaurants...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Your Restaurants</h2>
      {restaurants.length === 0 ? (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>No restaurants found. Create one to get started!</p>
          <Link 
            to="/restaurants/new" 
            className="mt-2 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Restaurant
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-2">{restaurant.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {restaurant.cuisineType.map((cuisine) => (
                  <span key={cuisine} className="bg-gray-100 px-2 py-1 text-xs rounded-full">
                    {cuisine}
                  </span>
                ))}
              </div>
              <Link
                to={`/restaurants/${restaurant._id}`}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View Details →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantList;