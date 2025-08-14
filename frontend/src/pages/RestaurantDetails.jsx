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

  useEffect(() => {
    if (!id || id.length !== 24) {
      setError('Invalid restaurant ID format');
      toast.error('Invalid restaurant ID');
      navigate('/restaurants');
      return;
    }

    const fetchData = async () => {
      try {
        console.log('Fetching restaurant with ID:', id);
        
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`, {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`, {
            headers: { 
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          })
        ]);

        console.log('API Responses:', {
          restaurant: restaurantRes.data,
          menu: menuRes.data
        });

        if (!restaurantRes.data?.success) {
          throw new Error(restaurantRes.data?.message || 'Failed to load restaurant');
        }

        setRestaurant(restaurantRes.data.data);
        setMenuItems(menuRes.data || []);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data
        });
        
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

    fetchData();
  }, [id, navigate]);

  if (loading) return <div className="p-4">Loading restaurant details...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!restaurant) return <div className="p-4">Restaurant not found</div>;

  const handleDeleteClick = (menuItem) => {
    setMenuItemToDelete(menuItem);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/restaurants/${id}/menu/${menuItemToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      );
            // Remove the deleted item from the state
      setMenuItems(menuItems.filter(item => item._id !== menuItemToDelete._id));
      toast.success('Menu item deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete menu item');
    } finally {
      setShowDeleteModal(false);
      setMenuItemToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setMenuItemToDelete(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-3xl font-bold">{restaurant.name}</h1>
        <p className="text-gray-600 mt-2">{restaurant.description}</p>
        
        <div className="mt-4 flex space-x-3">
          <Link
            to={`/restaurants/${id}/menu/new`}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Menu Item
          </Link>
          <Link
            to={`/restaurants`}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to List
          </Link>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Menu Items</h2>
      
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div key={item._id} className="bg-white rounded-lg shadow p-4 border border-gray-200 relative">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <p className="text-gray-600 my-2">{item.description}</p>
              <p className="font-semibold">${item.price.toFixed(2)}</p>
              {item.isVegetarian && (
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Vegetarian
                </span>
              )}

<div className="absolute top-2 right-2 flex space-x-2">
                <Link
                  to={`/restaurants/${id}/menu/${item._id}/edit`}
                  className="bg-blue-500 text-white p-1 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDeleteClick(item)}
                  className="bg-red-500 text-white p-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>

              {item.image && (
                <img 
                  src={`http://localhost:5000${item.image}`}
                  alt={item.name}
                  className="mt-2 h-32 w-full object-cover"
                  onError={(e) => {
                    e.target.src = '/placeholder-food.jpg';
                    e.target.alt = 'Image not available';
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-4 rounded-lg">
          <p>No menu items found. Add one to get started!</p>
        </div>
      )}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={menuItemToDelete?.name || ''}
      />
    </div>
  );
};

export default RestaurantDetails;