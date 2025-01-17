import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, fetchUserDetails } from "../store/firebase-config"; // Ensure this exists and works

const ChatBot = () => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const details = await fetchUserDetails(currentUser.uid); // Ensure fetchUserDetails uses userId if needed
          setUserDetails(details || {}); // Default to an empty object if details are null/undefined
        } catch (error) {
          console.error("Failed to fetch user details:", error);
          setUserDetails(null); // Reset user details on error
        }
      } else {
        setUserDetails(null);
      }
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleChatBotClick = () => {
    if (user) {
      // Redirect to Questbot frontend if user is signed in
      window.location.href = 'http://localhost:5500/';
    } else {
      // Show a sign-in message
      alert('Please sign in to access the chatbot.');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleChatBotClick}
        className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
      {userDetails && (
        <div className="mt-2 bg-gray-100 p-2 rounded shadow-lg">
          <h4 className="text-sm font-medium">{userDetails.name || "User"}</h4> {/* Display user name or fallback */}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
