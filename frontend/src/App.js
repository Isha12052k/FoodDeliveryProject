import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import Dashboard from './pages/Dashboard';
import Restaurants from './pages/Restaurants';
import AddRestaurantForm from './components/AddRestaurantForm';
import EditRestaurantForm from './components/EditRestaurantForm';
import AddMenuItemForm from './pages/AddMenuItemForm';
import RestaurantDetails from './pages/RestaurantDetails';
import EditMenuItemForm from './pages/EditMenuItemForm';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/new" element={<AddRestaurantForm />} />
        <Route path="/restaurants/edit/:id" element={<EditRestaurantForm />} />
        <Route path="/restaurants/:restaurantId/menu/new" element={<AddMenuItemForm />} />
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/restaurants/:restaurantId/menu/:menuItemId/edit" element={<EditMenuItemForm />} />
      </Routes>
    </Router>
  );
}

export default App;
