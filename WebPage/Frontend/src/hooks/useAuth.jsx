// useAuth.jsx
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User successfully signed out');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return { user, loading, logout };
};
