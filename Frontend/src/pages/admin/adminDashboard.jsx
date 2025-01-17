import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../store/firebase-config'; // Firestore instance
import { toast } from 'react-toastify';
import AddTurf from './AddTurf';
import ManageTurfAvailability from './ManageTurfAvailability';
import UserActivityAnalytics from './UserActivityAnalytics';

const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    const checkAdminStatus = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists() && userDoc.data().role === 'admin') {
            setIsAdmin(true);
          } else {
            toast.error('Access denied. Admins only!');
            navigate('/admin/login'); // Redirect to admin login page
          }
        } catch (error) {
          console.error('Error checking admin status:', error);
          toast.error('Failed to verify admin status.');
          navigate('/admin/login'); // Redirect on error
        }
      } else {
        toast.error('You must be logged in to access this page.');
        navigate('/admin/login'); // Redirect if not logged in
      }
      setLoading(false);
    };

    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // This is a fallback; user will be redirected by `navigate`
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">Admin Dashboard</h1>

        <div className="space-y-8">
          <AddTurf />
          <ManageTurfAvailability />
          <UserActivityAnalytics />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
