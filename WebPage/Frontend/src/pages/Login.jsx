import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../store/firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'react-toastify'; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS

const Login = () => {
 // const [name,setUserName]=useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // User successfully logged in
        const user = userCredential.user;
        console.log('Login Successful:', user.email);

       /* // Determine user role (admin or regular user) based on email
        if (user.email === 'admin@example.com') {
          toast.success('Welcome Admin! Redirecting to Dashboard...', {
            position: 'top-right',
            autoClose: 3000,
          });
          navigate('/admin'); // Navigate to Admin Dashboard
        } else */{
          toast.success('Welcome! Redirecting to Home...', {
            position: 'top-right',
            autoClose: 3000,
          }
          );
          navigate('/'); // Navigate to User Dashboard or Home
        }
      })
      .catch((error) => {
        const errorCode = error.code;

        // Handle specific Firebase auth errors
        if (errorCode === 'auth/user-not-found') {
          toast.error('No user found with this email. Please sign up.', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else if (errorCode === 'auth/wrong-password') {
          toast.error('Incorrect password. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          toast.error(`Error: ${error.message}`, {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      });
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign In to PlayTurf</h2>
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
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700">
            Sign Up
          </Link>
        </p>
        <div className="mt-4 text-sm text-gray-600">
          {/* <p>Demo credentials:</p>
          <p>Admin: admin@example.com / admin</p>
          <p>User: user@example.com / user</p> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
