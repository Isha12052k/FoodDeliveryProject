import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MenuItemForm = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVegetarian: false,
    image: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formPayload = new FormData();
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('category', formData.category);
      formPayload.append('isVegetarian', formData.isVegetarian);
      if (formData.image) {
        formPayload.append('image', formData.image);
      }

      await axios.post(`http://localhost:5000/api/restaurants/${restaurantId}/menu`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      
      toast.success('Menu item added successfully!');
      navigate(`/restaurants/${restaurantId}`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to add menu item');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add Menu Item</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Form fields */}
        <div className="mb-4">
          <label className="block mb-2">Image</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded hover:bg-amber-700"
        >
          {isSubmitting ? 'Adding...' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default MenuItemForm;