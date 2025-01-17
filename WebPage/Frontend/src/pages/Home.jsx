import React, { useEffect, useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../store/firebase-config'; // Ensure the Firebase config is properly set up

const Home = () => {
  const [turfs, setTurfs] = useState([]); // State to hold turf data
  const [loading, setLoading] = useState(true); // State to show loading state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const turfsCollection = collection(db, 'turfs'); // Reference the 'turfs' collection in Firestore
        const turfSnapshot = await getDocs(turfsCollection);
        const turfList = turfSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTurfs(turfList); // Set the fetched data to state
      } catch (err) {
        console.error('Error fetching turfs:', err);
        setError('Failed to fetch turfs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  return (
    <div>
      <section style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2d3748', marginBottom: '1rem' }}>
          Book Your Perfect Turf
        </h1>
        <p style={{ color: '#718096', maxWidth: '32rem', margin: '0 auto' }}>
          Find and book the best football turfs in your area. Whether you're planning a casual game or a tournament, we've got you covered.
        </p>
      </section>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#718096' }}>Loading turfs...</p>
      ) : error ? (
        <p style={{ textAlign: 'center', color: '#e53e3e' }}>{error}</p>
      ) : (
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {turfs.map((turf) => (
            <div
              key={turf.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <img
                src={turf.imageUrl}
                alt={turf.name}
                style={{ width: '100%', height: '12rem', objectFit: 'cover' }}
              />
              <div style={{ padding: '1.5rem' }}>
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    color: '#2d3748',
                    marginBottom: '0.5rem',
                  }}
                >
                  {turf.name}
                </h3>
                <p style={{ color: '#718096', marginBottom: '0.5rem' }}>{turf.description}</p>
                <p style={{ color: '#4a5568', marginBottom: '1rem', fontWeight: '500' }}>
                  📍 {turf.location}
                </p>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', color: '#718096' }}>
                    <Clock style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    <span>₹{turf.pricePerHour}/hour</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#718096' }}>
                    <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    <span>{turf.availability}</span>
                  </div>
                </div>
                <button
                  style={{
                    width: '100%',
                    backgroundColor: '#3182ce',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    transition: 'background-color 0.2s',
                  }}
                >
                  Chat & Book It
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
