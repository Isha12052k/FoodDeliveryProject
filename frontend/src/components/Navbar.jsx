import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-stone-900 text-amber-50 p-4 flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold">Food Delivery System</Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">Tasks</Link>
            <Link to="/profile" className="mr-4">Profile</Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="mr-4">Login</Link>
            <Link
              to="/register"
              className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-4 py-2 rounded-lg border border-amber-300 hover:border-amber-400 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
