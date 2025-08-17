import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EditMenuItemForm = () => {
  const { restaurantId, menuItemId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVegetarian: false
  });
  const [image, setImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/restaurants/${restaurantId}/menu/${menuItemId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('userToken')}`
            }
          }
        );
        
        setFormData({
          name: response.data.name,
          description: response.data.description,
          price: response.data.price,
          category: response.data.category,
          isVegetarian: response.data.isVegetarian
        });
        
        if (response.data.image) {
          setCurrentImage(response.data.image);
        }
        
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load menu item');
        navigate(`/restaurants/${restaurantId}`);
      }
    };

    fetchMenuItem();
  }, [restaurantId, menuItemId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('isVegetarian', formData.isVegetarian);
    if (image) data.append('image', image);

    try {
      await axios.put(
        `http://localhost:5001/api/restaurants/${restaurantId}/menu/${menuItemId}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      );
      toast.success('Menu item updated successfully!');
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to update menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-4">Loading menu item...</div>;

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Edit Menu Item</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>

        <div>
          <label className="block mb-1">Price *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1">Category *</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-2 border rounded"
          >
            <option value="Main Course">Main Course</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isVegetarian}
            onChange={(e) => setFormData({...formData, isVegetarian: e.target.checked})}
            className="mr-2"
          />
          <label>Vegetarian</label>
        </div>

        <div>
          <label className="block mb-1">Current Image</label>
          {currentImage ? (
            <img 
              src={`http://localhost:5001${currentImage}`} 
              alt="Current menu item" 
              className="h-32 w-full object-cover mb-2"
            />
          ) : (
            <p>No image currently set</p>
          )}
        </div>

        <div>
          <label className="block mb-1">New Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Updating...' : 'Update Menu Item'}
        </button>
      </form>
    </div>
  );
};

export default EditMenuItemForm;

//edit form