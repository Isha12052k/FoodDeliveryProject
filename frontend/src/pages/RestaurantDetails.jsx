// RestaurantDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [menuItemToDelete, setMenuItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchRestaurantData = async () => {
    try {
      const [restaurantRes, menuRes] = await Promise.all([
        axios.get(`http://localhost:5001/api/restaurants/${id}`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }),
        axios.get(`http://localhost:5001/api/restaurants/${id}/menu`, {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        })
      ]);

      if (!restaurantRes.data?.success) {
        throw new Error(restaurantRes.data?.message || 'Failed to load restaurant');
      }

      setRestaurant(restaurantRes.data.data);
      setMenuItems(menuRes.data || []);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      toast.error(errorMessage);

      if (err.response?.status === 403 || err.response?.status === 404) {
        navigate('/restaurants');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || id.length !== 24) {
      setError('Invalid restaurant ID format');
      toast.error('Invalid restaurant ID');
      navigate('/restaurants');
      return;
    }

    fetchRestaurantData();
  }, [id, navigate]);

  const handleDeleteClick = (menuItem) => {
    setMenuItemToDelete(menuItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `http://localhost:5001/api/restaurants/${id}/menu/${menuItemToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      );
      
      setMenuItems(prevItems => prevItems.filter(item => item._id !== menuItemToDelete._id));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
      await fetchRestaurantData();
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
      setMenuItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMenuItemToDelete(null);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md" role="alert">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back to Restaurants
        </button>
      </div>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 max-w-md" role="alert">
        <p>Restaurant not found</p>
        <button 
          onClick={() => navigate('/restaurants')}
          className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Back to Restaurants
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Restaurant Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{restaurant.name}</h1>
                <p className="text-gray-600 mt-2">{restaurant.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {restaurant.cuisineType.map((cuisine) => (
                    <span key={cuisine} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                      {cuisine}
                    </span>
                  ))}
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-700">Address</h3>
                    <p className="text-gray-600">
                      {restaurant.address.street}<br />
                      {restaurant.address.city}, {restaurant.address.state} {restaurant.address.zipCode}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700">Contact</h3>
                    <p className="text-gray-600">
                      {restaurant.contact.phone}<br />
                      {restaurant.contact.email}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                <Link
                  to={`/restaurants/${id}/menu/new`}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Menu Item
                </Link>
                <Link
                  to="/restaurants"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                  Back to List
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Opening Hours</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {restaurant.openingHours.map((day) => (
                <div key={day.day} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700">{day.day}</h3>
                  {day.isClosed ? (
                    <p className="text-red-500">Closed</p>
                  ) : (
                    <p className="text-gray-600">
                      {day.open} - {day.close}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Menu</h2>
              <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">
                {menuItems.length} items
              </span>
            </div>
            
            {menuItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuItems.map(item => (
                  <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    {item.image && (
                      <div className="h-48 overflow-hidden">
                        <img 
  src={item.image 
    ? `http://localhost:5001${item.image}`
    : 'http://localhost:5001/public/images/placeholder-food.jpg'
  }
  alt={item.name}
  className="w-full h-full object-cover"
  onError={(e) => {
    console.error('Image load failed:', e.target.src);
    e.target.src = 'http://localhost:5001/public/images/placeholder-food.jpg';
    e.target.alt = 'Image not available';
  }}
/>
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="font-semibold text-amber-600">${item.price.toFixed(2)}</p>
                      </div>
                      <p className="text-gray-600 my-2">{item.description}</p>
                      {item.isVegetarian && (
                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mb-2">
                          Vegetarian
                        </span>
                      )}
                      <div className="flex justify-end space-x-2 mt-4">
                        <Link
                          to={`/restaurants/${id}/menu/${item._id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          disabled={isDeleting}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No menu items yet</h3>
                <p className="mt-1 text-sm text-gray-500">Add your first menu item to get started</p>
                <div className="mt-6">
                  <Link
                    to={`/restaurants/${id}/menu/new`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Add Menu Item
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={menuItemToDelete?.name || ''}
        isProcessing={isDeleting}
      />
    </div>
  );
};

export default RestaurantDetails;