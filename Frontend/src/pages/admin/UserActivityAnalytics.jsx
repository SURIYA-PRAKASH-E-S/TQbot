// src/pages/UserActivityAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../store/firebase-config'; // Firebase Firestore
import { collection, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const UserActivityAnalytics = () => {
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchUserActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'userActivities'));
      const activities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserActivities(activities);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user activities: ", error);
      toast.error('Failed to fetch user activities!');
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        fetchUserActivities();
      } else {
        setIsAuthenticated(false);
        toast.error('You need to be logged in to view activities.');
      }
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">User Activity Analytics</h2>
      
      {loading ? (
        <div>Loading user activities...</div>
      ) : isAuthenticated ? (
        <div>
          <h3 className="text-lg font-semibold mb-4">Activity Overview</h3>
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Booked Turf</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {userActivities.map((activity) => (
                <tr key={activity.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{activity.userName}</td>
                  <td className="border border-gray-300 px-4 py-2">{activity.turfName}</td>
                  <td className="border border-gray-300 px-4 py-2">{activity.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div>You must be logged in to view user activities.</div>
      )}
    </div>
  );
};

export default UserActivityAnalytics;
