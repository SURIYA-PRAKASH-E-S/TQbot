import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Added useLocation
import { useAuth } from '../hooks/useAuth';
import { db } from '../store/firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [userName, setUserName] = useState(null);
  const [userRole, setUserRole] = useState(null); // State to track user role
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation(); // To get the current route

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.name || 'User');
          setUserRole(userData.role || 'user'); // Fetch role (e.g., 'admin' or 'user')
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Determine if the current route is an admin page
  const isAdminPage = location.pathname.startsWith('/admin');

  if (isAdminPage && userRole !== 'admin') {
    return null; // Hide the navbar for non-admins on admin pages
  }

  return (
    <nav className="bg-white-600 text-black shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold hover:text-gray-200 text-decoration-none">
          PlayTurf
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          {loading ? (
            <span className="text-black-200">Loading...</span>
          ) : user ? (
            <>
              <span className="text-black-100">
                Welcome, {userName || 'User'}{' '}
                {userRole === 'admin' && (
                  <span className="bg-green-500 text-white px-2 py-1 ml-2 rounded text-sm">
                    Admin
                  </span>
                )}
              </span>
              {/* Bookings Tab */}
              <Link
                to="/bookings"
                className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-decoration-none"
              >
                Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="bg-yellow-500 hover:bg-red-600 text-black px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-white bg-gray-500 hover:bg-gray-600 px-4 py-2 rounded-lg text-decoration-none"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-decoration-none"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
