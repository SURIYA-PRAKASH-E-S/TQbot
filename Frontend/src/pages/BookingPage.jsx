import React, { useState, useEffect } from 'react';
import { db } from '../store/firebase-config'; // Firebase Firestore
import { collection, getDocs, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

const Schedule = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchBookings = async (userId) => {
    try {
      const bookingsQuery = query(
        collection(db, 'turfBookings'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookingDetails = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bookings: ", error);
      toast.error('Failed to fetch bookings!');
    }
  };

//   useEffect(() => {
//     const auth = getAuth();
//     onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setIsAuthenticated(true);
//         fetchBookings(user.uid);
//       } else {
//         setIsAuthenticated(false);
//         toast.error('You need to be logged in to view your schedule.');
//       }
//     });
//   }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold text-center mb-6">Your Turf Bookings</h2>

      {loading ? (
        <div>Loading your bookings...</div>
      ) : isAuthenticated ? (
        bookings.length > 0 ? (
          <table className="w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Turf Name</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Time Slot</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{booking.turfName}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.timeSlot}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center">No bookings found!</div>
        )
      ) : (
        <div>You must be logged in to view your schedule.</div>
      )}
    </div>
  );
};

export default Schedule;
