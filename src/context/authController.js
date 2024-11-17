import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase'; // Firebase authentication and Firestore setup
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state includes admin status
  const [loading, setLoading] = useState(true);

  // Function to fetch user data from Firestore
  const fetchUserData = async (uid) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        return userDocSnap.data();
      } else {
        console.error('No user document found in Firestore');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Firebase onAuthStateChanged to monitor login status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userCredential) => {
      if (userCredential) {
        const uid = userCredential.uid;
        const userData = await fetchUserData(uid);

        if (userData) {
          setUser({
            uid,
            email: userCredential.email,
            username: userData.username,
            isAdmin: userData.isAdmin || false, // Fetch admin status from Firestore
          });
        }
      } else {
        setUser(null); // No user is logged in
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function (optional, for manual control)
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userData = await fetchUserData(uid);

      if (userData) {
        setUser({
          uid,
          email: userCredential.user.email,
          username: userData.username,
          isAdmin: userData.isAdmin || false,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const value = {
    user,
    isAdmin: user?.isAdmin || false, // Expose admin status for role-based access
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
