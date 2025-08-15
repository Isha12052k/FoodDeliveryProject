import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const MenuItemForm = () => {
  const { restaurantId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Main Course',
    isVegetarian: false,
    image: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formPayload.append(key, value);
      });

      await axios.post(`/api/restaurants/${restaurantId}/menu`, formPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      toast.success('Menu item added!');
    } catch (error) {
      toast.error('Failed to add menu item');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields here */}
      <input 
        type="file" 
        onChange={(e) => setFormData({...formData, image: e.target.files[0]})} 
      />
      <button type="submit">Add Item</button>
    </form>
  );
};

export default MenuItemForm;

//menu item functionality basics completed