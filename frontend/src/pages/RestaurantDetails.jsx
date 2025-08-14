import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MenuItemForm from '../components/MenuItemForm';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const [restaurantRes, menuRes] = await Promise.all([
        axios.get(`/api/restaurants/${id}`),
        axios.get(`/api/restaurants/${id}/menu`)
      ]);
      setRestaurant(restaurantRes.data);
      setMenuItems(menuRes.data);
    };
    fetchData();
  }, [id]);

  return (
    <div>
      <h1>{restaurant?.name}</h1>
      <p>{restaurant?.description}</p>
      
      <h2>Menu Items</h2>
      {menuItems.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>${item.price}</p>
        </div>
      ))}

      <MenuItemForm />
    </div>
  );
};