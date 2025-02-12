const express = require('express');
const cors = require('cors');
const { NlpManager } = require('node-nlp');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, where } = require('firebase/firestore');
const Papa = require('papaparse');
const fs = require('fs');

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCtwRfg2Fbr6YQEBZvt5_LV2zj6N8e7SpI",
  authDomain: "playturf-f6809.firebaseapp.com",
  projectId: "playturf-f6809",
  storageBucket: "playturf-f6809.filestorage.app",
  messagingSenderId: "391548622984",
  appId: "1:391548622984:web:9eae2ecf7d97b7ece9e73d"
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize NLP Manager
const manager = new NlpManager({ languages: ['en'] });

// Load CSV and Train Chatbot
const trainChatbot = async () => {
  console.log('Training Chatbot...');
  const csvData = fs.readFileSync('./turf_booking_faq.csv', 'utf8');
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });

  parsedData.data.forEach((row) => {
    const question = row['Question'];
    const answer = row['Answer'];
    if (question && answer) {
      manager.addDocument('en', question, question);
      manager.addAnswer('en', question, answer);
    }
  });

  await manager.train();
  manager.save();
  console.log('Training Completed.');
};

// Train the Chatbot
trainChatbot();

// Fetch available turfs from Firestore
const fetchAvailableTurfs = async () => {
  try {
    const turfsCollection = collection(db, 'turfs');
    const q = query(turfsCollection, where("availability", "==", "Available"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error fetching available turfs:', error);
    return [];
  }
};

// Fetch timeslots from the turfs collection
const fetchTimeSlots = async (turfName) => {
  try {
    const turfsCollection = collection(db, 'turfs');
    const q = query(turfsCollection, where("name", "==", turfName));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const turfData = snapshot.docs[0].data();
      return turfData.timeSlots || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching timeslots:', error);
    return [];
  }
};

app.post('/api/chat', async (req, res) => {
  const { query: userQuery } = req.body;

  try {
    const response = await manager.process('en', userQuery);
    
    if (userQuery.toLowerCase().includes('show turfs')) {
      const turfs = await fetchAvailableTurfs();
      const turfData = turfs.map(turf => ({
        name: turf.name,
        location: turf.location,
        imageUrl: turf.imageUrl,
        pricePerHour: turf.pricePerHour,
        button: {
          label1: "View Details",
          action1: `/turf-details/${turf.id}`,  // Navigate to Turf Details page

          label2: "Book Now",
          action2: `/checkout?turfId=${turf.id}` // Redirect to checkout/payment

        },
        
        // timeSlots:turf.timeSlots
      }));
      return res.json({ botReply: turfData, continueChat: true });
    }
    
    if (userQuery.toLowerCase().startsWith('show timeslots for')) {
      const turfName = userQuery.replace('show timeslots for', '').trim();
      const timeSlots = await fetchTimeSlots(turfName);
      
      if (timeSlots.length > 0) {
        return res.json({ botReply: `Available timeslots for ${turfName}: ${timeSlots.join(', ')}`, continueChat: true });
      } else {
        return res.json({ botReply: `No available timeslots found for ${turfName}.`, continueChat: true });
      }
    }
    
    if (response.answer) {
      return res.json({ botReply: response.answer, continueChat: true });
    }

    res.json({ botReply: "Type 'show turfs' to see the available turfs or 'show timeslots for [turf name]' to check availability.", continueChat: true });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
