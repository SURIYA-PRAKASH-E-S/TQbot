// src/pages/ManageTurfAvailability.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../../store/firebase-config'; // Firebase Firestore
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { toast } from 'react-toastify';

const ManageTurfAvailability = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState('');
  const [timeSlots, setTimeSlots] = useState([]); // For displaying time slots of the selected turf
  const [newSlot, setNewSlot] = useState('');

  const fetchTurfs = async () => {
    const querySnapshot = await getDocs(collection(db, 'turfs'));
    const turfsData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTurfs(turfsData);
  };

  const fetchTimeSlots = async (turfId) => {
    try {
      const turfDocRef = doc(db, 'turfs', turfId);
      const turfDocSnap = await getDoc(turfDocRef);  // Use getDoc to fetch a single document

      if (turfDocSnap.exists()) {
        setTimeSlots(turfDocSnap.data().timeSlots || []); // If timeSlots exists, set it, else use an empty array
      }
    } catch (error) {
      toast.error('Failed to fetch time slots!');
      console.error(error);
    }
  };

  const handleAddTimeSlot = async () => {
    if (!selectedTurf || !newSlot) {
      toast.error('Please select a turf and enter a valid time slot!');
      return;
    }

    try {
      const turfDocRef = doc(db, 'turfs', selectedTurf);
      const turfDocSnap = await getDoc(turfDocRef);

      if (turfDocSnap.exists()) {
        const existingSlots = turfDocSnap.data().timeSlots || [];
        const updatedSlots = [...existingSlots, newSlot]; // Add the new slot to existing slots

        // Update the timeSlots array in Firestore
        await updateDoc(turfDocRef, { timeSlots: updatedSlots });

        // Update the local state to reflect the new time slot
        setTimeSlots(updatedSlots);
        setNewSlot(''); // Clear the input field
        toast.success('Time slot added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add time slot!');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  useEffect(() => {
    if (selectedTurf) {
      fetchTimeSlots(selectedTurf);
    }
  }, [selectedTurf]);

  return (
    <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Manage Turf Availability</h2>
      
      <div className="mb-4">
        <label className="block text-gray-700">Select Turf</label>
        <select
          value={selectedTurf}
          onChange={(e) => setSelectedTurf(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
        >
          <option value="">Select Turf</option>
          {turfs.map((turf) => (
            <option key={turf.id} value={turf.id}>
              {turf.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">New Time Slot</label>
        <input
          type="text"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none"
          placeholder="e.g. 10:00 AM - 11:00 AM"
        />
      </div>

      <button
        onClick={handleAddTimeSlot}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
      >
        Add Time Slot
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Available Time Slots:</h3>
        <ul>
          {timeSlots.length > 0 ? (
            timeSlots.map((slot, index) => (
              <li key={index} className="text-gray-700">{slot}</li>
            ))
          ) : (
            <p className="text-gray-500">No time slots available for this turf.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ManageTurfAvailability;
