'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { useApi } from '../hooks/useApi';

const AuthContext = createContext();
const googleProvider = new GoogleAuthProvider();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { request } = useApi();

  // Sincronizar usuario con la base de datos
  const syncUserWithDB = async (user) => {
    if (!user) return null;
    try {
      const users = await request('/api/users');
      let existingUser = users.find(u => u.id === user.uid);
      if (existingUser) {
        setDbUser(existingUser);
        return existingUser;
      }

      // Crear nuevo usuario en DB si no existe
      const newUser = await request('/api/users', {
        method: 'POST',
        body: JSON.stringify({ id: user.uid, email: user.email }),
      });
      setDbUser(newUser);
      return newUser;
    } catch (err) {
      console.error('Error sincronizando usuario con DB:', err);
      return null;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) await syncUserWithDB(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const register = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        dbUser,
        loading,
        login,
        loginWithGoogle,
        register,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
