// RestaurantList.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationModal from './ConfirmationModal';

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [restaurantToDelete, setRestaurantToDelete] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/restaurants', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setRestaurants(response.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch restaurants. Please try again later.');
        toast.error('Failed to load restaurants. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`http://localhost:5001/api/restaurants/${restaurantToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      setRestaurants(restaurants.filter(r => r._id !== restaurantToDelete._id));
      toast.success('Restaurant deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete restaurant. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setRestaurantToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setRestaurantToDelete(null);
  };

  if (loading) return (
    <div className="p-12 flex justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );

  if (error) return (
    <div className="p-8 text-center">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
        <p>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">No restaurants yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first restaurant.</p>
          <div className="mt-6">
            <Link
              to="/restaurants/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
            >
              Add Restaurant
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant._id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{restaurant.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{restaurant.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {restaurant.cuisineType.map((cuisine) => (
                    <span key={cuisine} className="bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full">
                      {cuisine}
                    </span>
                  ))}
                </div>
                
                <div className="flex justify-between items-center">
                  <Link
                    to={`/restaurants/${restaurant._id}`}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm flex items-center"
                  >
                    View Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  <div className="flex space-x-3">
                    <Link
                      to={`/restaurants/edit/${restaurant._id}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(restaurant)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link
                    to={`/restaurants/${restaurant._id}/menu/new`}
                    className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Menu Item
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Confirm Deletion"
        message={`Are you sure you want to delete "${restaurantToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};

export default RestaurantList;