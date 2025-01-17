import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../store/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user role from Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        if (userData.role === 'admin') {
          toast.success('Welcome Admin! Redirecting to Admin Dashboard...', {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/admin/dashboard'); // Redirect to Admin Dashboard
        } else {
          toast.error('Access denied. Admin credentials are required.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      } else {
        toast.error('User data not found. Please contact support.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage =
        errorCode === 'auth/user-not-found'
          ? 'No user found with this email. Please sign up.'
          : errorCode === 'auth/wrong-password'
          ? 'Incorrect password. Please try again.'
          : `Error: ${error.message}`;

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an admin account?{' '}
          <Link to="/admin/signup" className="text-blue-600 hover:text-blue-700">
            Admin Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
