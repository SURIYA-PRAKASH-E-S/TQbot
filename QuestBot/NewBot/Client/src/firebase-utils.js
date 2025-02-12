import { collection, addDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Fetch all messages for a specific user.
 */
export const fetchMessages = async (userId) => {
    try {
        const messagesRef = collection(db, "messages");
        const q = query(messagesRef, where("userId", "==", userId), orderBy("timestamp", "asc"));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        if (error.code === "permission-denied") {
            console.error("Permission denied. Check Firestore rules.");
        } else {
            console.error("Error fetching messages:", error);
        }
        return [];
    }
};

/**
 * Store a new message in Firestore.
 */
export const storeMessage = async (userId, text, sender) => {
    try {
        const messagesRef = collection(db, "messages");
        await addDoc(messagesRef, { userId, text, sender, timestamp: new Date() });
    } catch (error) {
        console.error("Error storing message:", error);
    }
};
