import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantRes, menuRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/restaurants/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
          }),
          axios.get(`http://localhost:5000/api/restaurants/${id}/menu`)
        ]);
        setRestaurant(restaurantRes.data);
        setMenuItems(menuRes.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">{restaurant.name}</h1>
      <p className="text-gray-600 mb-4">{restaurant.description}</p>
      
      <Link
        to={`/restaurants/${id}/menu/new`}
        className="mb-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Menu Item
      </Link>

      <h2 className="text-xl font-bold mb-4">Menu Items</h2>
      {menuItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map(item => (
            <div key={item._id} className="border p-4 rounded-lg">
              <h3 className="font-bold">{item.name}</h3>
              <p className="text-gray-600">{item.description}</p>
              <p className="font-semibold">${item.price}</p>
              {item.image && (
                <img 
                  src={`http://localhost:5000${item.image}`} 
                  alt={item.name}
                  className="mt-2 h-32 w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No menu items yet.</p>
      )}
    </div>
  );
};

export default RestaurantDetails;