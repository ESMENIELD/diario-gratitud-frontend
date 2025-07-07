'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { auth } from '../firebase/config';
import { useRouter } from 'next/navigation';



const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();
const logout = () => signOut(auth);


export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log('Usuario detectado en el context:', user);
      setUser(user);
      setLoading(false);
    });
    if (user) {
      router.push('/dashboard');
    }
    return () => unsubscribe();
  }, [user]);

  const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const register = (email, pass) => createUserWithEmailAndPassword(auth, email, pass);
  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, resetPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
