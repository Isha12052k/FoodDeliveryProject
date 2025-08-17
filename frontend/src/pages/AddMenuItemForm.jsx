import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddMenuItemForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVegetarian: false
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await axios.post(
        `http://localhost:5001/api/restaurants/${restaurantId}/menu`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('userToken')}`
          }
        }
      );
      toast.success('Menu item added successfully!');
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-6">Add Menu Item</h1>
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
          <label className="block mb-1">Image</label>
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
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Saving...' : 'Save Menu Item'}
        </button>
      </form>
    </div>
  );
};

export default AddMenuItemForm;