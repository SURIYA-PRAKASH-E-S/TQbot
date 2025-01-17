
import React from 'react';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

function SignIn() {
    const handleSignIn = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error during sign-in:", error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-mono font-bold mb-6 text-center">
                QuestBot
            </h1>
            <p className="text-xl mb-4">Sign in to continue</p>
            <button
                onClick={handleSignIn}
                className="bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg transition-all text-lg"
            >
                Sign in with Google
            </button>
        </div>
    );
}

export default SignIn;
// const handleSignIn = async () => {
//     const auth = getAuth();
//     const provider = new GoogleAuthProvider();

//     try {
//         await signInWithRedirect(auth, provider);
//     } catch (error) {
//         console.error("Error during sign-in:", error.message);
//     }
// };
