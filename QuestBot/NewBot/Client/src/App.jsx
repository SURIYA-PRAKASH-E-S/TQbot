import React, { useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import "bootstrap/dist/css/bootstrap.min.css";
import TurfDetails from "./TurfDetails";
import CheckoutPage from "./CheckoutPage";
import TurfList from "./TurfList";

function App() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const titleRef = useRef(null);
    const inputRef = useRef(null);
    const chatRef = useRef(null);

    useEffect(() => {
        if (!titleRef.current) return;
        
        const text = titleRef.current.innerText;
        titleRef.current.innerHTML = "";
        text.split("").forEach((char) => {
            titleRef.current.innerHTML += `<span class="letter">${char}</span>`;
        });

        gsap.fromTo(
            titleRef.current.querySelectorAll(".letter"),
            { opacity: 0, x: -10 },
            { opacity: 1, x: 0, duration: 0.1, stagger: 0.1, delay: 0.5, ease: "power1.out" }
        );

        gsap.fromTo(
            inputRef.current,
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 1.5, delay: 1, ease: "bounce.out" }
        );
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [chat]);

    const sendMessage = async () => {
        if (!message.trim()) {
            setChat((prevChat) => [...prevChat, { user: "Bot", text: "Enter a message before sending." }]);
            return;
        }

        const userMessage = { user: "You", text: message };
        setChat((prevChat) => [...prevChat, userMessage]);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/chat", { query: message });

            if (Array.isArray(response.data.botReply)) {
                const turfCards = response.data.botReply.map((turf, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 shadow-md flex flex-col items-start">
                        <h3 className="text-lg font-bold">{turf.name}</h3>
                        <img src={turf.imageUrl} alt={turf.name} style={{ maxWidth: "150px", borderRadius: "5px", display: "block", marginTop: "5px" }} />
                        <p className="text-sm">📍 Location: {turf.location}</p>
                        <p className="text-sm">💰 Price: ₹{turf.pricePerHour}/hour</p>
                        <div className="gap-3">
                            <a href={`/turf-details/${turf.id}`} className="btn btn-success">View Details</a>
                            <a href={`/checkout?turfId=${turf.id}`}><button className="btn btn-primary">Book Now</button></a>
                        </div>
                    </div>
                ));
                setChat((prevChat) => [...prevChat, { user: "Bot", text: "All available turfs:", turfCards }]);
            } else {
                setChat((prevChat) => [...prevChat, { user: "Bot", text: response.data.botReply }]);
            }
        } catch (error) {
            setChat((prevChat) => [...prevChat, { user: "Bot", text: "Sorry, something went wrong. Please try again later." }]);
        }
    };

    return (
        <Router>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
                <h1 className="text-4xl font-mono font-bold mb-6 text-center" ref={titleRef}>QuestBot</h1>
                <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-lg">
                    <div ref={chatRef} className="p-4 h-96 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                        {chat.map((msg, index) => (
                            <div key={index} className={`max-w-[80%] px-4 py-2 rounded-lg ${msg.user === "You" ? "bg-blue-500 self-end text-right" : "bg-gray-700 self-start text-left"}`}>
                                <strong>{msg.user}:</strong> {msg.text}
                                {msg.turfCards && <div className="mt-3 grid grid-cols-1 gap-3">{msg.turfCards}</div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center p-4 border-t border-gray-700">
                        <input ref={inputRef} type="text" value={message} onChange={(e) => setMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="flex-1 bg-gray-700 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring focus:ring-blue-500" placeholder="Type your message..." />
                        <button onClick={sendMessage} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-all">Send</button>
                    </div>
                </div>
            </div>
            <Routes>
                <Route path="/" element={<TurfList />} />
                <Route path="/turf-details/:id" element={<TurfDetails />} />
                <Route path="/checkout" element={<CheckoutPage />} />
            </Routes>
        </Router>
    );
}

export default App;
