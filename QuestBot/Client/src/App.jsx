import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import gsap from 'gsap';
import { db, auth, database } from './firebase-config';  // Import Firestore and Realtime Database
import { ref, set, get } from 'firebase/database'; // Realtime Database operations
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firestore operations

function App() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);
    const titleRef = useRef(null); // Reference for the title animation
    const inputRef = useRef(null); // Reference for the input box animation
    const chatRef = useRef(null); // Reference for the chat container to auto-scroll

    // GSAP animation for the title and input
    useEffect(() => {
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = ''; // Clear text for animation

        // Split text into spans for animation
        text.split('').forEach((char) => {
            titleRef.current.innerHTML += `<span class="letter">${char}</span>`;
        });

        gsap.fromTo(
            titleRef.current.querySelectorAll('.letter'),
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.1, stagger: 0.1, delay: 0.5, ease: 'power1.out' }
        );

        gsap.fromTo(
            inputRef.current,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1.5, delay: 1, ease: 'bounce.out' }
        );
    }, []);

    // Fetch chat history on component mount
    // useEffect(() => {
    //     const fetchChatHistory = async () => {
    //         const userId = auth.currentUser?.uid;
    //         if (!userId) return;

    //         try {
    //             // Fetch from Firestore
    //             const chatDoc =  await getDoc(doc(db, 'chats', userId));
    //             if (chatDoc.exists()) {
    //                 setChat(chatDoc.data().messages || []);
    //             } else {
    //                 console.log('No chat history found for this user.');
    //             }

    //             // Alternatively, fetch from Realtime Database (uncomment if needed)
    //             /*
    //             const chatRefRealtime = ref(database, 'chats/' + userId);
    //             const chatSnapshot = await get(chatRefRealtime);
    //             if (chatSnapshot.exists()) {
    //                 setChat(chatSnapshot.val().messages || []);
    //             } else {
    //                 console.log('No chat history found in Realtime Database.');
    //             }
    //             */
    //         } catch (error) {
    //             console.error('Error fetching chat history:', error);
    //         }
    //     };

    //     fetchChatHistory();
    // }, []);

    // Auto-scroll to bottom with smooth scrolling
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [chat]);

    // Handle sending messages
    const sendMessage = async () => {
        if (!message.trim()) return;

        console.log(message)

        const userMessage = { user: 'You', text: message };

        setMessage(''); // Clear the input field
        console.log(message)

        // Optimistically update chat
        setChat((prevChat) => [...prevChat, userMessage]);

        try {
            const response = await axios.post('http://localhost:5000/api/chat', { query: message });
            const botMessage = {
                user: 'Bot',
                text: `${response.data.botReply}`,
            };
            setChat((prevChat) => [...prevChat, botMessage]);

    /*

            // If you want to store the chat in Firestore (Example)
            const userId = auth.currentUser?.uid; // Get user ID
            if (userId) {
                await setDoc(doc(db, 'chats', userId), {
                    messages: [...chat, userMessage, botMessage],
                    timestamp: new Date(),
                });
            }

            // Store chat in Realtime Database (Example)
            if (userId) {
                const chatRefRealtime = ref(database, 'chats/' + userId);
                await set(chatRefRealtime, {
                    messages: [...chat, userMessage, botMessage],
                    timestamp: new Date().toISOString(),
                });
            }
    */
   
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage = {
                user: 'Bot',
                text: 'Sorry, something went wrong. Please try again later.',
            };
            setChat((prevChat) => [...prevChat, errorMessage]);
        }
    };

    // Navigate back to the home page
    const navigateHome = () => {
        window.location.href = 'http://localhost:5173/';
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-mono font-bold mb-6 text-center" ref={titleRef}>
                QuestBot
            </h1>
            <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-lg">
                <div ref={chatRef} className="p-4 h-96 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            className={`max-w-[80%] px-4 py-2 rounded-lg ${
                                msg.user === 'You' ? 'bg-blue-500 self-end text-right' : 'bg-gray-700 self-start text-left'
                            }`}
                        >
                            <strong>{msg.user}:</strong> {msg.text}
                        </div>
                    ))}
                </div>
                <div className="flex items-center p-4 border-t border-gray-700">
                    <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                        className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-all"
                    >
                        Send
                    </button>
                </div>
            </div>
            {/* Back to Home Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={navigateHome}
                    className="bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-all"
                    title="Back to Home"
                >
                    <i className="fas fa-home text-lg"></i>
                </button>
            </div>

            {/* <div className="fixed center-4 left-4">
                    <div className="row">
                        <iframe src=" http://localhost:5173/" width= "100%" height="200px" frameborder="0"></iframe>
                    </div>
                </div> */}
        </div>
    );
}

export default App;
